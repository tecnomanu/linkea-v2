<?php

namespace App\Services;

use App\Constants\BlockTypes;
use App\Constants\LinkGroups;
use App\Models\Landing;
use App\Models\Link;
use App\Repositories\Contracts\LandingRepository;
use App\Support\Helpers\ArrayHelper;
use App\Support\Helpers\StorageHelper;
use Illuminate\Support\Str;

/**
 * Service for landing-related operations.
 */
class LandingService
{
    public function __construct(
        protected LandingRepository $landingRepository,
        protected ImageService $imageService
    ) {}

    /**
     * Get landing by slug.
     */
    public function getBySlug(string $slug): ?Landing
    {
        return $this->landingRepository->findBySlug($slug);
    }

    /**
     * Get landing by domain name.
     */
    public function getByDomain(string $domain): ?Landing
    {
        return $this->landingRepository->findByDomain($domain);
    }

    /**
     * Find landing by slug or domain name with active links and socials.
     * Used for public landing page view.
     */
    public function findBySlugOrDomainWithLinks(string $path): ?Landing
    {
        return Landing::where('domain_name', $path)
            ->orWhere('slug', $path)
            ->with([
                'links' => function ($query) {
                    $query->where('state', true)->orderBy('order');
                },
                'socials' => function ($query) {
                    $query->where('state', true)->orderBy('order');
                },
            ])
            ->first();
    }

    /**
     * Get all verified landings (for sitemap).
     */
    public function getAllVerified()
    {
        return Landing::where('verify', true)->get();
    }

    /**
     * Get all landings for a user.
     */
    public function getByUserId(string $userId)
    {
        return $this->landingRepository->getByUserId($userId);
    }

    /**
     * Get landing with authorization check.
     */
    public function getForUser(string $landingId, string $userId): ?Landing
    {
        $landing = $this->landingRepository->find($landingId);

        if (!$landing || $landing->user_id !== $userId) {
            return null;
        }

        return $landing;
    }

    /**
     * Create a new landing.
     */
    public function create(string $userId, array $data): Landing
    {
        $data['user_id'] = $userId;

        if (!isset($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        return $this->landingRepository->create($data);
    }

    /**
     * Create default landing for new user.
     * Moved from Landing model to follow SRP.
     */
    public function createDefault($user, string $username): Landing
    {
        $landing = $this->landingRepository->create([
            'name' => ucfirst($username),
            'company_id' => $user->company_id,
            'user_id' => $user->id,
            'slug' => $username,
            'logo' => [
                'image' => "https://api.dicebear.com/9.x/lorelei/svg?seed={$username}",
                'thumb' => "https://api.dicebear.com/9.x/lorelei/svg?seed={$username}",
            ],
            'verify' => true,
            'domain_name' => $username,
            'template_config' => $this->getDefaultTemplateConfig($username),
            'options' => $this->getDefaultOptions($username),
        ]);

        // Create first link
        Link::create([
            'landing_id' => $landing->id,
            'text' => 'Mi primer Link',
            'link' => 'https://' . config('app.url', 'linkea.ar') . '/' . $username,
            'state' => true,
            'slug' => 'mi_primer_link',
            'order' => 1,
            'type' => BlockTypes::BUTTON,
            'group' => LinkGroups::LINKS,
            'icon' => ['type' => 'solid', 'name' => 'link'],
        ]);

        return $landing;
    }

    /**
     * Update design/appearance settings.
     * Moved from PanelDataService.
     */
    public function updateDesign(Landing $landing, array $designData): Landing
    {
        $updateData = [];

        if (isset($designData['name'])) {
            $updateData['name'] = $designData['name'];
        }

        // Handle logo update
        if (array_key_exists('logo', $designData) && $designData['logo'] !== null) {
            if (is_array($designData['logo']) && isset($designData['logo']['base64_image'])) {
                $savedLogo = $this->imageService->saveLogo($designData['logo'], $landing->id);
                if ($savedLogo) {
                    $updateData['logo'] = $savedLogo;
                }
            } else {
                $updateData['logo'] = $designData['logo'];
            }
        }

        if (isset($designData['options'])) {
            $currentOptions = $landing->options ?? [];
            $updateData['options'] = array_merge($currentOptions, ArrayHelper::filterNull($designData['options']));
        }

        if (isset($designData['template_config'])) {
            $currentConfig = $landing->template_config ?? [];
            $updateData['template_config'] = ArrayHelper::mergeDeep($currentConfig, $designData['template_config']);
        }

        if (!empty($updateData)) {
            $this->landingRepository->update($landing->id, $updateData);
        }

        return $landing->fresh();
    }

    /**
     * Update general settings.
     * Moved from PanelDataService.
     */
    public function updateSettings(Landing $landing, array $settingsData): Landing
    {
        $updateData = [];

        if (isset($settingsData['slug']) && $settingsData['slug']) {
            $updateData['slug'] = $settingsData['slug'];
            $updateData['domain_name'] = $settingsData['slug'];
        }

        if (isset($settingsData['options'])) {
            $currentOptions = $landing->options ?? [];
            $updateData['options'] = array_merge($currentOptions, ArrayHelper::filterNull($settingsData['options']));
        }

        if (!empty($updateData)) {
            $this->landingRepository->update($landing->id, $updateData);
        }

        return $landing->fresh();
    }

    /**
     * Validate handle availability.
     */
    public function isHandleAvailable(string $handle, ?string $excludeLandingId = null): bool
    {
        $query = Landing::where('slug', $handle);

        if ($excludeLandingId) {
            $query->where('id', '!=', $excludeLandingId);
        }

        return !$query->exists();
    }

    /**
     * Get default template config for new landing.
     */
    protected function getDefaultTemplateConfig(string $username): array
    {
        return [
            'image_rounded' => true,
            'image_floating' => true, // Default: floating avatar with shadow/border
            'title' => '@' . $username,
            'subtitle' => '',
            'background' => [
                'backDropState' => false,
                'backDropColor' => 'rgba(255,255,255,0)',
                'backgroundColor' => '#FE6A16',
                'background' => 'linear-gradient(90deg, #FE6A16 0%, #ff528e 100%)',
                'bgName' => 'gradient',
            ],
            'textColor' => '#fff',
            'buttons' => [
                'style' => 'solid',
                'shape' => 'rounded',
                'size' => 'compact', // Default: compact size
                'backgroundColor' => '#607d8b',
                'backgroundHoverColor' => '#fe9c53',
                'textColor' => '#fff',
                'textHoverColor' => '#fff',
                'showIcons' => true,
                'iconAlignment' => 'left',
            ],
            'showLinkSubtext' => true, // Default: show URLs for new landings
            'icons' => [
                'show' => true,
                'position' => 'left',
                'size' => 10,
            ],
            'socials' => [
                'show' => true,
                'position' => 'top',
            ],
        ];
    }

    /**
     * Get default options for new landing.
     */
    protected function getDefaultOptions(string $username): array
    {
        return [
            'title' => '@' . $username,
            'icons' => [
                'show' => true,
                'position' => 'left',
                'size' => 10,
            ],
        ];
    }

    /**
     * Get featured landings for homepage display.
     * Returns verified landings with real images (no generated avatars) and multiple links.
     */
    public function getFeaturedForHomepage(int $limit = 5): array
    {
        $landings = Landing::query()
            ->where('logo', 'NOT LIKE', '%dicebear%')
            ->where('verify', true)
            ->with(['links' => function ($query) {
                $query->where('state', true)->orderBy('order', 'asc');
            }])
            ->inRandomOrder()
            ->limit($limit * 2) // Get more to filter
            ->get()
            ->filter(fn($l) => $l->links->count() > 1) // Filter those with 2+ links
            ->take($limit);

        return $landings->map(function ($landing) {
            return $this->transformLandingForDisplay($landing);
        })->values()->toArray();
    }

    /**
     * Transform landing data for frontend display (PhonePreview format).
     */
    protected function transformLandingForDisplay(Landing $landing): array
    {
        // Resolve avatar URL using StorageHelper
        $logo = $landing->logo;
        $avatarPath = '';
        if (is_array($logo)) {
            $avatarPath = $logo['image'] ?? $logo['thumb'] ?? '';
        } elseif (is_string($logo)) {
            $avatarPath = $logo;
        }
        $avatar = StorageHelper::url($avatarPath) ?: '';

        $templateConfig = $landing->template_config ?? [];
        $options = $landing->options ?? [];

        // Map bgName to theme - 'static' means custom solid color
        $bgName = $templateConfig['background']['bgName'] ?? 'custom';
        $theme = ($bgName === 'static') ? 'custom' : $bgName;

        // Get background color
        $bgColor = $templateConfig['background']['backgroundColor']
            ?? $templateConfig['background']['color']
            ?? '#ffffff';

        // Get button styling
        $buttons = $templateConfig['buttons'] ?? [];
        $buttonColor = $buttons['backgroundColor'] ?? $buttons['color'] ?? '#3b82f6';
        $buttonTextColor = $buttons['textColor'] ?? '#ffffff';

        // Determine button style
        $buttonStyle = 'solid';
        if (isset($buttons['borderShow']) && $buttons['borderShow']) {
            $buttonStyle = 'outline';
        }

        // Get background image - resolve to CSS url("...") format using StorageHelper
        $backgroundImage = $this->resolveBackgroundImage($templateConfig['background']['backgroundImage'] ?? null);

        // Background enabled - default to true if there's an image
        $backgroundEnabled = $templateConfig['background']['backgroundEnabled'] ?? ($backgroundImage !== null);

        return [
            'id' => $landing->id,
            'user' => [
                'name' => $landing->name,
                'handle' => $landing->slug ?? $landing->domain_name,
                'avatar' => $avatar,
                'bio' => $options['bio'] ?? '',
                'theme' => $theme,
                'isVerified' => $landing->verify,
                'customDesign' => [
                    'backgroundColor' => $bgColor,
                    'buttonStyle' => $buttonStyle,
                    'buttonShape' => $buttons['shape'] ?? 'rounded',
                    'buttonColor' => $buttonColor,
                    'buttonTextColor' => $buttonTextColor,
                    'fontPair' => $templateConfig['fontPair'] ?? 'modern',
                    'roundedAvatar' => $templateConfig['image_rounded'] ?? true,
                    'backgroundImage' => $backgroundImage,
                    'backgroundEnabled' => $backgroundEnabled,
                    'backgroundSize' => $templateConfig['background']['backgroundSize'] ?? 'cover',
                    'backgroundPosition' => $templateConfig['background']['backgroundPosition'] ?? 'center',
                ],
            ],
            'links' => $landing->links->map(function ($link) {
                return [
                    'id' => $link->id,
                    'title' => $link->text,
                    'url' => $link->link,
                    'isEnabled' => (bool) $link->state,
                    'type' => $link->type ?? 'link',
                    'clicks' => $link->visited ?? 0,
                    'icon' => $link->icon,
                    'sparklineData' => [],
                    'headerSize' => $link->options['headerSize'] ?? 'medium',
                    'showInlinePlayer' => $link->options['showInlinePlayer'] ?? false,
                    'phoneNumber' => $link->options['phoneNumber'] ?? null,
                    'predefinedMessage' => $link->options['predefinedMessage'] ?? null,
                ];
            })->values()->toArray(),
        ];
    }

    /**
     * Resolve background image to CSS url("...") format.
     * Handles: object {image: 'path'}, CSS strings, gradients, full URLs.
     */
    protected function resolveBackgroundImage($bgImage): ?string
    {
        if (empty($bgImage)) {
            return null;
        }

        // Object format {image: 'path', thumb: 'path'}
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
