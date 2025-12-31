<?php

namespace App\Http\Middleware;

use App\Constants\SeoDefaults;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware helper for SEO meta data.
 *
 * Provides static method to build SEO meta arrays for Blade views.
 * This ensures meta tags are rendered server-side in the initial HTML,
 * which is required for social media crawlers (Facebook, Twitter, etc.)
 * that don't execute JavaScript.
 */
class HandleSeoMeta
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        return $next($request);
    }

    /**
     * Build SEO meta array with defaults from SeoDefaults constants.
     */
    public static function buildMeta(array $data = []): array
    {
        $baseUrl = config('app.url', 'https://linkea.ar');

        $defaults = [
            'title' => SeoDefaults::DEFAULT_TITLE,
            'description' => SeoDefaults::DEFAULT_DESCRIPTION,
            'image' => SeoDefaults::DEFAULT_OG_IMAGE,
            'type' => 'website',
            'robots' => 'index, follow',
            'url' => $baseUrl,
        ];

        $meta = array_merge($defaults, array_filter($data));

        // Ensure image is absolute URL
        $meta['image'] = SeoDefaults::imageUrl($meta['image'], $baseUrl);

        // Ensure URL is absolute
        if (!str_starts_with($meta['url'], 'http')) {
            $meta['url'] = rtrim($baseUrl, '/') . '/' . ltrim($meta['url'], '/');
        }

        // Add canonical if not set
        if (!isset($meta['canonical'])) {
            $meta['canonical'] = $meta['url'];
        }

        return $meta;
    }
}
