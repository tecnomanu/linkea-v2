<?php

namespace App\Http\Controllers\Api\Panel;

use App\Constants\ResponseMessages;
use App\Http\Controllers\Controller;
use App\Http\Requests\Panel\SaveLinksRequest;
use App\Http\Resources\LinkResource;
use App\Models\Link;
use App\Services\LinkService;
use App\Services\StatisticsService;
use App\Traits\AuthorizesLanding;
use App\Traits\HasApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Handles link management for the Inertia/React panel.
 */
class LinkController extends Controller
{
    use HasApiResponse, AuthorizesLanding;

    public function __construct(
        protected LinkService $linkService,
        protected StatisticsService $statisticsService
    ) {}

    /**
     * Save block links (non-social links).
     */
    public function saveLinks(SaveLinksRequest $request, string $landingId): JsonResponse
    {
        $landing = $this->getAuthorizedLanding($landingId);

        if (!$landing) {
            return $this->landingUnauthorizedResponse();
        }

        $savedLinks = $this->linkService->saveBlockLinks(
            $landing,
            $request->toServiceFormat()
        );

        return $this->success(
            ['links' => LinkResource::collection($savedLinks)],
            ResponseMessages::LINKS_SAVED
        );
    }

    /**
     * Save social links.
     */
    public function saveSocialLinks(SaveLinksRequest $request, string $landingId): JsonResponse
    {
        $landing = $this->getAuthorizedLanding($landingId);

        if (!$landing) {
            return $this->landingUnauthorizedResponse();
        }

        // Transform social links format
        $socialLinksData = collect($request->validated()['links'] ?? [])->map(function ($link, $index) {
            return [
                'id' => $link['id'] ?? null,
                'text' => '',
                'link' => $link['url'] ?? '',
                'icon' => $link['icon'] ?? null,
                'state' => $link['isEnabled'] ?? true,
                'order' => $link['order'] ?? $index,
            ];
        })->toArray();

        $savedLinks = $this->linkService->saveSocialLinks($landing, $socialLinksData);

        return $this->success(
            ['socialLinks' => LinkResource::collection($savedLinks)],
            ResponseMessages::SOCIAL_LINKS_SAVED
        );
    }

    /**
     * Get detailed statistics for a specific link.
     */
    public function getStats(Request $request, string $linkId): JsonResponse
    {
        $link = Link::find($linkId);

        if (!$link) {
            return $this->error('Link not found', 404);
        }

        // Verify ownership via landing
        $landing = $this->getAuthorizedLanding($link->landing_id);
        if (!$landing) {
            return $this->landingUnauthorizedResponse();
        }

        $days = (int) $request->get('days', 30);
        $days = min(max($days, 7), 365); // Clamp between 7 and 365

        $sparklineData = $this->statisticsService->getSparklineData($linkId, $days);
        $summary = $this->statisticsService->getClickSummary($linkId, $days);
        $dataRange = $this->statisticsService->getDataRange($linkId);

        return $this->success([
            'linkId' => $linkId,
            'totalClicks' => $link->visited,
            'period' => [
                'days' => $days,
                'clicks' => $summary['total'],
                'average' => $summary['average'],
                'max' => $summary['max'],
            ],
            'sparklineData' => $sparklineData,
            'dataRange' => $dataRange,
        ]);
    }
}
