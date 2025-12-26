<?php

namespace App\Providers;

use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Repository bindings
        $this->app->bind(
            \App\Repositories\Contracts\UserRepository::class,
            \App\Repositories\Eloquent\EloquentUserRepository::class
        );
        $this->app->bind(
            \App\Repositories\Contracts\LandingRepository::class,
            \App\Repositories\Eloquent\EloquentLandingRepository::class
        );
        $this->app->bind(
            \App\Repositories\Contracts\LinkRepository::class,
            \App\Repositories\Eloquent\EloquentLinkRepository::class
        );

        // Service singletons (for shared state if needed)
        $this->app->singleton(\App\Services\ImageService::class);
        $this->app->singleton(\App\Services\StatisticsService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Configure HTTPS and URL scheme
        $this->configureHttpsAndUrls();
    }

    /**
     * Configure HTTPS and URL generation for the application.
     */
    private function configureHttpsAndUrls(): void
    {
        // Force HTTPS in production/staging or when behind HTTPS proxy
        if (
            $this->app->environment(['production', 'staging']) ||
            $this->isRunningBehindHttpsProxy()
        ) {
            $this->app['request']->server->set('HTTPS', true);
            URL::forceScheme('https');
        }
    }

    /**
     * Determine if the application is running behind an HTTPS proxy.
     */
    private function isRunningBehindHttpsProxy(): bool
    {
        $request = request();

        if (!$request) {
            return false;
        }

        // Check HTTPS proxy headers
        return $request->header('X-Forwarded-Proto') === 'https' ||
            $request->header('X-Forwarded-SSL') === 'on' ||
            $request->header('CloudFront-Forwarded-Proto') === 'https' ||
            $request->server('HTTPS') === 'on';
    }
}
