<?php

namespace App\Http\Controllers\Api;

use App\Constants\ResponseMessages;
use App\Http\Controllers\Controller;
use App\Services\LinkService;
use App\Traits\HasApiResponse;
use Illuminate\Http\JsonResponse;

class StatisticsController extends Controller
{
    use HasApiResponse;

    public function __construct(
        protected LinkService $linkService
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
}
