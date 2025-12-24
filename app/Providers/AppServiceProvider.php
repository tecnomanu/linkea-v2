<?php

namespace App\Providers;

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
        //
    }
}
