<?php

namespace App\Http\Resources;

use App\Support\Helpers\StorageHelper;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Resource for public landing view (linkea.ar/{slug}).
 * Does NOT expose sensitive data like analytics IDs.
 */
class PublicLandingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $templateConfig = $this->template_config ?? [];
        $bgConfig = $templateConfig['background'] ?? [];
        $bgProps = $bgConfig['props'] ?? [];
        $buttons = $templateConfig['buttons'] ?? [];
        $header = $templateConfig['header'] ?? [];
        $options = $this->options ?? [];

        // Display title from template_config (visible on page)
        $displayTitle = $templateConfig['title'] ?? $this->domain_name ?? 'Linkea';
        $displaySubtitle = $templateConfig['subtitle'] ?? '';

        // Meta/SEO fields with fallback chain
        // New structure: options.meta.* with legacy fallback to options.*
        $meta = $options['meta'] ?? [];

        // seoTitle: meta.title → options.title (legacy) → template_config.title → domain_name
        $seoTitle = trim($meta['title'] ?? $options['title'] ?? '') ?: $displayTitle;

        // seoDescription: meta.description → options.description (legacy) → subtitle → generated
        $seoDescription = trim($meta['description'] ?? $options['description'] ?? '')
            ?: ($displaySubtitle ?: "Links de {$displayTitle} - Creado con Linkea");

        // seoImage: meta.image → logo (fallback to user's logo for OG image)
        $logo = StorageHelper::logoUrls($this->logo);
        $seoImage = $meta['image'] ?? $logo['image'] ?? null;

        return [
            'id' => $this->id,
            'name' => $this->name,
            'seoTitle' => $seoTitle, // For browser tab <title>
            'seoDescription' => $seoDescription, // For meta description
            'seoImage' => $seoImage, // For OG image (custom or logo fallback)
            'slug' => $this->slug,
            'domain_name' => $this->domain_name,
            'verify' => (bool) $this->verify,

            // Logo with resolved URLs
            'logo' => $logo,

            // Template config for rendering (displayed on page)
            'template_config' => [
                // Title & Subtitle from template_config (as in legacy)
                'title' => $templateConfig['title'] ?? $this->domain_name,
                'subtitle' => $templateConfig['subtitle'] ?? '',
                'showTitle' => $templateConfig['showTitle'] ?? true,
                'showSubtitle' => $templateConfig['showSubtitle'] ?? true,
                'background' => [
                    'bgName' => $bgConfig['bgName'] ?? 'custom',
                    'backgroundColor' => $bgConfig['backgroundColor'] ?? '#ffffff',
                    'backgroundImage' => $this->resolveBackgroundImage($bgConfig['backgroundImage'] ?? null),
                    'backgroundEnabled' => $bgConfig['backgroundEnabled'] ?? true,
                    'backgroundSize' => $bgConfig['backgroundSize'] ?? ($bgProps['size'] ?? 'cover'),
                    'backgroundPosition' => $bgConfig['backgroundPosition'] ?? ($bgProps['position'] ?? 'center'),
                    'backgroundAttachment' => $bgConfig['backgroundAttachment'] ?? 'scroll',
                    'backgroundRepeat' => $bgConfig['backgroundRepeat'] ?? 'no-repeat',
                    // Legacy props for SVG patterns
                    'props' => $bgProps ?: null,
                    'controls' => $bgConfig['controls'] ?? null,
                ],
                'buttons' => [
                    'style' => $this->resolveButtonStyle($buttons),
                    'shape' => $buttons['shape'] ?? 'rounded',
                    'size' => $buttons['size'] ?? 'compact', // Default to compact (legacy)
                    'backgroundColor' => $buttons['backgroundColor'] ?? ($buttons['color'] ?? '#000000'),
                    'textColor' => $buttons['textColor'] ?? '#ffffff',
                    // Legacy border support: when borderShow is true, use borderColor
                    'borderColor' => $this->resolveBorderColor($buttons),
                    'showIcons' => $buttons['showIcons'] ?? true,
                    'iconAlignment' => $buttons['iconAlignment'] ?? 'left',
                ],
                'textColor' => $templateConfig['textColor'] ?? null,
                'fontPair' => $templateConfig['fontPair'] ?? 'modern',
                'header' => [
                    'roundedAvatar' => $header['roundedAvatar'] ?? ($templateConfig['image_rounded'] ?? true),
                    'avatarFloating' => $header['avatarFloating'] ?? ($templateConfig['image_floating'] ?? true),
                ],
                'showLinkSubtext' => $templateConfig['showLinkSubtext'] ?? false,
            ],

            // Header visibility toggles (from template_config)
            'showTitle' => $templateConfig['showTitle'] ?? true,
            'showSubtitle' => $templateConfig['showSubtitle'] ?? true,

            // Privacy flag for noindex
            'isPrivate' => (bool) ($options['is_private'] ?? false),

            // Relations (when loaded) - transform to plain arrays
            'links' => $this->transformLinks($this->whenLoaded('links')),
            'socialLinks' => $this->transformLinks($this->whenLoaded('socials')),
        ];
    }

    /**
     * Transform links collection to plain array.
     * Filters out empty social links (no url and no icon).
     */
    protected function transformLinks($links): array
    {
        if (!$links) {
            return [];
        }

        return $links
            ->filter(function ($link) {
                // Filter out empty social links (no url and no icon)
                if ($link->type === 'social') {
                    $hasUrl = !empty($link->link);
                    $hasIcon = !empty($link->icon);
                    return $hasUrl || $hasIcon;
                }
                return true;
            })
            ->map(function ($link) {
                $config = $link->config ?? [];

                return [
                    'id' => $link->id,
                    'title' => $link->text,
                    'url' => $link->link,
                    'type' => $link->type ?? 'link',
                    'isEnabled' => (bool) $link->state,
                    'order' => (int) $link->order,
                    'icon' => $link->icon,
                    'headerSize' => $config['header_size'] ?? 'medium',
                    'mediaDisplayMode' => $config['media_display_mode'] ?? null,
                    'showInlinePlayer' => $config['show_inline_player'] ?? false,
                    'autoPlay' => $config['auto_play'] ?? false,
                    'startMuted' => $config['start_muted'] ?? true,
                    'playerSize' => $config['player_size'] ?? 'normal',
                    'phoneNumber' => $config['phone_number'] ?? null,
                    'predefinedMessage' => $config['predefined_message'] ?? null,
                    'calendarProvider' => $config['calendar_provider'] ?? null,
                    'calendarDisplayMode' => $config['calendar_display_mode'] ?? null,
                    'emailAddress' => $config['email_address'] ?? null,
                    'emailSubject' => $config['email_subject'] ?? null,
                    'emailBody' => $config['email_body'] ?? null,
                    'mapAddress' => $config['map_address'] ?? null,
                    'mapQuery' => $config['map_query'] ?? null,
                    'mapZoom' => $config['map_zoom'] ?? null,
                    'mapDisplayMode' => $config['map_display_mode'] ?? null,
                    'mapShowAddress' => $config['map_show_address'] ?? false,
                ];
            })
            ->values()
            ->toArray();
    }

    /**
     * Resolve button style from legacy config.
     * Legacy uses borderShow boolean; new uses style string.
     */
    protected function resolveButtonStyle(array $buttons): string
    {
        // If style is already set, use it
        if (!empty($buttons['style'])) {
            return $buttons['style'];
        }

        // Legacy: borderShow = true means outline style
        if (!empty($buttons['borderShow'])) {
            return 'outline';
        }

        return 'solid';
    }

    /**
     * Resolve border color from legacy config.
     * Returns border color only when different from background (legacy support).
     */
    protected function resolveBorderColor(array $buttons): ?string
    {
        // Legacy mode: borderShow + borderColor
        if (!empty($buttons['borderShow']) && !empty($buttons['borderColor'])) {
            $borderColor = $buttons['borderColor'];
            $bgColor = $buttons['backgroundColor'] ?? ($buttons['color'] ?? '#000000');

            // Only return if border color is different from background
            if (strtolower($borderColor) !== strtolower($bgColor)) {
                return $borderColor;
            }
        }

        // New mode: explicit borderColor field
        if (!empty($buttons['borderColor']) && empty($buttons['borderShow'])) {
            return $buttons['borderColor'];
        }

        return null;
    }

    /**
     * Resolve background image to full URL.
     * Handles: object {image: 'path'}, CSS strings, full URLs.
     */
    protected function resolveBackgroundImage($bgImage): ?string
    {
        if (empty($bgImage)) {
            return null;
        }

        // Object format from legacy {image: 'path', thumb: 'path'}
        if (is_array($bgImage) && isset($bgImage['image'])) {
            $imagePath = $bgImage['image'];
            $url = StorageHelper::url($imagePath);
            return $url ? 'url("' . $url . '")' : null;
        }

        // String format
        if (is_string($bgImage)) {
            // Already CSS formatted (url(...), linear-gradient, data:, SVG patterns)
            if (
                str_starts_with($bgImage, 'url(') ||
                str_starts_with($bgImage, 'linear-gradient') ||
                str_starts_with($bgImage, 'radial-gradient') ||
                str_starts_with($bgImage, 'data:')
            ) {
                return $bgImage;
            }

            // Full URL - wrap in url()
            if (str_starts_with($bgImage, 'http://') || str_starts_with($bgImage, 'https://')) {
                return 'url("' . $bgImage . '")';
            }

            // Relative path - resolve via StorageHelper
            $url = StorageHelper::url($bgImage);
            return $url ? 'url("' . $url . '")' : null;
        }

        return null;
    }
}
