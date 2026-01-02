<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Notifications\WeeklyStatsReport;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

/**
 * Send weekly stats report to a specific user (for testing).
 */
class SendWeeklyStatsToUser extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'stats:send-weekly-report-to-user
                            {email : Email of the user to send the report to}
                            {--show-stats : Display stats before sending}';

    /**
     * The console command description.
     */
    protected $description = 'Send weekly stats report to a specific user (for testing)';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $email = $this->argument('email');

        // Find user
        $user = User::where('email', $email)->first();

        if (!$user) {
            $this->error("❌ User not found: {$email}");
            return self::FAILURE;
        }

        // Check if user has landings
        if ($user->landings()->count() === 0) {
            $this->warn("⚠️  User {$email} has no landings.");
            
            if (!$this->confirm('Send report anyway with zero stats?', false)) {
                return self::SUCCESS;
            }
        }

        $this->info("📊 Generating stats for: {$user->text} ({$email})");

        try {
            // Generate stats
            $stats = WeeklyStatsReport::generateStatsForUser($user);

            // Display stats if requested
            if ($this->option('show-stats')) {
                $this->newLine();
                $this->info('📈 Stats Preview:');
                $this->table(
                    ['Metric', 'Value'],
                    [
                        ['Week', "{$stats['week_start']} - {$stats['week_end']}"],
                        ['Total Views', number_format($stats['total_views'])],
                        ['Views Change', $stats['views_change'] . '%'],
                        ['Total Clicks', number_format($stats['total_clicks'])],
                        ['Clicks Change', $stats['clicks_change'] . '%'],
                        ['Top Links', count($stats['top_links'])],
                    ]
                );

                if (!empty($stats['top_links'])) {
                    $this->newLine();
                    $this->info('🔥 Top Links:');
                    $topLinksTable = collect($stats['top_links'])
                        ->take(5)
                        ->map(fn($link, $index) => [
                            '#' . ($index + 1),
                            $link['title'],
                            number_format($link['clicks']) . ' clicks',
                        ])
                        ->toArray();
                    
                    $this->table(['Rank', 'Title', 'Clicks'], $topLinksTable);
                }

                $this->newLine();
            }

            // Confirm sending
            if (!$this->confirm('Send email now?', true)) {
                $this->info('❌ Cancelled');
                return self::SUCCESS;
            }

            // Send notification
            $user->notify(new WeeklyStatsReport($stats));

            $this->newLine();
            $this->info("✅ Weekly stats report sent to {$email}");
            $this->line("📧 Check Mailpit (http://localhost:8025) if in local environment");

            Log::info('Manual weekly stats report sent', [
                'user_id' => $user->id,
                'email' => $user->email,
                'stats' => $stats,
                'triggered_by' => 'command',
            ]);

            return self::SUCCESS;
        } catch (\Exception $e) {
            $this->error("❌ Failed to send report: {$e->getMessage()}");
            
            Log::error('Failed to send manual weekly stats report', [
                'user_id' => $user->id,
                'email' => $user->email,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return self::FAILURE;
        }
    }
}

