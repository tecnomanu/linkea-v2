<?php

namespace App\Http\Middleware;

use App\Constants\SeoDefaults;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $baseUrl = rtrim(config('app.url', 'https://linkea.ar'), '/');

        return [
            ...parent::share($request),
            'appName' => config('app.name', 'Linkea'),
            'appUrl' => $baseUrl,
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'avatar' => $request->user()->avatar,
                    'role_name' => $request->user()->role_name,
                ] : null,
            ],
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error'),
            ],
            // SEO defaults - single source of truth from PHP
            'seoDefaults' => [
                'siteName' => SeoDefaults::SITE_NAME,
                'locale' => SeoDefaults::LOCALE,
                'defaultTitle' => SeoDefaults::DEFAULT_TITLE,
                'defaultDescription' => SeoDefaults::DEFAULT_DESCRIPTION,
                'defaultImage' => SeoDefaults::imageUrl(SeoDefaults::DEFAULT_OG_IMAGE, $baseUrl),
                'ogImageWidth' => (string) SeoDefaults::OG_IMAGE_WIDTH,
                'ogImageHeight' => (string) SeoDefaults::OG_IMAGE_HEIGHT,
                'favicon' => SeoDefaults::FAVICON,
                'appleTouchIcon' => SeoDefaults::APPLE_TOUCH_ICON,
            ],
        ];
    }
}
