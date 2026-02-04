<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use App\Services\AuthService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    // =========================================================================
    // LOGIN
    // =========================================================================

    public function showLogin(): Response
    {
        return Inertia::render('Auth/Login');
    }

    public function login(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'identifier' => 'required|string|max:255',
            'password' => 'required',
        ]);

        $result = $this->authService->loginWithIdentifier($credentials['identifier'], $credentials['password']);

        if ($result['success']) {
            $request->session()->regenerate();
            return redirect()->intended('/panel');
        }

        // Handle blocked user
        if (($result['error'] ?? '') === 'blocked') {
            return back()->withErrors([
                'identifier' => $result['message'] ?? 'Tu cuenta ha sido suspendida.',
            ]);
        }

        return back()->withErrors([
            'identifier' => 'Las credenciales no coinciden con nuestros registros.',
        ]);
    }

    // =========================================================================
    // REGISTER
    // =========================================================================

    public function showRegister(): Response
    {
        return Inertia::render('Auth/Register');
    }

    public function register(RegisterRequest $request): RedirectResponse
    {
        $data = $request->toServiceFormat();
        $data['company_id'] = null;

        $result = $this->authService->register($data);
        Auth::login($result['user']);

        return redirect('/auth/verify-email');
    }

    // =========================================================================
    // LOGOUT
    // =========================================================================

    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/');
    }

    // =========================================================================
    // PASSWORD RESET - REQUEST
    // =========================================================================

    public function showForgotPassword(): Response
    {
        return Inertia::render('Auth/ForgotPassword');
    }

    public function sendResetLink(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            return back()->with([
                'status' => __($status),
                'throttle_seconds' => 60, // Cooldown after successful send
            ]);
        }

        // Check if throttled and get remaining seconds
        if ($status === Password::RESET_THROTTLED) {
            $key = 'passwords.' . $request->email;
            $seconds = \Illuminate\Support\Facades\RateLimiter::availableIn($key);

            return back()
                ->withErrors(['email' => __($status)])
                ->with('throttle_seconds', $seconds > 0 ? $seconds : 60);
        }

        return back()->withErrors(['email' => __($status)]);
    }

    // =========================================================================
    // PASSWORD RESET - RESET
    // =========================================================================

    public function showResetPassword(Request $request): Response
    {
        return Inertia::render('Auth/ResetPassword', [
            'email' => $request->email,
            'token' => $request->route('token'),
        ]);
    }

    public function resetPassword(Request $request): RedirectResponse
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => bcrypt($password),
                ])->save();
            }
        );

        return $status === Password::PASSWORD_RESET
            ? redirect()->route('login')->with('status', __($status))
            : back()->withErrors(['email' => [__($status)]]);
    }

    // =========================================================================
    // EMAIL VERIFICATION
    // =========================================================================

    public function showVerifyEmail(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        if ($user && $user->verified_at) {
            return redirect()->intended('/panel');
        }

        return Inertia::render('Auth/VerifyEmail', [
            'status' => session('status'),
        ]);
    }

    public function verifyEmail(Request $request): RedirectResponse
    {
        $request->validate([
            'code' => 'required|string|size:6',
        ]);

        $user = $request->user();

        if (!$user) {
            return back()->withErrors(['code' => 'Debes iniciar sesion primero.']);
        }

        if ($this->authService->verifyEmail($request->code)) {
            return redirect()->intended('/panel')->with('status', 'verification-success');
        }

        return back()->withErrors(['code' => 'El codigo ingresado es invalido.']);
    }

    public function resendVerificationCode(Request $request): RedirectResponse
    {
        $user = $request->user();

        if (!$user) {
            return back()->withErrors(['code' => 'Debes iniciar sesion primero.']);
        }

        if ($user->verified_at) {
            return redirect()->intended('/panel');
        }

        // Generate new code and send verification email via service
        $this->authService->resendVerificationCode($user);

        return back()->with('status', 'verification-link-sent');
    }
}
