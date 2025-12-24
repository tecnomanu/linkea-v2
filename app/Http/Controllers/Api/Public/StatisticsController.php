<?php

namespace App\Http\Controllers\Api\Public;

use App\Constants\ResponseMessages;
use App\Http\Controllers\Controller;
use App\Services\LinkService;
use App\Traits\HasApiResponse;
use Illuminate\Http\JsonResponse;

/**
 * Public API endpoints (no authentication required).
 * Used from landing pages for tracking and public data.
 */
class StatisticsController extends Controller
{
    use HasApiResponse;

    public function __construct(
        protected LinkService $linkService
    ) {}

    /**
     * Record a link click (called from landing pages).
     */
    public function trace(string $id): JsonResponse
    {
        $recorded = $this->linkService->recordClick($id);

        if (!$recorded) {
            return $this->notFound(ResponseMessages::LINK_NOT_FOUND);
        }

        return $this->success(['status' => 'success']);
    }
}

