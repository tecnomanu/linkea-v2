<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
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

        if ($this->authService->loginWithIdentifier($credentials['identifier'], $credentials['password'])) {
            $request->session()->regenerate();
            return redirect()->intended('/panel');
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

    public function register(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|confirmed|min:8',
        ]);

        $data['name'] = $data['first_name'] . ' ' . $data['last_name'];
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

        return $status === Password::RESET_LINK_SENT
            ? back()->with('status', __($status))
            : back()->withErrors(['email' => __($status)]);
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

        // Generate new code and send email
        $user->update([
            'verification_code' => rand(100000, 999999),
        ]);

        // TODO: Send verification email with new code

        return back()->with('status', 'verification-link-sent');
    }
}
