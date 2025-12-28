<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LandingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $templateConfig = $this->template_config ?? [];

        return [
            'id' => $this->id,
            // Internal name (not displayed publicly)
            'name' => $this->name,
            'slug' => $this->slug,
            'handle' => '@' . ($this->domain_name ?? $this->slug),
            'logo' => $this->logo,
            'avatar' => $this->logo['image'] ?? null,

            // Title & Subtitle from template_config (displayed on page)
            'title' => $templateConfig['title'] ?? $this->domain_name,
            'subtitle' => $templateConfig['subtitle'] ?? '',
            'showTitle' => $templateConfig['showTitle'] ?? true,
            'showSubtitle' => $templateConfig['showSubtitle'] ?? true,

            'domain_name' => $this->domain_name,
            'verify' => (bool) $this->verify,

            // Design/Theme
            'theme' => $this->template_config['background']['bgName'] ?? 'custom',
            'customDesign' => [
                'backgroundColor' => $this->template_config['background']['backgroundColor'] ?? '#ffffff',
                'backgroundImage' => $this->template_config['background']['backgroundImage'] ?? null,
                'backgroundEnabled' => $this->template_config['background']['backgroundEnabled'] ?? true,
                'backgroundSize' => $this->template_config['background']['backgroundSize'] ?? 'cover',
                'backgroundPosition' => $this->template_config['background']['backgroundPosition'] ?? 'center',
                'backgroundRepeat' => $this->template_config['background']['backgroundRepeat'] ?? 'no-repeat',
                'backgroundAttachment' => $this->template_config['background']['backgroundAttachment'] ?? 'scroll',

                'buttonStyle' => $this->template_config['buttons']['style'] ?? 'solid',
                'buttonShape' => $this->template_config['buttons']['shape'] ?? 'rounded',
                'buttonSize' => $this->template_config['buttons']['size'] ?? 'compact',
                'buttonColor' => $this->template_config['buttons']['backgroundColor'] ?? '#000000',
                'buttonTextColor' => $this->template_config['buttons']['textColor'] ?? '#ffffff',
                'buttonBorderColor' => $this->template_config['buttons']['borderColor'] ?? null,

                'showButtonIcons' => $this->template_config['buttons']['showIcons'] ?? true,
                'buttonIconAlignment' => $this->template_config['buttons']['iconAlignment'] ?? 'left',

                'fontPair' => $this->template_config['typography']['fontPair']
                    ?? $this->template_config['fontPair']
                    ?? 'modern',
                'textColor' => $this->template_config['textColor'] ?? null,

                'roundedAvatar' => $this->template_config['header']['roundedAvatar']
                    ?? $this->template_config['image_rounded']
                    ?? true,
                'avatarFloating' => $this->template_config['header']['avatarFloating']
                    ?? $this->template_config['image_floating']
                    ?? true,

                'showLinkSubtext' => $this->template_config['showLinkSubtext'] ?? false,
            ],

            // SEO/Settings - new structure: options.meta.*, with legacy fallback
            'seoTitle' => $this->options['meta']['title']
                ?? $this->options['title'] ?? '',
            'seoDescription' => $this->options['meta']['description']
                ?? $this->options['description'] ?? '',
            'seoImage' => $this->options['meta']['image'] ?? null, // Future: custom OG image

            // Analytics - new structure: options.analytics.*, with legacy fallback
            'googleAnalyticsId' => $this->options['analytics']['google_code']
                ?? $this->options['google_analytics_id'] ?? null,
            'facebookPixelId' => $this->options['analytics']['facebook_pixel']
                ?? $this->options['facebook_pixel_id'] ?? null,

            'isPrivate' => $this->options['is_private'] ?? false,

            // Template config (raw for advanced use)
            'template_config' => $this->template_config,
            'options' => $this->options,

            // Relations (when loaded)
            'links' => LinkResource::collection($this->whenLoaded('links')),
            'socialLinks' => LinkResource::collection($this->whenLoaded('socials')),
        ];
    }
}
