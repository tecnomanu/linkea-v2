<?php

namespace App\Services;

use App\Constants\ReservedSlugs;
use App\Constants\ResponseMessages;
use App\Constants\UserRoles;
use App\Jobs\Mautic\AddToMautic;
use App\Jobs\Mautic\SetVerifyMautic;
use App\Jobs\Mautic\UpdateLastActiveMautic;
use App\Models\Company;
use App\Models\Landing;
use App\Models\Role;
use App\Models\User;
use App\Notifications\VerifyUserCode;
use App\Repositories\Contracts\UserRepository;
use App\Support\Helpers\StringHelper;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * Service for authentication operations.
 */
class AuthService
{
    public function __construct(
        protected UserRepository $userRepository,
        protected LandingService $landingService
    ) {}

    /**
     * Attempt login with credentials (legacy method using username).
     *
     * @return array{user: User, token: string}|null
     */
    public function login(array $credentials): ?array
    {
        $username = strtolower($credentials['username']);

        if (!Auth::attempt(['username' => $username, 'password' => $credentials['password']])) {
            return null;
        }

        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
        ];
    }

    /**
     * Attempt login with identifier (email, username, or landing slug).
     * Supports login with email address OR linkea handle (landing slug).
     */
    public function loginWithIdentifier(string $identifier, string $password): bool
    {
        $identifier = strtolower(trim($identifier));
        $user = $this->findUserByIdentifier($identifier);

        if (!$user) {
            return false;
        }

        if (!Auth::attempt(['email' => $user->email, 'password' => $password])) {
            return false;
        }

        // Dispatch Mautic job to update last active (queued)
        UpdateLastActiveMautic::dispatch($user);

        return true;
    }

    /**
     * Find user by email, username, or landing slug.
     */
    protected function findUserByIdentifier(string $identifier): ?User
    {
        // If contains @, search by email
        if (str_contains($identifier, '@')) {
            return User::where('email', $identifier)->first();
        }

        // Search by username first
        $user = User::where('username', $identifier)->first();
        if ($user) {
            return $user;
        }

        // Search by landing slug
        $landing = Landing::where('slug', $identifier)
            ->orWhere('domain_name', $identifier)
            ->first();

        if ($landing) {
            return $landing->user;
        }

        return null;
    }

    /**
     * Register a new user.
     *
     * @return array{user: User, token: string}
     */
    public function register(array $data): array
    {
        return DB::transaction(function () use ($data) {
            $username = strtolower($data['username']);
            $email = strtolower($data['email']);

            // Create user
            $user = $this->userRepository->create([
                'first_name' => $data['first_name'] ?? ucfirst($username),
                'last_name' => $data['last_name'] ?? '',
                'name' => $data['name'] ?? ucfirst($username),
                'username' => $username,
                'email' => $email,
                'password' => Hash::make($data['password']),
                'verification_code' => $this->generateVerificationCode(),
                'settings' => ['autoSave' => true],
            ]);

            // Create company
            $company = Company::create([
                'name' => ucfirst($username),
                'slug' => $username,
                'owner_id' => $user->id,
            ]);

            // Update user with company
            $user->company_id = $company->id;
            $user->save();

            // Assign admin role
            $this->assignRole($user, UserRoles::ADMIN);

            // Create default landing
            $this->landingService->createDefault($user, $username);

            // Send verification email notification (queued)
            $user->notify(new VerifyUserCode());

            // Generate token
            $token = $user->createToken('auth_token')->plainTextToken;

            // Dispatch Mautic job to add contact (queued)
            AddToMautic::dispatch($user);

            return [
                'user' => $user->fresh(),
                'token' => $token,
            ];
        });
    }

    /**
     * Resend verification code to user.
     */
    public function resendVerificationCode(User $user): void
    {
        // Generate new verification code
        $user->update([
            'verification_code' => $this->generateVerificationCode(),
        ]);

        // Send verification email notification (queued)
        $user->notify(new VerifyUserCode());
    }

    /**
     * Verify email with code.
     */
    public function verifyEmail(string $code, ?string $userId = null): bool
    {
        $user = Auth::user() ?? ($userId ? User::find($userId) : null);

        if (!$user || $user->verification_code != $code) {
            return false;
        }

        $user->update(['verified_at' => Carbon::now()]);

        // Dispatch Mautic job to mark as verified (queued)
        SetVerifyMautic::dispatch($user);

        return true;
    }

    /**
     * Request password reset.
     */
    public function requestPasswordReset(string $email): ?string
    {
        $user = User::where('email', $email)->first();

        if (!$user) {
            return null;
        }

        $token = sha1(Str::random(32));

        DB::table('password_reset_tokens')->insert([
            'email' => $email,
            'token' => $token,
            'created_at' => Carbon::now(),
        ]);

        return $token;
    }

    /**
     * Reset password with token.
     */
    public function resetPassword(string $token, string $password): bool
    {
        $record = DB::table('password_reset_tokens')
            ->where('token', $token)
            ->first();

        if (!$record) {
            return false;
        }

        // Check expiration (24h)
        if (Carbon::now()->diffInHours($record->created_at) > 24) {
            return false;
        }

        $user = User::where('email', $record->email)->first();

        if (!$user) {
            return false;
        }

        $user->update(['password' => Hash::make($password)]);

        DB::table('password_reset_tokens')
            ->where('token', $token)
            ->delete();

        return true;
    }

    /**
     * Logout user (revoke current token).
     */
    public function logout(User $user): void
    {
        $user->currentAccessToken()?->delete();
    }

    /**
     * Assign role to user.
     */
    protected function assignRole(User $user, string $roleType): void
    {
        $role = Role::where('type', $roleType)->first();

        if ($role) {
            $user->roles()->attach($role);
        }
    }

    /**
     * Generate 6-digit verification code.
     */
    protected function generateVerificationCode(): int
    {
        return rand(100000, 999999);
    }

    /**
     * Check if username is available for registration.
     *
     * @return array{available: bool, message: string}
     */
    public function checkUsernameAvailability(string $username): array
    {
        if (empty($username)) {
            return [
                'available' => false,
                'message' => 'El nombre de usuario es requerido',
            ];
        }

        // Validate format first
        $formatValidation = StringHelper::validateHandle($username);
        if (!$formatValidation['valid']) {
            return [
                'available' => false,
                'message' => $formatValidation['message'],
            ];
        }

        $normalizedUsername = StringHelper::normalizeHandle($username);

        // Check reserved slugs
        if (ReservedSlugs::isReserved($normalizedUsername)) {
            return [
                'available' => false,
                'message' => 'Este nombre de usuario no esta disponible',
            ];
        }

        // Check if username exists in users table
        if (User::where('username', $normalizedUsername)->exists()) {
            return [
                'available' => false,
                'message' => ResponseMessages::USERNAME_TAKEN,
            ];
        }

        // Check collision with existing landing slugs
        $existsInLandings = Landing::where('slug', $normalizedUsername)
            ->orWhere('domain_name', $normalizedUsername)
            ->exists();

        if ($existsInLandings) {
            return [
                'available' => false,
                'message' => ResponseMessages::USERNAME_TAKEN,
            ];
        }

        return [
            'available' => true,
            'message' => 'Nombre de usuario disponible',
        ];
    }
}
