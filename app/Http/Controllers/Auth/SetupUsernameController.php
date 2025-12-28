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

        $user = auth()->user();

        // Security check: if already set up, abort
        if ($user->company_id) {
            return redirect()->intended('/panel');
        }

        $username = strtolower($request->username);

        // Check availability
        $availability = $this->authService->checkUsernameAvailability($username, $user);
        if (!$availability['available']) {
            return back()->withErrors(['username' => $availability['message']]);
        }

        // Update username
        $user->username = $username;
        $user->save();

        // Complete Setup (Company, Landing, Jobs)
        $this->authService->completeSetup($user, $username);

        return redirect()->intended('/panel');
    }
}
