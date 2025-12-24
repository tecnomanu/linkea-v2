<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Support\Facades\Route;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
        then: function () {
            // Load auth routes BEFORE web.php to prevent catch-all from intercepting them
            Route::middleware('web')
                ->group(base_path('routes/auth.php'));
            
            // Load web routes last (contains catch-all for landing pages)
            Route::middleware('web')
                ->group(base_path('routes/web.php'));
        },
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
        ]);

        // Register named middleware aliases
        $middleware->alias([
            'root' => \App\Http\Middleware\EnsureUserIsRoot::class,
        ]);

        // Configure auth middleware to redirect to /auth/login
        $middleware->redirectGuestsTo('/auth/login');
        
        // Configure guest middleware to redirect authenticated users to /panel
        $middleware->redirectUsersTo('/panel');
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
