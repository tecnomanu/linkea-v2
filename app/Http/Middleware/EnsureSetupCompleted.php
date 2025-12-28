<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureSetupCompleted
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // If user is logged in but has no company_id (setup incomplete)
        if ($user && !$user->company_id) {
            // Allow requests to the setup page itself, logout, and verification (just in case)
            if (
                !$request->routeIs('auth.setup.*') &&
                !$request->routeIs('logout') &&
                !$request->routeIs('verification.*')
            ) {
                return redirect()->route('auth.setup.username');
            }
        }

        return $next($request);
    }
}
