<?php

namespace App\Http\Controllers\Api;

use App\Constants\ResponseMessages;
use App\Http\Controllers\Controller;
use App\Models\Landing;
use App\Services\LinkService;
use App\Services\StatisticsService;
use App\Support\Helpers\BotDetector;
use App\Traits\HasApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StatisticsController extends Controller
{
    use HasApiResponse;

    public function __construct(
        protected LinkService $linkService,
        protected StatisticsService $statisticsService
    ) {}

    /**
     * Record a link click.
     */
    public function trace(string $id): JsonResponse
    {
        $recorded = $this->linkService->recordClick($id);

        if (!$recorded) {
            return $this->notFound(ResponseMessages::LINK_NOT_FOUND);
        }

        return $this->success(['status' => 'success']);
    }

    /**
     * Record a landing page view.
     * Filters out bot traffic to only count human visitors.
     */
    public function trackView(Request $request, string $landingId): JsonResponse
    {
        // Skip if bot detected
        if (BotDetector::isBot($request)) {
            return $this->success([
                'status' => 'skipped',
                'reason' => 'bot_detected',
            ]);
        }

        $landing = Landing::find($landingId);

        if (!$landing) {
            return $this->notFound(ResponseMessages::LANDING_NOT_FOUND);
        }

        $this->statisticsService->recordLandingView($landing);

        return $this->success(['status' => 'recorded']);
    }
}
