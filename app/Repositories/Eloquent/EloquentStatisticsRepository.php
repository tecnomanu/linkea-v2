<?php

namespace App\Repositories\Eloquent;

use App\Models\LandingStatistic;
use App\Models\LinkStatistic;
use App\Repositories\Contracts\StatisticsRepository;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class EloquentStatisticsRepository implements StatisticsRepository
{
    public function __construct(
        protected LinkStatistic $linkStatistic,
        protected LandingStatistic $landingStatistic
    ) {}

    /**
     * Get link statistics for multiple link IDs within a date range.
     * OPTIMIZED: Single query for bulk stats.
     */
    public function getLinkStatsByDateRange(array $linkIds, Carbon $startDate, Carbon $endDate): Collection
    {
        if (empty($linkIds)) {
            return collect();
        }

        return $this->linkStatistic
            ->whereIn('link_id', $linkIds)
            ->whereBetween('date', [$startDate, $endDate])
            ->get();
    }

    /**
     * Get aggregated click statistics grouped by date.
     * Returns total visits per day across all provided links.
     */
    public function getAggregatedClickStats(array $linkIds, Carbon $startDate): Collection
    {
        if (empty($linkIds)) {
            return collect();
        }

        return $this->linkStatistic
            ->whereIn('link_id', $linkIds)
            ->where('date', '>=', $startDate)
            ->selectRaw('date, SUM(visits) as total_visits')
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();
    }

    /**
     * Get landing view statistics within a date range.
     */
    public function getLandingViewStats(string $landingId, Carbon $startDate): Collection
    {
        return $this->landingStatistic
            ->where('landing_id', $landingId)
            ->where('date', '>=', $startDate)
            ->orderBy('date', 'asc')
            ->get();
    }

    /**
     * Get sparkline data for multiple links (bulk query).
     * Returns collection keyed by link_id with array of visit counts.
     */
    public function getSparklineDataBulk(array $linkIds, int $days = 7): Collection
    {
        if (empty($linkIds)) {
            return collect();
        }

        $startDate = Carbon::today()->subDays($days - 1);

        $statistics = $this->linkStatistic
            ->whereIn('link_id', $linkIds)
            ->where('date', '>=', $startDate)
            ->orderBy('date', 'asc')
            ->get()
            ->groupBy('link_id');

        // Build sparkline array for each link
        return collect($linkIds)->mapWithKeys(function ($linkId) use ($statistics, $days) {
            $linkStats = $statistics->get($linkId, collect())->keyBy(
                fn($stat) => $stat->date->format('Y-m-d')
            );

            $sparklineData = [];
            for ($i = $days - 1; $i >= 0; $i--) {
                $date = Carbon::today()->subDays($i)->format('Y-m-d');
                $sparklineData[] = [
                    'value' => $linkStats->get($date)?->visits ?? 0,
                ];
            }

            return [$linkId => $sparklineData];
        });
    }

    /**
     * Create or increment daily link statistic.
     * Uses optimistic locking to handle race conditions.
     */
    public function recordLinkVisit(string $linkId, Carbon $date): void
    {
        $existing = $this->linkStatistic
            ->where('link_id', $linkId)
            ->where('date', $date)
            ->first();

        if ($existing) {
            $existing->increment('visits');
        } else {
            try {
                $this->linkStatistic->create([
                    'link_id' => $linkId,
                    'date' => $date,
                    'visits' => 1,
                ]);
            } catch (\Illuminate\Database\UniqueConstraintViolationException $e) {
                // Race condition: another request created the record
                $this->linkStatistic
                    ->where('link_id', $linkId)
                    ->where('date', $date)
                    ->increment('visits');
            }
        }
    }

    /**
     * Create or increment daily landing view statistic.
     * Uses optimistic locking to handle race conditions.
     */
    public function recordLandingView(string $landingId, Carbon $date): void
    {
        $existing = $this->landingStatistic
            ->where('landing_id', $landingId)
            ->where('date', $date)
            ->first();

        if ($existing) {
            $existing->increment('views');
        } else {
            try {
                $this->landingStatistic->create([
                    'landing_id' => $landingId,
                    'date' => $date,
                    'views' => 1,
                ]);
            } catch (\Illuminate\Database\UniqueConstraintViolationException $e) {
                // Race condition: another request created the record
                $this->landingStatistic
                    ->where('landing_id', $landingId)
                    ->where('date', $date)
                    ->increment('views');
            }
        }
    }
}
