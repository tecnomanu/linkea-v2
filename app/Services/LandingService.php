<?php

namespace App\Services;

use App\Constants\BlockTypes;
use App\Constants\LinkGroups;
use App\Constants\ThemeDefaults;
use App\Models\Landing;
use App\Models\Link;
use App\Repositories\Contracts\LandingRepository;
use App\Support\Helpers\ArrayHelper;
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
     * 
     * Note: verify=false by default. Users must verify to appear in sitemap/gallery.
     * Note: domain_name is for custom domains (future feature), not set on creation.
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
            'verify' => false, // Must verify to appear public (sitemap, gallery)
            'template_config' => $this->getDefaultTemplateConfig($username),
            'options' => $this->getDefaultOptions($username),
        ]);

        // Create first link
        Link::create([
            'landing_id' => $landing->id,
            'text' => 'Mi primer Link',
            'link' => url('/' . $username),
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
     * 
     * Note: slug and domain_name are separate fields.
     * - slug: the handle at linkea.ar/{slug}
     * - domain_name: for custom domains (future feature, updated separately)
     */
    public function updateSettings(Landing $landing, array $settingsData): Landing
    {
        $updateData = [];

        if (isset($settingsData['slug']) && $settingsData['slug']) {
            $updateData['slug'] = $settingsData['slug'];
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
     * Uses ThemeDefaults constant (Atardecer/Sunset theme).
     */
    protected function getDefaultTemplateConfig(string $username): array
    {
        return ThemeDefaults::templateConfig($username);
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
     * Get all public landings for gallery page with pagination.
     * Returns quality-ranked landings filtered by activity and engagement.
     * 
     * Ranking criteria:
     * - Must have real avatar (no dicebear)
     * - Must have been modified after creation
     * - Must not have only the default "Mi primer Link" block
     * - Sorted by: total clicks, link count, recent activity
     */
    public function getAllPublicLandings(int $perPage = 30, ?string $search = null): array
    {
        $query = Landing::query()
            ->where('verify', true)
            // Only real avatars (no generated ones)
            ->where('logo', 'NOT LIKE', '%dicebear%')
            // Must have been modified after creation (shows activity)
            ->whereRaw('updated_at > created_at')
            // Load links with click stats
            ->with(['links' => function ($query) {
                $query->where('state', true)->orderBy('order', 'asc');
            }])
            // Subquery for total clicks across all links
            ->withSum(['links as total_clicks' => function ($query) {
                $query->where('state', true);
            }], 'visited')
            // Subquery for active link count
            ->withCount(['links as active_links_count' => function ($query) {
                $query->where('state', true);
            }]);

        // Search filter
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('slug', 'LIKE', "%{$search}%")
                    ->orWhere('domain_name', 'LIKE', "%{$search}%");
            });
        }

        // Get all matching landings for filtering
        $landings = $query->get();

        // Filter out landings with only default block "Mi primer Link"
        $filtered = $landings->filter(function ($landing) {
            $links = $landing->links;

            // Must have at least one link
            if ($links->isEmpty()) {
                return false;
            }

            // If only one link, check it's not the default one
            if ($links->count() === 1) {
                $firstLink = $links->first();
                $defaultTexts = ['Mi primer Link', 'Mi primer link', 'mi primer link'];
                if (in_array($firstLink->text, $defaultTexts)) {
                    return false;
                }
            }

            return true;
        });

        // Calculate quality score and sort
        $scored = $filtered->map(function ($landing) {
            // Score components (weighted)
            $clickScore = min(($landing->total_clicks ?? 0) / 10, 100); // Max 100 pts from clicks
            $linkScore = min($landing->active_links_count * 5, 50); // Max 50 pts from link count
            $recencyScore = $this->calculateRecencyScore($landing->updated_at); // Max 30 pts

            $landing->quality_score = $clickScore + $linkScore + $recencyScore;
            return $landing;
        })->sortByDesc('quality_score')->values();

        // Manual pagination
        $page = (int) request()->query('page', 1);
        $offset = ($page - 1) * $perPage;
        $total = $scored->count();
        $lastPage = (int) ceil($total / $perPage);

        $pageItems = $scored->slice($offset, $perPage);

        return [
            'data' => $pageItems->values(),
            'meta' => [
                'current_page' => $page,
                'last_page' => max(1, $lastPage),
                'per_page' => $perPage,
                'total' => $total,
            ],
        ];
    }

    /**
     * Calculate recency score based on last update.
     * More recent updates get higher scores.
     */
    protected function calculateRecencyScore($updatedAt): float
    {
        if (!$updatedAt) {
            return 0;
        }

        $daysSinceUpdate = now()->diffInDays($updatedAt);

        // Score decay: 30 pts if updated today, decreasing over 90 days
        if ($daysSinceUpdate <= 7) {
            return 30;
        } elseif ($daysSinceUpdate <= 30) {
            return 25;
        } elseif ($daysSinceUpdate <= 60) {
            return 15;
        } elseif ($daysSinceUpdate <= 90) {
            return 10;
        }

        return 5; // Minimum score for older but still valid landings
    }

    /**
     * Get featured landings for homepage display.
     * Returns verified landings with real images (no generated avatars) and multiple links.
     * 
     * Note: Returns Landing models. Use FeaturedLandingResource in controller
     * for consistent transformation.
     */
    public function getFeaturedForHomepage(int $limit = 5)
    {
        return Landing::query()
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
    }

    /**
     * Get public statistics for homepage.
     * Returns total landings, links (blocks), and clicks.
     */
    public function getPublicStats(): array
    {
        return [
            'landings' => Landing::count(),
            'blocks' => Link::count(),
            'clicks' => (int) Link::sum('visited'),
        ];
    }
}
