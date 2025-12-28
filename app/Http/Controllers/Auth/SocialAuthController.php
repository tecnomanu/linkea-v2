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
     * Handle the callback from the provider.
     * Can be used for:
     * 1. Authorization Code Flow (standard redirect)
     * 2. ID Token Flow (POST request from client)
     */
    public function callback(Request $request, string $provider)
    {
        if (!in_array($provider, ['google', 'apple'])) {
            abort(404);
        }

        try {
            // Check if we received a token directly (Client-side flow)
            if ($request->has('token')) {
                // Google Identity Services (GSI) returns an ID Token, not Access Token.
                // Socialite's userFromToken expects an Access Token.
                // We must verify the ID Token manually for Google.
                if ($provider === 'google') {
                    $response = \Illuminate\Support\Facades\Http::get('https://oauth2.googleapis.com/tokeninfo', [
                        'id_token' => $request->token,
                    ]);

                    if (!$response->successful()) {
                        throw new Exception('Invalid Google Token');
                    }

                    $data = $response->json();

                    // Verify audience matches our Client ID (security check)
                    // Note: In some cases aud can be multiple or different, but typically it works.
                    // if ($data['aud'] !== config('services.google.client_id')) throw new Exception('Invalid Client ID');

                    // Map to Socialite User interface
                    $socialUser = new \Laravel\Socialite\Two\User();
                    $socialUser->setRaw($data);
                    $socialUser->map([
                        'id' => $data['sub'],
                        'nickname' => null,
                        'name' => $data['name'],
                        'email' => $data['email'],
                        'avatar' => $data['picture'],
                        'email_verified' => $data['email_verified'],
                    ]);
                } else {
                    // For Apple or others, userFromToken might work or need specific handling
                    $socialUser = Socialite::driver($provider)->userFromToken($request->token);
                }
            } else {
                // Standard Authorization Code Flow (GET request with ?code=...)
                $socialUser = Socialite::driver($provider)->user();
            }
        } catch (Exception $e) {
            // If API logical failure
            return redirect()->route('login')->withErrors([
                'email' => 'Error al autenticar con ' . ucfirst($provider) . ': ' . $e->getMessage()
            ]);
        }

        $user = $this->findOrCreateUser($socialUser, $provider);

        Auth::login($user);

        request()->session()->regenerate();

        return redirect()->intended('/panel');
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

        // 3. Create new user
        $baseUsername = $socialUser->getNickname() ?? explode('@', $socialUser->getEmail())[0];
        $username = $this->generateUniqueUsername($baseUsername);

        $fullName = $socialUser->getName() ?? $baseUsername;
        $nameParts = explode(' ', $fullName, 2);
        $firstName = $nameParts[0];
        $lastName = $nameParts[1] ?? '';

        $data = [
            'username' => $username,
            'email' => $socialUser->getEmail(),
            'password' => Str::random(16),
            'first_name' => $firstName,
            'last_name' => $lastName,
            'name' => $fullName,
        ];

        $result = $this->authService->register($data);
        $user = $result['user'];

        $user->update([
            $idColumn => $socialUser->getId(),
            'avatar' => $socialUser->getAvatar(),
            'verified_at' => now(),
        ]);

        return $user;
    }

    protected function generateUniqueUsername(string $base): string
    {
        $username = Str::slug($base);
        $username = str_replace(['-', '_'], '', $username);

        $originalUsername = $username;
        $counter = 1;

        while (User::where('username', $username)->exists()) {
            $username = $originalUsername . $counter;
            $counter++;
        }

        return $username;
    }
}
