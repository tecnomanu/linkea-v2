<?php

namespace App\Services;

use App\Models\Landing;
use App\Models\Link;
use App\Repositories\Contracts\LinkRepository;
use App\Repositories\Contracts\StatisticsRepository;
use Carbon\Carbon;
use Illuminate\Support\Collection;

/**
 * Service for handling link click statistics and landing view analytics.
 * OPTIMIZED: Uses repository pattern + caching for better performance.
 */
class StatisticsService
{
    public function __construct(
        protected StatisticsRepository $statisticsRepository,
        protected LinkRepository $linkRepository
    ) {}

    /**
     * Record a link click.
     */
    public function recordClick(Link $link): void
    {
        // Increment total visited count
        $link->increment('visited');

        // Record daily statistic via repository
        $this->statisticsRepository->recordLinkVisit($link->id, Carbon::today());
    }

    /**
     * Get sparkline data for a link (last 7 days).
     *
     * @return array<array{value: int}>
     */
    public function getSparklineData(string $linkId, int $days = 7): array
    {
        return $this->statisticsRepository
            ->getSparklineDataBulk([$linkId], $days)
            ->get($linkId, []);
    }

    /**
     * Get statistics for multiple links (BULK).
     * OPTIMIZATION: Uses repository bulk query method.
     *
     * @return Collection<string, array>
     */
    public function getStatsForLinks(array $linkIds, int $days = 7): Collection
    {
        if (empty($linkIds)) {
            return collect();
        }

        // Cache statistics for 5 minutes to improve performance on high-traffic panels
        // Sort IDs to ensure consistent cache keys regardless of order
        sort($linkIds);
        $cacheKey = 'link_stats_' . md5(implode(',', $linkIds)) . '_' . $days;

        return cache()->remember($cacheKey, 300, function () use ($linkIds, $days) {
            return $this->statisticsRepository->getSparklineDataBulk($linkIds, $days);
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
        $endDate = Carbon::today();

        $stats = $this->statisticsRepository
            ->getLinkStatsByDateRange([$linkId], $startDate, $endDate);

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
        $firstStat = \App\Models\LinkStatistic::where('link_id', $linkId)
            ->orderBy('date', 'asc')
            ->first();

        $lastStat = \App\Models\LinkStatistic::where('link_id', $linkId)
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
     * OPTIMIZATION: Cached for 5 minutes, bulk queries via repository.
     */
    public function getLandingDashboardStats(string $landingId, int $chartDays = 30): array
    {
        $cacheKey = "landing_dashboard_stats:{$landingId}:{$chartDays}";

        return cache()->remember($cacheKey, 300, function () use ($landingId, $chartDays) {
            return $this->calculateDashboardStats($landingId, $chartDays);
        });
    }

    /**
     * Calculate dashboard stats (called by cache).
     * OPTIMIZATION: Minimal queries using repositories.
     */
    protected function calculateDashboardStats(string $landingId, int $chartDays = 30): array
    {
        $landing = Landing::find($landingId);
        $links = $this->linkRepository->getByLandingId($landingId);
        $linkIds = $links->pluck('id')->toArray();

        if (empty($linkIds)) {
            return $this->getEmptyDashboardStats();
        }

        $today = Carbon::today();
        $startOfWeek = Carbon::now()->startOfWeek();
        $startOfMonth = Carbon::now()->startOfMonth();
        $startOfLastWeek = Carbon::now()->subWeek()->startOfWeek();

        // OPTIMIZATION: Single bulk query for ALL click stats
        $clickStats = $this->statisticsRepository
            ->getLinkStatsByDateRange($linkIds, $startOfLastWeek, $today)
            ->keyBy('date');

        // OPTIMIZATION: Single bulk query for ALL view stats
        $viewStats = $this->statisticsRepository
            ->getLandingViewStats($landingId, $startOfWeek)
            ->keyBy('date');

        // Calculate periods from cached data
        $clicksToday = $clickStats->where('date', $today)->sum('visits');
        $clicksThisWeek = $clickStats->filter(fn($s) => Carbon::parse($s->date) >= $startOfWeek)->sum('visits');
        $clicksLastWeek = $clickStats->filter(function ($s) use ($startOfLastWeek, $startOfWeek) {
            $date = Carbon::parse($s->date);
            return $date >= $startOfLastWeek && $date < $startOfWeek;
        })->sum('visits');
        $clicksThisMonth = $clickStats->filter(fn($s) => Carbon::parse($s->date) >= $startOfMonth)->sum('visits');

        $last30Days = Carbon::today()->subDays(29);
        $last30DaysClicks = $clickStats->filter(fn($s) => Carbon::parse($s->date) >= $last30Days)->sum('visits');

        $viewsToday = $viewStats->get($today->toDateString())?->views ?? 0;
        $viewsThisWeek = $viewStats->sum('views');
        $viewsThisMonth = $viewStats->filter(fn($s) => Carbon::parse($s->date) >= $startOfMonth)->sum('views');

        // Weekly change percentage
        $weeklyChange = $clicksLastWeek > 0
            ? round((($clicksThisWeek - $clicksLastWeek) / $clicksLastWeek) * 100, 1)
            : ($clicksThisWeek > 0 ? 100 : 0);

        $dailyAverage = round($last30DaysClicks / 30, 1);
        $totalClicks = $links->sum('visited');

        // Chart data via repository
        $chartData = $this->getAggregatedChartData($linkIds, $chartDays);
        $viewChartData = $this->getViewChartData($landingId, $chartDays);

        // Top links with bulk sparklines
        $topLinkIds = $links
            ->where('state', true)
            ->where('type', '!=', 'header')
            ->sortByDesc('visited')
            ->take(5)
            ->pluck('id')
            ->toArray();

        $topLinksSparklines = $this->getStatsForLinks($topLinkIds, 7);

        $topLinks = $links
            ->where('state', true)
            ->where('type', '!=', 'header')
            ->sortByDesc('visited')
            ->take(5)
            ->map(function ($link) use ($topLinksSparklines) {
                return [
                    'id' => $link->id,
                    'title' => $link->text,
                    'type' => $link->type,
                    'clicks' => $link->visited ?? 0,
                    'sparklineData' => $topLinksSparklines->get($link->id, []),
                ];
            })
            ->values()
            ->toArray();

        // Links breakdown by type
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
            'totalViews' => $landing?->views ?? 0,
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

    protected function getEmptyDashboardStats(): array
    {
        return [
            'totalViews' => 0,
            'totalClicks' => 0,
            'totalLinks' => 0,
            'activeLinks' => 0,
            'viewsToday' => 0,
            'viewsThisWeek' => 0,
            'viewsThisMonth' => 0,
            'clicksToday' => 0,
            'clicksThisWeek' => 0,
            'clicksThisMonth' => 0,
            'weeklyChange' => 0,
            'dailyAverage' => 0,
            'chartData' => [],
            'viewChartData' => [],
            'topLinks' => [],
            'linksByType' => [],
        ];
    }

    // =======================================================================
    // LANDING VIEWS TRACKING
    // =======================================================================

    /**
     * Record a landing page view.
     */
    public function recordLandingView(Landing $landing): void
    {
        $landing->increment('views');
        $this->statisticsRepository->recordLandingView($landing->id, Carbon::today());
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
        return $this->statisticsRepository
            ->getLandingViewStats($landingId, $startDate)
            ->sum('views');
    }

    /**
     * Get view chart data for a landing.
     */
    public function getViewChartData(string $landingId, int $days = 30): array
    {
        $startDate = Carbon::today()->subDays($days - 1);

        $statistics = $this->statisticsRepository
            ->getLandingViewStats($landingId, $startDate)
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

        $statistics = $this->statisticsRepository
            ->getAggregatedClickStats($linkIds, $startDate)
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
