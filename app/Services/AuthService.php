<?php

namespace App\Services;

use App\Constants\ReservedSlugs;
use App\Constants\ResponseMessages;
use App\Constants\UserRoles;
use App\Jobs\Mautic\AddToMautic;
use App\Jobs\Mautic\SetVerifyMautic;
use App\Jobs\Mautic\UpdateLastActiveMautic;
use App\Jobs\SenderNet\AddToSenderNet;
use App\Jobs\SenderNet\SetVerifySenderNet;
use App\Models\Company;
use App\Models\Landing;
use App\Models\Role;
use App\Models\User;
use App\Notifications\VerifyUserCode;
use App\Notifications\WelcomeMessage;
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
     * Attempt login with identifier (email or landing slug).
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
     * Find user by email or landing slug.
     */
    protected function findUserByIdentifier(string $identifier): ?User
    {
        // If contains @, search by email
        if (str_contains($identifier, '@')) {
            return User::where('email', $identifier)->first();
        }

        // Search by landing slug (the unique Linkea handle)
        $landing = Landing::where('slug', $identifier)
            ->orWhere('domain_name', $identifier)
            ->first();

        if ($landing) {
            return $landing->user;
        }

        return null;
    }

    /**
     * Register a new user with full setup (Standard Flow).
     *
     * @return array{user: User, token: string}
     */
    public function register(array $data): array
    {
        return DB::transaction(function () use ($data) {
            $linkeaHandle = strtolower($data['linkea_handle']);
            $email = strtolower($data['email']);

            // Create user
            $user = $this->userRepository->create([
                'first_name' => $data['first_name'] ?? ucfirst($linkeaHandle),
                'last_name' => $data['last_name'] ?? '',
                'name' => $data['name'] ?? ucfirst($linkeaHandle),
                'email' => $email,
                'password' => Hash::make($data['password']),
                'verification_code' => $this->generateVerificationCode(),
                'settings' => ['autoSave' => true],
            ]);

            // Complete the setup (company, landing, etc.)
            $this->completeSetup($user, $linkeaHandle);

            // Generate token
            $token = $user->createToken('auth_token')->plainTextToken;

            return [
                'user' => $user->fresh(),
                'token' => $token,
            ];
        });
    }

    /**
     * Create only the user without company/landing (Social Initial Flow).
     */
    public function createSocialUser(array $data): User
    {
        return $this->userRepository->create([
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'] ?? '',
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'verification_code' => $this->generateVerificationCode(),
            'settings' => ['autoSave' => true],
        ]);
    }

    /**
     * Complete the user setup (Company, Landing, Jobs).
     * 
     * @param User $user The user to complete setup for
     * @param string $linkeaHandle The unique Linkea handle (landing slug)
     */
    public function completeSetup(User $user, string $linkeaHandle): void
    {
        // Create company with display name
        $displayName = $user->first_name ?: ucfirst($linkeaHandle);
        $company = Company::create([
            'name' => $displayName,
            'owner_id' => $user->id,
        ]);

        // Update user with company
        $user->update([
            'company_id' => $company->id,
        ]);

        // Assign admin role
        $this->assignRole($user, UserRoles::ADMIN);

        // Create default landing with the unique Linkea handle
        $this->landingService->createDefault($user, $linkeaHandle);

        // Send verification email notification (queued)
        if (!$user->verified_at) {
            $user->notify(new VerifyUserCode());
        } else {
            // If already verified (Social login), send Welcome directly
            $user->notify(new WelcomeMessage());
        }

        // Dispatch CRM/Marketing jobs (queued)
        // isVerified=true for social login users who are already verified
        $isVerified = (bool) $user->verified_at;
        AddToMautic::dispatch($user);
        AddToSenderNet::dispatch($user, [], true, $isVerified);
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

        // Send welcome email notification (queued)
        $user->notify(new WelcomeMessage());

        // Dispatch CRM/Marketing jobs to mark as verified (queued)
        SetVerifyMautic::dispatch($user);
        SetVerifySenderNet::dispatch($user);

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
     * Check if a Linkea handle (landing slug) is available.
     *
     * Only checks the Landing table since that's the only unique identifier.
     *
     * @param string $handle The Linkea handle to check
     * @param User|null $currentUser The current authenticated user (to exclude their own landing)
     * @return array{available: bool, message: string}
     */
    public function checkUsernameAvailability(string $handle, ?User $currentUser = null): array
    {
        if (empty($handle)) {
            return [
                'available' => false,
                'message' => 'El nombre de usuario es requerido',
            ];
        }

        // Validate format first
        $formatValidation = StringHelper::validateHandle($handle);
        if (!$formatValidation['valid']) {
            return [
                'available' => false,
                'message' => $formatValidation['message'],
            ];
        }

        $normalizedHandle = StringHelper::normalizeHandle($handle);

        // Check reserved slugs (root users can bypass this)
        $isRoot = $currentUser && $currentUser->hasRole(UserRoles::ROOT);
        if (!$isRoot && ReservedSlugs::isReserved($normalizedHandle)) {
            return [
                'available' => false,
                'message' => 'Este nombre de usuario no esta disponible',
            ];
        }

        // Check collision with existing landing slugs (the only unique constraint)
        $landingQuery = Landing::where(function ($q) use ($normalizedHandle) {
            $q->where('slug', $normalizedHandle)
                ->orWhere('domain_name', $normalizedHandle);
        });

        if ($currentUser) {
            $landingQuery->where('user_id', '!=', $currentUser->id);
        }

        if ($landingQuery->exists()) {
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
