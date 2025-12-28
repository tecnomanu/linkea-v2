<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\AuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Exception;

class SocialAuthController extends Controller
{
    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Redirect the user to the provider authentication page.
     * Used for full page redirect flow (optional if using client button).
     */
    public function redirect(string $provider)
    {
        if (!in_array($provider, ['google', 'apple'])) {
            abort(404);
        }

        return Socialite::driver($provider)->redirect();
    }


    /**
     * Find existing user or create a new one.
     *
     * @param \Laravel\Socialite\Contracts\User $socialUser
     * @param string $provider
     * @return User
     */
    protected function findOrCreateUser($socialUser, $provider)
    {
        $idColumn = $provider . '_id';

        // 1. Check if user exists by Social ID
        $user = User::where($idColumn, $socialUser->getId())->first();
        if ($user) {
            return $user;
        }

        // 2. Check if user exists by Email
        $user = User::where('email', $socialUser->getEmail())->first();
        if ($user) {
            // Link the account
            $user->update([
                $idColumn => $socialUser->getId(),
                'avatar' => $user->avatar ?? $socialUser->getAvatar(),
                'verified_at' => $user->verified_at ?? now(),
            ]);
            return $user;
        }

        // 3. Create new user structure (but NOT company/landing yet)
        $fullName = $socialUser->getName() ?? $socialUser->getNickname() ?? explode('@', $socialUser->getEmail())[0];
        $nameParts = explode(' ', $fullName, 2);
        $firstName = $nameParts[0];
        $lastName = $nameParts[1] ?? '';

        $data = [
            'email' => $socialUser->getEmail(),
            'password' => Str::random(16),
            'first_name' => $firstName,
            'last_name' => $lastName,
            'name' => $fullName,
        ];

        // Call createSocialUser instead of register
        $user = $this->authService->createSocialUser($data);

        $user->update([
            $idColumn => $socialUser->getId(),
            'avatar' => $socialUser->getAvatar(),
            'verified_at' => now(),
        ]);

        return $user;
    }

    public function callback(Request $request, string $provider)
    {
        if (!in_array($provider, ['google', 'apple'])) {
            abort(404);
        }

        try {
            if ($request->has('token')) {
                $socialUser = Socialite::driver($provider)->userFromToken($request->token);
            } else {
                $socialUser = Socialite::driver($provider)->user();
            }
        } catch (Exception $e) {
            return redirect()->route('login')->withErrors([
                'email' => 'Error al autenticar con ' . ucfirst($provider) . ': ' . $e->getMessage()
            ]);
        }

        $user = $this->findOrCreateUser($socialUser, $provider);
        Auth::login($user);
        request()->session()->regenerate();

        // Check if user has completed setup (has company/landing)
        if (!$user->company_id) {
            return redirect()->route('auth.setup.username');
        }

        return redirect()->intended('/panel');
    }
}
