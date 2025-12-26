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

        // Resolve title with proper fallback chain:
        // 1. options.title (SEO title, often the "real" title)
        // 2. template_config.title (if valid - not just spaces/punctuation)
        // 3. landing name
        $title = $this->resolveTitle($options, $templateConfig);

        return [
            'id' => $this->id,
            'name' => $title,
            'slug' => $this->slug,
            'domain_name' => $this->domain_name,
            'verify' => (bool) $this->verify,

            // Logo with resolved URLs
            'logo' => StorageHelper::logoUrls($this->logo),

            // Template config for rendering
            'template_config' => [
                'title' => $title,
                'subtitle' => $templateConfig['subtitle'] ?? ($options['bio'] ?? ''),
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
                    'style' => $buttons['style'] ?? 'solid',
                    'shape' => $buttons['shape'] ?? 'rounded',
                    'backgroundColor' => $buttons['backgroundColor'] ?? ($buttons['color'] ?? '#000000'),
                    'textColor' => $buttons['textColor'] ?? '#ffffff',
                    'showIcons' => $buttons['showIcons'] ?? true,
                    'iconAlignment' => $buttons['iconAlignment'] ?? 'left',
                ],
                'textColor' => $templateConfig['textColor'] ?? null,
                'fontPair' => $templateConfig['fontPair'] ?? 'modern',
                'header' => [
                    'roundedAvatar' => $header['roundedAvatar'] ?? ($templateConfig['image_rounded'] ?? true),
                ],
                'showLinkSubtext' => $templateConfig['showLinkSubtext'] ?? false,
            ],

            // Options (only public ones)
            'options' => [
                'bio' => $options['bio'] ?? '',
            ],

            // Relations (when loaded) - transform to plain arrays
            'links' => $this->transformLinks($this->whenLoaded('links')),
            'socialLinks' => $this->transformLinks($this->whenLoaded('socials')),
        ];
    }

    /**
     * Resolve the display title with proper fallback chain.
     */
    protected function resolveTitle(array $options, array $templateConfig): string
    {
        // Priority 1: options.title (SEO title, usually the intended display title)
        $optionsTitle = trim($options['title'] ?? '');
        if ($optionsTitle && $this->isValidTitle($optionsTitle)) {
            return $optionsTitle;
        }

        // Priority 2: template_config.title (if valid)
        $configTitle = trim($templateConfig['title'] ?? '');
        if ($configTitle && $this->isValidTitle($configTitle)) {
            return $configTitle;
        }

        // Priority 3: landing name
        return $this->name ?? 'Linkea';
    }

    /**
     * Check if title is valid (not just punctuation/spaces).
     */
    protected function isValidTitle(string $title): bool
    {
        // Remove all whitespace and common punctuation
        $cleaned = preg_replace('/[\s.,;:!?\-_]+/', '', $title);
        return !empty($cleaned);
    }

    /**
     * Transform links collection to plain array.
     */
    protected function transformLinks($links): array
    {
        if (!$links) {
            return [];
        }

        return $links->map(function ($link) {
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
        })->values()->toArray();
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
