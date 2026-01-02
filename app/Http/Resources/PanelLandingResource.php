<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

/**
 * Resource for Panel dashboard (editable landing data).
 * 
 * Extends BaseLandingResource with additional fields for editing:
 * - Analytics IDs (Google, Facebook)
 * - Saved custom themes
 * - Last custom design backup
 * - Link stats (clicks, sparklines)
 * 
 * Used by: PanelController->renderView()
 */
class PanelLandingResource extends BaseLandingResource
{
    public function toArray(Request $request): array
    {
        $options = $this->getOptions();
        $analytics = $options['analytics'] ?? [];
        $meta = $options['meta'] ?? [];
        $config = $this->getTemplateConfig();
        $logo = $this->getLogo();

        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'domain_name' => $this->domain_name,
            'verify' => (bool) $this->verify,
            'mongo_id' => $this->mongo_id, // For legacy indicator

            // Logo with resolved URLs
            'logo' => $logo,

            // Full template_config (for DesignTab)
            'template_config' => array_merge($this->buildTemplateConfig(), [
                // Additional fields for panel editing
                'savedCustomThemes' => $config['savedCustomThemes'] ?? [],
                'lastCustomDesign' => $config['lastCustomDesign'] ?? null,
            ]),

            // Options including analytics (for SettingsTab)
            'options' => [
                // SEO settings
                'meta' => [
                    'title' => $meta['title'] ?? $options['title'] ?? '',
                    'description' => $meta['description'] ?? $options['description'] ?? '',
                    'image' => $meta['image'] ?? null,
                ],
                // Analytics settings
                'analytics' => [
                    'google_code' => $analytics['google_code'] ?? $options['google_analytics_id'] ?? '',
                    'facebook_pixel' => $analytics['facebook_pixel'] ?? $options['facebook_pixel_id'] ?? '',
                ],
                // Privacy
                'is_private' => (bool) ($options['is_private'] ?? false),
            ],
        ];
    }

    /**
     * Create a resource for landing with pre-loaded links.
     * Includes stats for the Links tab.
     */
    public static function withLinks($landing, $links, $socialLinks): array
    {
        $resource = new static($landing);
        $data = $resource->resolve();

        // Add links with stats
        $data['links'] = collect($links)->map(function ($link) use ($resource) {
            return array_merge($resource->transformLink($link), [
                'clicks' => $link->visited ?? 0,
                'sparklineData' => $link->sparklineData ?? array_fill(0, 7, ['value' => 0]),
            ]);
        })->values()->toArray();

        // Add social links with stats
        $data['socialLinks'] = collect($socialLinks)->map(function ($link) use ($resource) {
            return array_merge($resource->transformLink($link), [
                'clicks' => $link->visited ?? 0,
                'sparklineData' => $link->sparklineData ?? array_fill(0, 7, ['value' => 0]),
            ]);
        })->values()->toArray();

        return $data;
    }
}
