<?php

namespace App\Services;

use App\Constants\BlockTypes;
use App\Constants\LinkGroups;
use App\Models\Landing;
use App\Models\Link;
use App\Repositories\Contracts\LinkRepository;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Service for link-related operations.
 */
class LinkService
{
    public function __construct(
        protected LinkRepository $linkRepository,
        protected StatisticsService $statisticsService
    ) {}

    /**
     * Get links for a landing.
     */
    public function getForLanding(string $landingId): Collection
    {
        return $this->linkRepository->getByLandingId($landingId);
    }

    /**
     * Get block links (not social) with statistics.
     */
    public function getBlockLinksWithStats(string $landingId): Collection
    {
        $links = $this->linkRepository->getByLandingId($landingId)
            ->where('group', LinkGroups::LINKS)
            ->values();

        return $this->enrichWithSparklineData($links);
    }

    /**
     * Get social links for landing with statistics.
     */
    public function getSocialLinks(string $landingId): Collection
    {
        $links = $this->linkRepository->getByLandingId($landingId)
            ->where('group', LinkGroups::SOCIALS)
            ->values();

        return $this->enrichWithSparklineData($links);
    }

    /**
     * Save block links (upsert pattern).
     * Moved from PanelDataService.
     */
    public function saveBlockLinks(Landing $landing, array $links): Collection
    {
        return DB::transaction(function () use ($landing, $links) {
            $processedIds = [];

            foreach ($links as $index => $linkData) {
                $linkData['group'] = LinkGroups::LINKS;
                $link = $this->upsertLink($landing, $linkData, $index);
                $processedIds[] = $link->id;
            }

            // Delete removed block links
            $landing->links()
                ->whereNotIn('id', $processedIds)
                ->delete();

            return $landing->fresh()->links;
        });
    }

    /**
     * Save social links (upsert pattern).
     * Moved from PanelDataService.
     */
    public function saveSocialLinks(Landing $landing, array $links): Collection
    {
        return DB::transaction(function () use ($landing, $links) {
            $processedIds = [];

            foreach ($links as $index => $linkData) {
                $linkData['group'] = LinkGroups::SOCIALS;
                $linkData['type'] = BlockTypes::SOCIAL;
                $link = $this->upsertLink($landing, $linkData, $index);
                $processedIds[] = $link->id;
            }

            // Delete removed social links
            $landing->socials()
                ->whereNotIn('id', $processedIds)
                ->delete();

            return $landing->fresh()->socials;
        });
    }

    /**
     * Create a single link.
     */
    public function create(string $landingId, array $data): Link
    {
        $data['landing_id'] = $landingId;
        $data['slug'] = isset($data['text']) ? Str::slug($data['text']) : null;

        return Link::create($data);
    }

    /**
     * Update a link.
     */
    public function update(string $linkId, array $data): ?Link
    {
        $link = Link::find($linkId);

        if (!$link) {
            return null;
        }

        if (isset($data['text'])) {
            $data['slug'] = Str::slug($data['text']);
        }

        $link->update($data);

        return $link->fresh();
    }

    /**
     * Delete a link.
     */
    public function delete(string $linkId): bool
    {
        return $this->linkRepository->delete($linkId) > 0;
    }

    /**
     * Record link click.
     */
    public function recordClick(string $linkId): bool
    {
        $link = Link::find($linkId);

        if (!$link) {
            return false;
        }

        $this->statisticsService->recordClick($link);

        return true;
    }

    /**
     * Upsert a single link (create or update).
     * Moved from PanelDataService.
     */
    protected function upsertLink(Landing $landing, array $data, int $defaultOrder = 0): Link
    {
        $linkId = $data['id'] ?? null;
        $slug = isset($data['text']) ? Str::slug($data['text']) : null;

        $attributes = [
            'landing_id' => $landing->id,
            'text' => $data['text'] ?? '',
            'link' => $data['link'] ?? '',
            'type' => $data['type'] ?? BlockTypes::LINK,
            'group' => $data['group'] ?? LinkGroups::LINKS,
            'state' => $data['state'] ?? true,
            'order' => $data['order'] ?? $defaultOrder,
            'slug' => $slug,
            'icon' => $data['icon'] ?? null,
            'image' => $data['image'] ?? null,
            'options' => $data['options'] ?? null,
            'config' => $data['config'] ?? null,
        ];

        // Search for existing link if ID looks like a valid UUID (from database)
        // Frontend generates temporary IDs like "temp-xxx" or "new-xxx" for new links
        if ($linkId && Str::isUuid($linkId)) {
            $existingLink = Link::where('id', $linkId)
                ->where('landing_id', $landing->id)
                ->first();

            if ($existingLink) {
                $existingLink->update($attributes);
                return $existingLink;
            }
        }

        return Link::create($attributes);
    }

    /**
     * Enrich links collection with sparkline data.
     */
    protected function enrichWithSparklineData(Collection $links): Collection
    {
        if ($links->isEmpty()) {
            return $links;
        }

        $linkIds = $links->pluck('id')->toArray();
        $statsMap = $this->statisticsService->getStatsForLinks($linkIds);

        return $links->map(function ($link) use ($statsMap) {
            $link->sparklineData = $statsMap->get($link->id, []);
            return $link;
        });
    }
}
