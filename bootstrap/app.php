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
        // Trust all proxies (Cloudflare, Traefik, etc.) for proper HTTPS detection
        $middleware->trustProxies(at: [
            \App\Http\Middleware\TrustProxies::class,
        ]);

        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
        ]);

        // Register named middleware aliases
        $middleware->alias([
            'root' => \App\Http\Middleware\EnsureUserIsRoot::class,
            'verified' => \App\Http\Middleware\EnsureEmailIsVerified::class,
        ]);

        // Configure auth middleware to redirect to /auth/login
        $middleware->redirectGuestsTo('/auth/login');

        // Configure guest middleware to redirect authenticated users to /panel
        $middleware->redirectUsersTo('/panel');
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Render 404 errors with Inertia
        $exceptions->render(function (\Symfony\Component\HttpKernel\Exception\NotFoundHttpException $e, $request) {
            if ($request->wantsJson()) {
                return response()->json(['message' => 'Not found'], 404);
            }

            // Get featured landings for the 404 page
            $featuredLandings = [];
            try {
                $landingService = app(\App\Services\LandingService::class);
                $featuredLandings = $landingService->getFeaturedForHomepage(5);
            } catch (\Throwable) {
                // Silently fail - fallback data will be used in frontend
            }

            return \Inertia\Inertia::render('Error/NotFound', [
                'featuredLandings' => $featuredLandings,
            ])
                ->toResponse($request)
                ->setStatusCode(404);
        });
    })->create();
