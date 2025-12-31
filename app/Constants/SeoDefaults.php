<?php

namespace App\Constants;

/**
 * Centralized SEO default values.
 *
 * Used by:
 * - app.blade.php (server-side rendering for crawlers)
 * - HandleSeoMeta middleware
 * - WebController, SystemRouterController
 *
 * Frontend equivalent: resources/js/constants/seo.ts
 */
class SeoDefaults
{
    // Site info
    public const SITE_NAME = 'Linkea';
    public const LOCALE = 'es_AR';

    // Default meta values
    public const DEFAULT_TITLE = 'Linkea - Todos tus enlaces en un solo lugar';
    public const DEFAULT_DESCRIPTION = 'Crea tu pagina de links personalizada gratis. Comparte todos tus enlaces en un solo lugar con Linkea, la mejor alternativa argentina a Linktree.';

    // Images (relative to public/)
    public const DEFAULT_OG_IMAGE = '/images/meta_tag_image.webp';
    public const FAVICON = '/favicon-32x32.png';
    public const APPLE_TOUCH_ICON = '/apple-touch-icon.png';

    // OG image dimensions (recommended by Facebook)
    public const OG_IMAGE_WIDTH = 1200;
    public const OG_IMAGE_HEIGHT = 630;

    // Theme colors
    public const THEME_COLOR = '#f97316';
    public const MS_TILE_COLOR = '#f97316';

    // Page-specific titles and descriptions
    public const HOME_TITLE = 'Linkea - Todos tus enlaces en un solo lugar | Link in Bio Argentina';
    public const HOME_DESCRIPTION = 'Crea tu pagina de links personalizada gratis. Comparte todos tus enlaces en un solo lugar con Linkea, la mejor alternativa argentina a Linktree. 100% gratis, sin limites.';

    public const GALLERY_TITLE = 'Galeria de Linkeas - Descubre perfiles inspiradores';
    public const GALLERY_DESCRIPTION = 'Explora la galeria de Linkea y descubre perfiles creativos de la comunidad. Inspira tu propio diseno viendo los mejores ejemplos de link in bio.';

    public const PRIVACY_TITLE = 'Politica de Privacidad - Linkea';
    public const PRIVACY_DESCRIPTION = 'Conoce nuestra politica de privacidad y como protegemos tus datos en Linkea.';

    /**
     * Build full image URL from relative path.
     */
    public static function imageUrl(string $path, ?string $baseUrl = null): string
    {
        if (str_starts_with($path, 'http')) {
            return $path;
        }

        $baseUrl = $baseUrl ?? config('app.url', 'https://linkea.ar');

        return rtrim($baseUrl, '/') . '/' . ltrim($path, '/');
    }

    /**
     * Get default SEO array for a landing page.
     */
    public static function forLanding(array $data): array
    {
        $baseUrl = config('app.url');
        $name = $data['name'] ?? 'Landing';
        $handle = $data['handle'] ?? '';

        return [
            'title' => ($data['seoTitle'] ?? $name) . ' | ' . self::SITE_NAME,
            'description' => $data['seoDescription'] ?? "Links de {$name} - Creado con " . self::SITE_NAME,
            'image' => self::imageUrl($data['seoImage'] ?? self::DEFAULT_OG_IMAGE, $baseUrl),
            'url' => $baseUrl . '/' . $handle,
            'type' => 'profile',
            'robots' => ($data['isPrivate'] ?? false) ? 'noindex, nofollow' : 'index, follow',
        ];
    }

    /**
     * Get default SEO array for a page.
     */
    public static function forPage(string $title, string $description, string $path = '/'): array
    {
        $baseUrl = config('app.url');

        return [
            'title' => $title,
            'description' => $description,
            'image' => self::imageUrl(self::DEFAULT_OG_IMAGE, $baseUrl),
            'url' => rtrim($baseUrl, '/') . '/' . ltrim($path, '/'),
            'type' => 'website',
            'robots' => 'index, follow',
        ];
    }
}
