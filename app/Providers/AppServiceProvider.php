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
        $this->app->bind(
            \App\Repositories\Contracts\StatisticsRepository::class,
            \App\Repositories\Eloquent\EloquentStatisticsRepository::class
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
        // Never force HTTPS in local/development environments
        if ($this->app->environment(['local', 'development', 'testing'])) {
            return;
        }

        // Force HTTPS in production/staging or when behind HTTPS proxy
        if (
            $this->app->environment(['production', 'staging']) ||
            $this->isRunningBehindHttpsProxy()
        ) {
            // Set HTTPS flag on the request
            if ($this->app->bound('request')) {
                $this->app['request']->server->set('HTTPS', 'on');
            }

            // Force URL scheme to HTTPS
            URL::forceScheme('https');

            // Also force root URL if APP_URL doesn't have https
            $appUrl = config('app.url');
            if ($appUrl && !str_starts_with($appUrl, 'https://')) {
                $httpsUrl = str_replace('http://', 'https://', $appUrl);
                URL::forceRootUrl($httpsUrl);
                config(['app.url' => $httpsUrl]);
            }
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
