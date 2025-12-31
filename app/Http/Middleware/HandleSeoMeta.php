<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware that passes SEO meta data to Blade views.
 *
 * This ensures meta tags are rendered server-side in the initial HTML,
 * which is required for social media crawlers (Facebook, Twitter, etc.)
 * that don't execute JavaScript.
 */
class HandleSeoMeta
{
    /**
     * Default SEO values for the site.
     */
    protected array $defaults = [
        'title' => 'Linkea - Todos tus enlaces en un solo lugar',
        'description' => 'Crea tu pagina de links personalizada gratis. Comparte todos tus enlaces en un solo lugar con Linkea, la mejor alternativa argentina a Linktree.',
        'image' => '/assets/images/meta_tag_image.jpg',
        'type' => 'website',
        'robots' => 'index, follow',
    ];

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        return $response;
    }

    /**
     * Share SEO data with Blade views after response is created.
     * This is called via Inertia's withViewData() in controllers.
     */
    public function terminate(Request $request, Response $response): void
    {
        // Termination logic if needed
    }

    /**
     * Build SEO meta array with defaults.
     */
    public static function buildMeta(array $data = []): array
    {
        $baseUrl = config('app.url', 'https://linkea.ar');

        $defaults = [
            'title' => 'Linkea - Todos tus enlaces en un solo lugar',
            'description' => 'Crea tu pagina de links personalizada gratis. Comparte todos tus enlaces en un solo lugar con Linkea, la mejor alternativa argentina a Linktree.',
            'image' => '/assets/images/meta_tag_image.jpg',
            'type' => 'website',
            'robots' => 'index, follow',
            'url' => $baseUrl,
        ];

        $meta = array_merge($defaults, array_filter($data));

        // Ensure image is absolute URL
        if (!empty($meta['image']) && !str_starts_with($meta['image'], 'http')) {
            $meta['image'] = $baseUrl . $meta['image'];
        }

        // Ensure URL is absolute
        if (!empty($meta['url']) && !str_starts_with($meta['url'], 'http')) {
            $meta['url'] = $baseUrl . $meta['url'];
        }

        // Add canonical if not set
        if (!isset($meta['canonical'])) {
            $meta['canonical'] = $meta['url'];
        }

        return $meta;
    }
}
