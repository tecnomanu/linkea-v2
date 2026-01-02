<?php

namespace App\Repositories\Contracts;

use Carbon\Carbon;
use Illuminate\Support\Collection;

interface StatisticsRepository
{
    /**
     * Get link statistics for multiple link IDs within a date range.
     */
    public function getLinkStatsByDateRange(array $linkIds, Carbon $startDate, Carbon $endDate): Collection;

    /**
     * Get aggregated click statistics grouped by date.
     */
    public function getAggregatedClickStats(array $linkIds, Carbon $startDate): Collection;

    /**
     * Get landing view statistics within a date range.
     */
    public function getLandingViewStats(string $landingId, Carbon $startDate): Collection;

    /**
     * Get sparkline data for multiple links (bulk).
     */
    public function getSparklineDataBulk(array $linkIds, int $days): Collection;

    /**
     * Create or increment daily link statistic.
     */
    public function recordLinkVisit(string $linkId, Carbon $date): void;

    /**
     * Create or increment daily landing view statistic.
     */
    public function recordLandingView(string $landingId, Carbon $date): void;
}
