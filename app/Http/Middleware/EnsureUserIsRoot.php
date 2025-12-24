<?php

namespace App\Http\Middleware;

use App\Constants\UserRoles;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Ensures the authenticated user has root privileges.
 * Only root users can access admin routes.
 */
class EnsureUserIsRoot
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user || !$user->hasRole(UserRoles::ROOT)) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Acceso no autorizado.'], 403);
            }

            return redirect()->route('panel')->with('error', 'No tienes permisos para acceder a esta sección.');
        }

        return $next($request);
    }
}

