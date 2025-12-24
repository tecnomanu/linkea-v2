<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LandingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'handle' => '@' . $this->slug,
            'logo' => $this->logo,
            'avatar' => $this->logo['image'] ?? null,
            'bio' => $this->options['bio'] ?? '',
            'domain_name' => $this->domain_name,
            'verify' => (bool) $this->verify,
            
            // Design/Theme
            'theme' => $this->template_config['background']['bgName'] ?? 'custom',
            'customDesign' => [
                'backgroundColor' => $this->template_config['background']['backgroundColor'] ?? '#ffffff',
                'buttonStyle' => $this->template_config['buttons']['style'] ?? 'solid',
                'buttonShape' => $this->template_config['buttons']['shape'] ?? 'rounded',
                'buttonColor' => $this->template_config['buttons']['backgroundColor'] ?? '#000000',
                'buttonTextColor' => $this->template_config['buttons']['textColor'] ?? '#ffffff',
                'fontPair' => $this->template_config['typography']['fontPair'] ?? 'modern',
            ],
            
            // SEO/Settings
            'seoTitle' => $this->options['title'] ?? '',
            'seoDescription' => $this->options['description'] ?? '',
            'googleAnalyticsId' => $this->options['google_analytics_id'] ?? null,
            'facebookPixelId' => $this->options['facebook_pixel_id'] ?? null,
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


