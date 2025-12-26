<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Ensures the authenticated user has verified their email address.
 * Redirects to verification page if not verified.
 */
class EnsureEmailIsVerified
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->route('login');
        }

        // Check if user has verified their email
        if (!$user->verified_at) {
            // For API requests, return 403
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Tu email no ha sido verificado.',
                    'redirect' => route('verification.notice'),
                ], 403);
            }

            // For web requests, redirect to verification page
            return redirect()->route('verification.notice');
        }

        return $next($request);
    }
}
