<?php

namespace App\Notifications;

use App\Models\Landing;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Carbon;

/**
 * Weekly statistics report notification sent to users.
 * Includes landing views, link clicks, and top performing links.
 */
class WeeklyStatsReport extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 3;

    /**
     * The number of seconds to wait before retrying the job.
     */
    public int $backoff = 60;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public array $stats = []
    ) {
        $this->onQueue('notifications');
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $appName = config('app.name');

        // Get stats or use defaults
        $userName = $this->stats['user_name'] ?? $notifiable->first_name ?? 'Usuario';
        $landingName = $this->stats['landing_name'] ?? '';
        $totalViews = $this->stats['total_views'] ?? 0;
        $totalClicks = $this->stats['total_clicks'] ?? 0;
        $viewsChange = $this->stats['views_change'] ?? 0;
        $clicksChange = $this->stats['clicks_change'] ?? 0;
        $viewsSparkline = $this->stats['views_sparkline'] ?? [];
        $clicksSparkline = $this->stats['clicks_sparkline'] ?? [];
        $topLinks = $this->stats['top_links'] ?? [];
        $weekStart = $this->stats['week_start'] ?? Carbon::now()->subWeek()->format('d/m');
        $weekEnd = $this->stats['week_end'] ?? Carbon::now()->format('d/m');

        return (new MailMessage)
            ->subject('Tu resumen semanal - ' . $appName)
            ->view('emails.weekly-stats', [
                'userName' => $userName,
                'landingName' => $landingName,
                'totalViews' => $totalViews,
                'totalClicks' => $totalClicks,
                'viewsChange' => $viewsChange,
                'clicksChange' => $clicksChange,
                'viewsSparkline' => $viewsSparkline,
                'clicksSparkline' => $clicksSparkline,
                'topLinks' => $topLinks,
                'weekStart' => $weekStart,
                'weekEnd' => $weekEnd,
                'headerImage' => 'images/emails/linky_stats.png',
                'headerTitle' => 'Tu Resumen Semanal',
                'headerSubtitle' => 'Estadísticas de tu Linkea',
            ]);
    }

    /**
     * Build change indicator string.
     */
    protected function buildChangeIndicator(int|float $change): string
    {
        if ($change > 0) {
            return '+' . $change . '% vs semana anterior';
        } elseif ($change < 0) {
            return $change . '% vs semana anterior';
        }
        return 'Sin cambios';
    }

    /**
     * Build top links HTML section.
     */
    protected function buildTopLinksHtml(array $topLinks): string
    {
        if (empty($topLinks)) {
            return '';
        }

        $linksRows = '';
        foreach (array_slice($topLinks, 0, 5) as $index => $link) {
            $position = $index + 1;
            $title = htmlspecialchars($link['title'] ?? 'Sin titulo');
            $clicks = $link['clicks'] ?? 0;
            $linksRows .= <<<HTML
<tr>
    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
        <span style="display: inline-block; width: 24px; height: 24px; background: #f97316; color: white; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; font-weight: 600; margin-right: 10px;">{$position}</span>
        <span style="color: #1e293b; font-size: 14px;">{$title}</span>
    </td>
    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">
        <span style="color: #059669; font-weight: 600;">{$clicks}</span>
        <span style="color: #64748b; font-size: 12px;"> clics</span>
    </td>
</tr>
HTML;
        }

        return <<<HTML
<div style="margin: 20px 0;">
    <h3 style="color: #1e293b; font-size: 16px; margin: 0 0 12px;">Top enlaces de la semana</h3>
    <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8fafc; border-radius: 8px; padding: 8px 16px;">
        {$linksRows}
    </table>
</div>
HTML;
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'weekly_stats',
            'stats' => $this->stats,
        ];
    }

    /**
     * Generate stats for a user.
     * Helper method to build stats array from user data.
     */
    public static function generateStatsForUser(User $user): array
    {
        $landing = $user->landings()->first();

        if (!$landing) {
            return self::getEmptyStats();
        }

        $now = Carbon::now();
        $weekAgo = $now->copy()->subWeek();
        $twoWeeksAgo = $now->copy()->subWeeks(2);

        // Get stats from landing_statistics (current week) - only views
        $currentWeekStats = $landing->statistics()
            ->where('date', '>=', $weekAgo)
            ->where('date', '<=', $now)
            ->get();

        // Get stats from landing_statistics (previous week)
        $previousWeekStats = $landing->statistics()
            ->where('date', '>=', $twoWeeksAgo)
            ->where('date', '<', $weekAgo)
            ->get();

        // Calculate totals - landing_statistics only has views
        $totalViews = $currentWeekStats->sum('views');
        $previousViews = $previousWeekStats->sum('views');

        // Calculate clicks from link_statistics
        $totalClicks = $landing->links()
            ->whereHas('statistics', function ($query) use ($weekAgo, $now) {
                $query->where('date', '>=', $weekAgo)
                    ->where('date', '<=', $now);
            })
            ->with(['statistics' => function ($query) use ($weekAgo, $now) {
                $query->where('date', '>=', $weekAgo)->where('date', '<=', $now);
            }])
            ->get()
            ->sum(function ($link) {
                return $link->statistics->sum('visits'); // Field is 'visits' not 'clicks'
            });

        $previousClicks = $landing->links()
            ->whereHas('statistics', function ($query) use ($twoWeeksAgo, $weekAgo) {
                $query->where('date', '>=', $twoWeeksAgo)
                    ->where('date', '<', $weekAgo);
            })
            ->with(['statistics' => function ($query) use ($twoWeeksAgo, $weekAgo) {
                $query->where('date', '>=', $twoWeeksAgo)->where('date', '<', $weekAgo);
            }])
            ->get()
            ->sum(function ($link) {
                return $link->statistics->sum('visits');
            });

        // If no statistics data, fallback to link visited counts
        if ($totalViews === 0 && $totalClicks === 0) {
            $totalClicks = $landing->links()->sum('visited');
            $totalViews = (int)($totalClicks * 2.5); // Estimate
        }

        // Calculate percentage changes
        $viewsChange = $previousViews > 0
            ? round((($totalViews - $previousViews) / $previousViews) * 100, 1)
            : ($totalViews > 0 ? 100 : 0);

        $clicksChange = $previousClicks > 0
            ? round((($totalClicks - $previousClicks) / $previousClicks) * 100, 1)
            : ($totalClicks > 0 ? 100 : 0);

        // Get top links by visits (from link_statistics for current week)
        $topLinks = $landing->links()
            ->where('state', true)
            ->whereHas('statistics', function ($query) use ($weekAgo, $now) {
                $query->where('date', '>=', $weekAgo)
                    ->where('date', '<=', $now);
            })
            ->with(['statistics' => function ($query) use ($weekAgo, $now) {
                $query->where('date', '>=', $weekAgo)
                    ->where('date', '<=', $now)
                    ->orderBy('date', 'asc');
            }])
            ->get()
            ->map(function ($link) {
                $weeklyClicks = $link->statistics->sum('visits'); // Field is 'visits' not 'clicks'
                return [
                    'title' => $link->text ?: 'Sin título',
                    'clicks' => $weeklyClicks,
                    'sparkline' => self::generateSparklineData($link->statistics),
                ];
            })
            ->sortByDesc('clicks')
            ->take(5)
            ->values()
            ->toArray();

        // If no link statistics, use total visited count
        if (empty($topLinks)) {
            $topLinks = $landing->links()
                ->where('state', true)
                ->where('visited', '>', 0)
                ->orderByDesc('visited')
                ->limit(5)
                ->get()
                ->map(fn($link) => [
                    'title' => $link->text ?: 'Sin título',
                    'clicks' => $link->visited,
                    'sparkline' => [], // No historical data
                ])
                ->toArray();
        }

        // Generate 7-day sparkline data for views and clicks
        $viewsSparkline = self::generateWeekSparklineData($currentWeekStats, 'views', $weekAgo, $now);
        $clicksSparkline = self::generateWeekSparklineData($currentWeekStats, 'clicks', $weekAgo, $now);

        return [
            'user_name' => $user->first_name ?: 'Usuario',
            'landing_name' => $landing->name,
            'landing_url' => config('app.url') . '/' . ($landing->domain_name ?: $landing->slug),
            'total_views' => $totalViews,
            'total_clicks' => $totalClicks,
            'views_change' => $viewsChange,
            'clicks_change' => $clicksChange,
            'views_sparkline' => $viewsSparkline,
            'clicks_sparkline' => $clicksSparkline,
            'top_links' => $topLinks,
            'week_start' => $weekAgo->format('d/m'),
            'week_end' => $now->format('d/m'),
        ];
    }

    /**
     * Get empty stats structure.
     */
    protected static function getEmptyStats(): array
    {
        $now = Carbon::now();
        $weekAgo = $now->copy()->subWeek();

        return [
            'user_name' => 'Usuario',
            'landing_name' => '',
            'landing_url' => '',
            'total_views' => 0,
            'total_clicks' => 0,
            'views_change' => 0,
            'clicks_change' => 0,
            'views_sparkline' => array_fill(0, 7, 0),
            'clicks_sparkline' => array_fill(0, 7, 0),
            'top_links' => [],
            'week_start' => $weekAgo->format('d/m'),
            'week_end' => $now->format('d/m'),
        ];
    }

    /**
     * Generate sparkline data for a link (array of daily values).
     */
    protected static function generateSparklineData($statistics): array
    {
        return $statistics
            ->pluck('visits') // Field is 'visits' not 'clicks'
            ->map(fn($value) => (int)$value)
            ->toArray();
    }

    /**
     * Generate 7-day sparkline data from statistics.
     * Fills missing days with 0.
     */
    protected static function generateWeekSparklineData($statistics, string $field, Carbon $start, Carbon $end): array
    {
        $data = [];

        // Create map of date => value
        $statsMap = $statistics->keyBy(fn($stat) => Carbon::parse($stat->date)->format('Y-m-d'));

        // Fill 7 days
        for ($i = 0; $i < 7; $i++) {
            $date = $start->copy()->addDays($i);
            $dateKey = $date->format('Y-m-d');
            $data[] = isset($statsMap[$dateKey]) ? (int)$statsMap[$dateKey]->{$field} : 0;
        }

        return $data;
    }
}
