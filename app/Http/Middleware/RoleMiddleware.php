<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string ...$roles
     * @return mixed
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = Auth::user();
        if (!$user) return response()->json('Unauthorized', 401);

        foreach ($roles as $role) {
            // legacy logic: $user->roles->contains('type', $role)
            // our User model has `roles` relation. Role model has `type`.
            // User model helper `hasRole` exists?
            // Legacy User model had `hasRoles` loop.
            // Migrated User model has `hasRole`.

            if ($user->hasRole($role)) {
                return $next($request);
            }
            // Logic check: Legacy checked `roles->contains('type', $role)`.
            // Our User model has `roles()` relation. loading `roles` collection.
        }

        return response()->json(['message' => 'Unauthorized.'], 403);
    }
}
