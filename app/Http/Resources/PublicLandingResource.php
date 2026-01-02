<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

/**
 * Resource for public landing view (linkea.ar/{slug}).
 * 
 * Extends BaseLandingResource with public-safe data only.
 * Includes analytics IDs (needed for tracking scripts).
 * 
 * Used by: SystemRouterController->landingView()
 */
class PublicLandingResource extends BaseLandingResource
{
    public function toArray(Request $request): array
    {
        $options = $this->getOptions();
        $analytics = $options['analytics'] ?? [];

        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'domain_name' => $this->domain_name,
            'verify' => (bool) $this->verify,

            // SEO fields (resolved with fallback chains)
            'seoTitle' => $this->getSeoTitle(),
            'seoDescription' => $this->getSeoDescription(),
            'seoImage' => $this->getSeoImage(),

            // Logo with resolved URLs
            'logo' => $this->getLogo(),

            // Full template_config for rendering
            'template_config' => $this->buildTemplateConfig(),

            // Privacy flag for noindex
            'isPrivate' => (bool) ($options['is_private'] ?? false),

            // Analytics IDs (needed for CookieConsent tracking)
            'googleAnalyticsId' => $analytics['google_code'] 
                ?? $options['google_analytics_id'] ?? null,
            'facebookPixelId' => $analytics['facebook_pixel'] 
                ?? $options['facebook_pixel_id'] ?? null,

            // Links (no stats for public view)
            'links' => $this->transformLinks($this->whenLoaded('links'), false),
            'socialLinks' => $this->transformLinks($this->whenLoaded('socials'), false),
        ];
    }
}
