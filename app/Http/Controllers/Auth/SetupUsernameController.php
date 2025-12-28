<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

/**
 * Controller for setting up Linkea handle (landing slug) after social login.
 * 
 * This flow is used when a user signs up via Google/Apple and needs to choose
 * their unique Linkea handle before accessing the dashboard.
 */
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

        // Suggest initial handle from user's first name or email
        $initialHandle = $this->suggestHandle($user);

        return \Inertia\Inertia::render('Auth/SetupUsername', [
            'initialUsername' => $initialHandle,
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

            $linkeaHandle = strtolower($request->username);
            \Log::info('SetupUsername: Handle to set', ['handle' => $linkeaHandle]);

            // Check availability
            $availability = $this->authService->checkUsernameAvailability($linkeaHandle, $user);
            if (!$availability['available']) {
                \Log::warning('SetupUsername: Handle not available', $availability);
                return back()->withErrors(['username' => $availability['message']]);
            }

            // Complete Setup (Company, Landing, Jobs)
            $this->authService->completeSetup($user, $linkeaHandle);
            \Log::info('SetupUsername: Complete setup done', ['new_company_id' => $user->fresh()->company_id]);

            // Force redirect to panel (not intended, to avoid loop)
            return redirect()->to('/panel');
        } catch (\Throwable $e) {
            \Log::error('SetupUsername: Error', ['message' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return back()->withErrors(['username' => 'Error interno: ' . $e->getMessage()]);
        }
    }

    /**
     * Suggest an initial handle based on user data.
     */
    protected function suggestHandle($user): string
    {
        // Try first name
        if (!empty($user->first_name)) {
            return strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $user->first_name));
        }

        // Try full name
        if (!empty($user->name)) {
            return strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $user->name));
        }

        // Try email prefix
        if (!empty($user->email)) {
            $emailPrefix = explode('@', $user->email)[0];
            return strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $emailPrefix));
        }

        return '';
    }
}
