<?php

namespace App\Http\Resources;

use App\Support\Helpers\StorageHelper;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Base resource for landing transformation.
 * 
 * Centralizes all transformation logic to ensure consistency across:
 * - Public landing view (LandingView.tsx)
 * - Panel dashboard (Dashboard.tsx) 
 * - Homepage featured landings (HeroSection.tsx)
 * - Gallery page
 * 
 * Child classes can extend to add/hide specific fields.
 * 
 * @property \App\Models\Landing $resource
 */
abstract class BaseLandingResource extends JsonResource
{
    /**
     * Get template config with defaults.
     */
    protected function getTemplateConfig(): array
    {
        return $this->template_config ?? [];
    }

    /**
     * Get background config with defaults.
     */
    protected function getBackgroundConfig(): array
    {
        $config = $this->getTemplateConfig();
        return $config['background'] ?? [];
    }

    /**
     * Get buttons config with defaults.
     */
    protected function getButtonsConfig(): array
    {
        $config = $this->getTemplateConfig();
        return $config['buttons'] ?? [];
    }

    /**
     * Get header config with defaults.
     */
    protected function getHeaderConfig(): array
    {
        $config = $this->getTemplateConfig();
        return $config['header'] ?? [];
    }

    /**
     * Get options with defaults.
     */
    protected function getOptions(): array
    {
        return $this->options ?? [];
    }

    /**
     * Resolve logo URLs using StorageHelper.
     */
    protected function getLogo(): array
    {
        return StorageHelper::logoUrls($this->logo);
    }

    /**
     * Get display title (shown on page).
     */
    protected function getDisplayTitle(): string
    {
        $config = $this->getTemplateConfig();
        return $config['title'] ?? $this->domain_name ?? 'Linkea';
    }

    /**
     * Get display subtitle (shown on page).
     */
    protected function getDisplaySubtitle(): string
    {
        $config = $this->getTemplateConfig();
        return $config['subtitle'] ?? '';
    }

    /**
     * Get SEO title with fallback chain.
     * Priority: meta.title → options.title → template_config.title → domain_name
     */
    protected function getSeoTitle(): string
    {
        $options = $this->getOptions();
        $meta = $options['meta'] ?? [];

        $seoTitle = trim($meta['title'] ?? $options['title'] ?? '');
        return $seoTitle ?: $this->getDisplayTitle();
    }

    /**
     * Get SEO description with fallback chain.
     */
    protected function getSeoDescription(): string
    {
        $options = $this->getOptions();
        $meta = $options['meta'] ?? [];

        $description = trim($meta['description'] ?? $options['description'] ?? '');
        if ($description) {
            return $description;
        }

        $subtitle = $this->getDisplaySubtitle();
        return $subtitle ?: "Links de {$this->getDisplayTitle()} - Creado con Linkea";
    }

    /**
     * Get SEO image with fallback to logo.
     */
    protected function getSeoImage(): ?string
    {
        $options = $this->getOptions();
        $meta = $options['meta'] ?? [];
        $logo = $this->getLogo();

        return $meta['image'] ?? $logo['image'] ?? null;
    }

    /**
     * Build the full template_config structure for frontend.
     */
    protected function buildTemplateConfig(): array
    {
        $config = $this->getTemplateConfig();
        $bgConfig = $this->getBackgroundConfig();
        $bgProps = $bgConfig['props'] ?? [];
        $buttons = $this->getButtonsConfig();
        $header = $this->getHeaderConfig();

        return [
            'title' => $config['title'] ?? $this->domain_name,
            'subtitle' => $config['subtitle'] ?? '',
            'showTitle' => $config['showTitle'] ?? true,
            'showSubtitle' => $config['showSubtitle'] ?? true,
            'background' => [
                'bgName' => $bgConfig['bgName'] ?? 'custom',
                'backgroundColor' => $bgConfig['backgroundColor'] ?? '#ffffff',
                'backgroundImage' => $this->resolveBackgroundImage($bgConfig['backgroundImage'] ?? null),
                'backgroundEnabled' => $bgConfig['backgroundEnabled'] ?? true,
                'backgroundSize' => $bgConfig['backgroundSize'] ?? ($bgProps['size'] ?? 'cover'),
                'backgroundPosition' => $bgConfig['backgroundPosition'] ?? ($bgProps['position'] ?? 'center'),
                'backgroundAttachment' => $bgConfig['backgroundAttachment'] ?? 'scroll',
                'backgroundRepeat' => $bgConfig['backgroundRepeat'] ?? 'no-repeat',
                'props' => $bgProps ?: null,
                'controls' => $bgConfig['controls'] ?? null,
            ],
            'buttons' => [
                'style' => $buttons['style'] ?? 'solid',
                'shape' => $buttons['shape'] ?? 'rounded',
                'size' => $buttons['size'] ?? 'compact',
                'backgroundColor' => $buttons['backgroundColor'] ?? ($buttons['color'] ?? '#000000'),
                'textColor' => $buttons['textColor'] ?? '#ffffff',
                'borderColor' => $buttons['borderColor'] ?? '#000000',
                'borderEnabled' => (bool) ($buttons['borderEnabled'] ?? false),
                'showIcons' => $buttons['showIcons'] ?? true,
                'iconAlignment' => $buttons['iconAlignment'] ?? 'left',
            ],
            'textColor' => $config['textColor'] ?? null,
            'fontPair' => $config['fontPair'] ?? 'modern',
            'header' => [
                'roundedAvatar' => $header['roundedAvatar'] ?? ($config['image_rounded'] ?? true),
                'avatarFloating' => $header['avatarFloating'] ?? ($config['image_floating'] ?? true),
            ],
            'showLinkSubtext' => $config['showLinkSubtext'] ?? false,
        ];
    }

    /**
     * Build customDesign object for UserProfile format.
     * Used by PhonePreview and LandingContent components.
     */
    protected function buildCustomDesign(): array
    {
        $config = $this->getTemplateConfig();
        $bgConfig = $this->getBackgroundConfig();
        $bgProps = $bgConfig['props'] ?? [];
        $buttons = $this->getButtonsConfig();
        $header = $this->getHeaderConfig();

        $backgroundImage = $this->resolveBackgroundImage($bgConfig['backgroundImage'] ?? null);
        $backgroundEnabled = $bgConfig['backgroundEnabled'] ?? ($backgroundImage !== null);

        return [
            'backgroundColor' => $bgConfig['backgroundColor'] ?? '#ffffff',
            'backgroundImage' => $backgroundImage,
            'backgroundEnabled' => $backgroundEnabled,
            'backgroundSize' => $bgConfig['backgroundSize'] ?? ($bgProps['size'] ?? 'cover'),
            'backgroundPosition' => $bgConfig['backgroundPosition'] ?? ($bgProps['position'] ?? 'center'),
            'backgroundAttachment' => $bgConfig['backgroundAttachment'] ?? 'scroll',
            'backgroundRepeat' => $bgConfig['backgroundRepeat'] ?? 'no-repeat',
            'backgroundProps' => $bgProps ?: null,
            'backgroundControls' => $bgConfig['controls'] ?? null,

            'buttonStyle' => $buttons['style'] ?? 'solid',
            'buttonShape' => $buttons['shape'] ?? 'rounded',
            'buttonSize' => $buttons['size'] ?? 'compact',
            'buttonColor' => $buttons['backgroundColor'] ?? ($buttons['color'] ?? '#000000'),
            'buttonTextColor' => $buttons['textColor'] ?? '#ffffff',
            'buttonBorderColor' => $buttons['borderColor'] ?? '#000000',
            'buttonBorderEnabled' => (bool) ($buttons['borderEnabled'] ?? false),
            'showButtonIcons' => $buttons['showIcons'] ?? true,
            'buttonIconAlignment' => $buttons['iconAlignment'] ?? 'left',
            'showLinkSubtext' => $config['showLinkSubtext'] ?? false,

            'fontPair' => $config['fontPair'] ?? 'modern',
            'textColor' => $config['textColor'] ?? null,
            'roundedAvatar' => $header['roundedAvatar'] ?? ($config['image_rounded'] ?? true),
            'avatarFloating' => $header['avatarFloating'] ?? ($config['image_floating'] ?? true),
        ];
    }

    /**
     * Transform a link to frontend format.
     */
    protected function transformLink($link): array
    {
        $config = $link->config ?? [];

        return [
            'id' => $link->id,
            'title' => $link->text,
            'url' => $link->link,
            'type' => $link->type ?? 'link',
            'isEnabled' => (bool) $link->state,
            'order' => (int) $link->order,
            'icon' => $link->icon,
            // Block-specific config
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
    }

    /**
     * Transform links collection with optional stats.
     */
    protected function transformLinks($links, bool $includeStats = false): array
    {
        if (!$links) {
            return [];
        }

        return $links
            ->filter(function ($link) {
                // Filter out empty social links
                if ($link->type === 'social') {
                    return !empty($link->link) || !empty($link->icon);
                }
                return true;
            })
            ->map(function ($link) use ($includeStats) {
                $data = $this->transformLink($link);

                if ($includeStats) {
                    $data['clicks'] = $link->visited ?? 0;
                    $data['sparklineData'] = $link->sparklineData ?? array_fill(0, 7, ['value' => 0]);
                }

                return $data;
            })
            ->values()
            ->toArray();
    }

    /**
     * Resolve background image to CSS url("...") format.
     */
    protected function resolveBackgroundImage($bgImage): ?string
    {
        if (empty($bgImage)) {
            return null;
        }

        // Object format {image: 'path', thumb: 'path'}
        if (is_array($bgImage) && isset($bgImage['image'])) {
            $url = StorageHelper::url($bgImage['image']);
            return $url ? 'url("' . $url . '")' : null;
        }

        // String format
        if (is_string($bgImage)) {
            // Already CSS formatted
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
