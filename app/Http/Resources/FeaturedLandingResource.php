<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

/**
 * Resource for featured/gallery landing display.
 * 
 * Returns data in FeaturedLanding format for PhonePreview component.
 * Structure: { id, landing: LandingProfile, links: LinkBlock[] }
 * Used by: WebController->index(), WebController->gallery()
 */
class FeaturedLandingResource extends BaseLandingResource
{
    public function toArray(Request $request): array
    {
        $logo = $this->getLogo();
        $options = $this->getOptions();
        $config = $this->getTemplateConfig();
        $bgConfig = $this->getBackgroundConfig();

        // Map bgName to theme
        $bgName = $bgConfig['bgName'] ?? 'custom';
        $theme = ($bgName === 'static') ? 'custom' : $bgName;

        return [
            'id' => $this->id,
            'landing' => [
                'name' => $this->name,
                'handle' => $this->slug ?? $this->domain_name,
                'avatar' => $logo['image'] ?? '',
                'avatarThumb' => $logo['thumb'] ?? null,
                'theme' => $theme,
                'title' => $config['title'] ?? $this->slug,
                'subtitle' => $config['subtitle'] ?? '',
                'showTitle' => $config['showTitle'] ?? true,
                'showSubtitle' => $config['showSubtitle'] ?? true,
                'isVerified' => (bool) $this->verify,
                'isLegacy' => !empty($this->mongo_id),
                'customDesign' => $this->buildCustomDesign(),
            ],
            'links' => $this->transformLinks($this->whenLoaded('links'), false),
        ];
    }
}
