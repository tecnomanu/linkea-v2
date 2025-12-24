<?php

namespace App\Services;

use App\Models\Link;
use App\Models\LinkStatistic;
use Carbon\Carbon;
use Illuminate\Support\Collection;

/**
 * Service for handling link click statistics and analytics.
 */
class StatisticsService
{
    /**
     * Record a link click.
     */
    public function recordClick(Link $link): void
    {
        // Increment total visited count
        $link->increment('visited');

        // Record daily statistic
        $this->recordDailyStatistic($link->id);
    }

    /**
     * Record daily statistic for a link.
     * Uses upsert to avoid race conditions and unique constraint violations.
     */
    protected function recordDailyStatistic(string $linkId): void
    {
        $today = Carbon::today();

        // Use upsert with raw increment to handle concurrent requests
        $existing = LinkStatistic::where('link_id', $linkId)
            ->where('date', $today)
            ->first();

        if ($existing) {
            $existing->increment('visits');
        } else {
            // Try to create, if it fails due to race condition, increment instead
            try {
                LinkStatistic::create([
                    'link_id' => $linkId,
                    'date' => $today,
                    'visits' => 1,
                ]);
            } catch (\Illuminate\Database\UniqueConstraintViolationException $e) {
                // Another request created the record, just increment
                LinkStatistic::where('link_id', $linkId)
                    ->where('date', $today)
                    ->increment('visits');
            }
        }
    }

    /**
     * Get sparkline data for a link (last 7 days).
     *
     * @return array<array{value: int}>
     */
    public function getSparklineData(string $linkId, int $days = 7): array
    {
        $statistics = LinkStatistic::where('link_id', $linkId)
            ->where('date', '>=', Carbon::today()->subDays($days - 1))
            ->orderBy('date', 'asc')
            ->get()
            ->keyBy(fn($stat) => $stat->date->format('Y-m-d'));

        $sparklineData = [];

        for ($i = $days - 1; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i)->format('Y-m-d');
            $sparklineData[] = [
                'value' => $statistics->get($date)?->visits ?? 0,
            ];
        }

        return $sparklineData;
    }

    /**
     * Get statistics for multiple links.
     *
     * @return Collection<string, array>
     */
    public function getStatsForLinks(array $linkIds, int $days = 7): Collection
    {
        $startDate = Carbon::today()->subDays($days - 1);

        $statistics = LinkStatistic::whereIn('link_id', $linkIds)
            ->where('date', '>=', $startDate)
            ->orderBy('date', 'asc')
            ->get()
            ->groupBy('link_id');

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
     * Get total clicks for a landing's links.
     */
    public function getTotalClicksForLanding(string $landingId): int
    {
        return Link::where('landing_id', $landingId)->sum('visited');
    }

    /**
     * Get click summary for a time period.
     */
    public function getClickSummary(string $linkId, int $days = 30): array
    {
        $startDate = Carbon::today()->subDays($days - 1);

        $stats = LinkStatistic::where('link_id', $linkId)
            ->where('date', '>=', $startDate)
            ->get();

        return [
            'total' => $stats->sum('visits'),
            'average' => round($stats->avg('visits') ?? 0, 1),
            'max' => $stats->max('visits') ?? 0,
            'days' => $days,
        ];
    }

    /**
     * Get data range (first and last recorded click) for a link.
     */
    public function getDataRange(string $linkId): array
    {
        $firstStat = LinkStatistic::where('link_id', $linkId)
            ->orderBy('date', 'asc')
            ->first();

        $lastStat = LinkStatistic::where('link_id', $linkId)
            ->orderBy('date', 'desc')
            ->first();

        if (!$firstStat || !$lastStat) {
            return [
                'firstClick' => null,
                'lastClick' => null,
                'hasData' => false,
            ];
        }

        return [
            'firstClick' => $firstStat->date->format('d/m/Y'),
            'lastClick' => $lastStat->date->format('d/m/Y'),
            'hasData' => true,
        ];
    }
}
