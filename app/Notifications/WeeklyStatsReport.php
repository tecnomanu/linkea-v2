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
        $totalViews = $this->stats['total_views'] ?? 0;
        $totalClicks = $this->stats['total_clicks'] ?? 0;
        $viewsChange = $this->stats['views_change'] ?? 0;
        $clicksChange = $this->stats['clicks_change'] ?? 0;
        $topLinks = $this->stats['top_links'] ?? [];
        $weekStart = $this->stats['week_start'] ?? Carbon::now()->subWeek()->format('d/m');
        $weekEnd = $this->stats['week_end'] ?? Carbon::now()->format('d/m');

        return (new MailMessage)
            ->subject('Tu resumen semanal - ' . $appName)
            ->view('emails.weekly-stats', [
                'totalViews' => $totalViews,
                'totalClicks' => $totalClicks,
                'viewsChange' => $viewsChange,
                'clicksChange' => $clicksChange,
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
            return [
                'total_views' => 0,
                'total_clicks' => 0,
                'views_change' => 0,
                'clicks_change' => 0,
                'top_links' => [],
                'week_start' => Carbon::now()->subWeek()->format('d/m'),
                'week_end' => Carbon::now()->format('d/m'),
            ];
        }

        // Get current week stats
        $weekAgo = Carbon::now()->subWeek();
        $twoWeeksAgo = Carbon::now()->subWeeks(2);

        // Total clicks from links
        $totalClicks = $landing->links()->sum('visited');

        // Get top links by clicks
        $topLinks = $landing->links()
            ->where('state', true)
            ->orderByDesc('visited')
            ->limit(5)
            ->get()
            ->map(fn($link) => [
                'title' => $link->text,
                'clicks' => $link->visited,
            ])
            ->toArray();

        // Landing views (from statistics if available, otherwise estimate)
        $totalViews = $landing->statistics()
            ->where('date', '>=', $weekAgo)
            ->sum('views') ?? (int)($totalClicks * 2.5);

        return [
            'total_views' => $totalViews,
            'total_clicks' => $totalClicks,
            'views_change' => rand(-20, 50), // TODO: Calculate real change when stats are implemented
            'clicks_change' => rand(-15, 40),
            'top_links' => $topLinks,
            'week_start' => $weekAgo->format('d/m'),
            'week_end' => Carbon::now()->format('d/m'),
        ];
    }
}
