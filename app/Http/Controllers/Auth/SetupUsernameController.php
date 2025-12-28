<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SetupUsernameController extends Controller
{
    protected $authService;

    public function __construct(\App\Services\AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function show()
    {
        $user = auth()->user();

        // If user already has company, redirect to panel
        if ($user->company_id) {
            return redirect()->intended('/panel');
        }

        return \Inertia\Inertia::render('Auth/SetupUsername', [
            'initialUsername' => $user->username,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'username' => ['required', 'string', 'min:3', 'max:30', 'regex:/^[a-zA-Z0-9._-]+$/'],
        ]);

        try {
            // Get fresh user from DB instead of auth guard
            $user = \App\Models\User::find(auth()->id());
            \Log::info('SetupUsername: User found', ['user_id' => $user?->id, 'company_id' => $user?->company_id]);

            // Security check: if already set up, abort
            if ($user->company_id) {
                \Log::info('SetupUsername: User already has company, redirecting');
                return redirect()->to('/panel');
            }

            $username = strtolower($request->username);
            \Log::info('SetupUsername: Username to set', ['username' => $username]);

            // Check availability
            $availability = $this->authService->checkUsernameAvailability($username, $user);
            if (!$availability['available']) {
                \Log::warning('SetupUsername: Username not available', $availability);
                return back()->withErrors(['username' => $availability['message']]);
            }

            // Update username directly with update method
            $user->update(['username' => $username]);
            \Log::info('SetupUsername: Username updated');

            // Complete Setup (Company, Landing, Jobs)
            $this->authService->completeSetup($user, $username);
            \Log::info('SetupUsername: Complete setup done', ['new_company_id' => $user->fresh()->company_id]);

            // Force redirect to panel (not intended, to avoid loop)
            return redirect()->to('/panel');
        } catch (\Throwable $e) {
            \Log::error('SetupUsername: Error', ['message' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return back()->withErrors(['username' => 'Error interno: ' . $e->getMessage()]);
        }
    }
}
