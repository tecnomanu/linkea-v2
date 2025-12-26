<?php

namespace App\Services;

use App\Models\Landing;
use App\Models\LandingStatistic;
use App\Models\Link;
use App\Models\LinkStatistic;
use Carbon\Carbon;
use Illuminate\Support\Collection;

/**
 * Service for handling link click statistics and landing view analytics.
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

    /**
     * Get comprehensive dashboard stats for a landing.
     * 
     * @return array{
     *     totalViews: int,
     *     totalClicks: int,
     *     totalLinks: int,
     *     activeLinks: int,
     *     viewsToday: int,
     *     viewsThisWeek: int,
     *     viewsThisMonth: int,
     *     clicksToday: int,
     *     clicksThisWeek: int,
     *     clicksThisMonth: int,
     *     weeklyChange: float,
     *     dailyAverage: float,
     *     chartData: array,
     *     viewChartData: array,
     *     topLinks: array,
     *     linksByType: array
     * }
     */
    public function getLandingDashboardStats(string $landingId, int $chartDays = 30): array
    {
        // Get landing for views
        $landing = Landing::find($landingId);

        // Explicitly exclude soft deleted links
        $links = Link::where('landing_id', $landingId)
            ->whereNull('deleted_at')
            ->get();
        $linkIds = $links->pluck('id')->toArray();

        $today = Carbon::today();
        $startOfWeek = Carbon::now()->startOfWeek();
        $startOfMonth = Carbon::now()->startOfMonth();
        $startOfLastWeek = Carbon::now()->subWeek()->startOfWeek();
        $endOfLastWeek = Carbon::now()->subWeek()->endOfWeek();

        // VIEWS STATS
        $totalViews = $landing?->views ?? 0;

        $viewsToday = LandingStatistic::where('landing_id', $landingId)
            ->where('date', $today)
            ->sum('views');

        $viewsThisWeek = LandingStatistic::where('landing_id', $landingId)
            ->where('date', '>=', $startOfWeek)
            ->sum('views');

        $viewsThisMonth = LandingStatistic::where('landing_id', $landingId)
            ->where('date', '>=', $startOfMonth)
            ->sum('views');

        // Total clicks (all time)
        $totalClicks = $links->sum('visited');

        // Clicks today
        $clicksToday = LinkStatistic::whereIn('link_id', $linkIds)
            ->where('date', $today)
            ->sum('visits');

        // Clicks this week
        $clicksThisWeek = LinkStatistic::whereIn('link_id', $linkIds)
            ->where('date', '>=', $startOfWeek)
            ->sum('visits');

        // Clicks last week (for comparison)
        $clicksLastWeek = LinkStatistic::whereIn('link_id', $linkIds)
            ->whereBetween('date', [$startOfLastWeek, $endOfLastWeek])
            ->sum('visits');

        // Clicks this month
        $clicksThisMonth = LinkStatistic::whereIn('link_id', $linkIds)
            ->where('date', '>=', $startOfMonth)
            ->sum('visits');

        // Weekly change percentage
        $weeklyChange = $clicksLastWeek > 0
            ? round((($clicksThisWeek - $clicksLastWeek) / $clicksLastWeek) * 100, 1)
            : ($clicksThisWeek > 0 ? 100 : 0);

        // Daily average (last 30 days)
        $last30DaysClicks = LinkStatistic::whereIn('link_id', $linkIds)
            ->where('date', '>=', Carbon::today()->subDays(29))
            ->sum('visits');
        $dailyAverage = round($last30DaysClicks / 30, 1);

        // Chart data (clicks per day)
        $chartData = $this->getAggregatedChartData($linkIds, $chartDays);

        // View chart data
        $viewChartData = $this->getViewChartData($landingId, $chartDays);

        // Top performing links (by clicks)
        $topLinks = $links
            ->where('state', true)
            ->where('type', '!=', 'header')
            ->sortByDesc('visited')
            ->take(5)
            ->map(function ($link) use ($linkIds) {
                $sparkline = $this->getSparklineData($link->id, 7);
                return [
                    'id' => $link->id,
                    'title' => $link->text,
                    'type' => $link->type,
                    'clicks' => $link->visited ?? 0,
                    'sparklineData' => $sparkline,
                ];
            })
            ->values()
            ->toArray();

        // Links breakdown by type (only clickable types)
        $nonClickableTypes = ['header'];
        $linksByType = $links
            ->where('state', true)
            ->whereNotIn('type', $nonClickableTypes)
            ->groupBy('type')
            ->map(function ($group, $type) {
                return [
                    'type' => $type,
                    'count' => $group->count(),
                    'clicks' => $group->sum('visited'),
                ];
            })
            ->sortByDesc('clicks')
            ->values()
            ->toArray();

        return [
            'totalViews' => $totalViews,
            'totalClicks' => $totalClicks,
            'totalLinks' => $links->count(),
            'activeLinks' => $links->where('state', true)->count(),
            'viewsToday' => $viewsToday,
            'viewsThisWeek' => $viewsThisWeek,
            'viewsThisMonth' => $viewsThisMonth,
            'clicksToday' => $clicksToday,
            'clicksThisWeek' => $clicksThisWeek,
            'clicksThisMonth' => $clicksThisMonth,
            'weeklyChange' => $weeklyChange,
            'dailyAverage' => $dailyAverage,
            'chartData' => $chartData,
            'viewChartData' => $viewChartData,
            'topLinks' => $topLinks,
            'linksByType' => $linksByType,
        ];
    }

    // =======================================================================
    // LANDING VIEWS TRACKING
    // =======================================================================

    /**
     * Record a landing page view.
     * Should only be called for human visitors (use BotDetector first).
     */
    public function recordLandingView(Landing $landing): void
    {
        // Increment total views count
        $landing->increment('views');

        // Record daily statistic
        $this->recordDailyLandingStatistic($landing->id);
    }

    /**
     * Record daily statistic for a landing view.
     * Uses upsert to avoid race conditions and unique constraint violations.
     */
    protected function recordDailyLandingStatistic(string $landingId): void
    {
        $today = Carbon::today();

        $existing = LandingStatistic::where('landing_id', $landingId)
            ->where('date', $today)
            ->first();

        if ($existing) {
            $existing->increment('views');
        } else {
            try {
                LandingStatistic::create([
                    'landing_id' => $landingId,
                    'date' => $today,
                    'views' => 1,
                ]);
            } catch (\Illuminate\Database\UniqueConstraintViolationException $e) {
                // Race condition: another request created the record
                LandingStatistic::where('landing_id', $landingId)
                    ->where('date', $today)
                    ->increment('views');
            }
        }
    }

    /**
     * Get total views for a landing.
     */
    public function getTotalViewsForLanding(string $landingId): int
    {
        return Landing::where('id', $landingId)->value('views') ?? 0;
    }

    /**
     * Get views for a time period.
     */
    public function getViewsForPeriod(string $landingId, int $days = 30): int
    {
        $startDate = Carbon::today()->subDays($days - 1);

        return LandingStatistic::where('landing_id', $landingId)
            ->where('date', '>=', $startDate)
            ->sum('views');
    }

    /**
     * Get view chart data for a landing.
     */
    public function getViewChartData(string $landingId, int $days = 30): array
    {
        $startDate = Carbon::today()->subDays($days - 1);

        $statistics = LandingStatistic::where('landing_id', $landingId)
            ->where('date', '>=', $startDate)
            ->orderBy('date', 'asc')
            ->get()
            ->keyBy(fn($stat) => Carbon::parse($stat->date)->format('Y-m-d'));

        $chartData = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $dateKey = $date->format('Y-m-d');
            $chartData[] = [
                'date' => $date->format('d M'),
                'fullDate' => $dateKey,
                'views' => (int) ($statistics->get($dateKey)?->views ?? 0),
            ];
        }

        return $chartData;
    }

    /**
     * Get aggregated chart data for multiple links.
     */
    protected function getAggregatedChartData(array $linkIds, int $days): array
    {
        $startDate = Carbon::today()->subDays($days - 1);

        $statistics = LinkStatistic::whereIn('link_id', $linkIds)
            ->where('date', '>=', $startDate)
            ->selectRaw('date, SUM(visits) as total_visits')
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get()
            ->keyBy(fn($stat) => Carbon::parse($stat->date)->format('Y-m-d'));

        $chartData = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $dateKey = $date->format('Y-m-d');
            $chartData[] = [
                'date' => $date->format('d M'),
                'fullDate' => $dateKey,
                'clicks' => (int) ($statistics->get($dateKey)?->total_visits ?? 0),
            ];
        }

        return $chartData;
    }
}
