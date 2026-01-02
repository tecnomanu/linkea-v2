<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Notifications\WeeklyStatsReport;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

/**
 * Send weekly stats report to all active users.
 * Scheduled to run every Monday at 9:00 AM.
 */
class SendWeeklyStatsReports extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'stats:send-weekly-reports
                            {--limit= : Limit the number of users to process}
                            {--dry-run : Display users that would receive email without sending}';

    /**
     * The console command description.
     */
    protected $description = 'Send weekly statistics report to all active users with landings';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('🚀 Starting weekly stats report generation...');
        $startTime = microtime(true);

        // Get all verified users with at least one landing
        $query = User::whereNotNull('verified_at')
            ->whereHas('landings')
            ->with('landings.links');

        // Apply limit if specified
        if ($limit = $this->option('limit')) {
            $query->limit((int) $limit);
        }

        $users = $query->get();

        if ($users->isEmpty()) {
            $this->warn('⚠️  No users found with landings.');
            return self::SUCCESS;
        }

        $this->info("📊 Found {$users->count()} users to process");

        $progressBar = $this->output->createProgressBar($users->count());
        $progressBar->start();

        $sent = 0;
        $skipped = 0;
        $failed = 0;

        foreach ($users as $user) {
            try {
                // Generate stats for this user
                $stats = WeeklyStatsReport::generateStatsForUser($user);

                // Skip if user has no activity
                if ($stats['total_views'] === 0 && $stats['total_clicks'] === 0) {
                    $skipped++;
                    $progressBar->advance();
                    continue;
                }

                if ($this->option('dry-run')) {
                    $this->newLine();
                    $this->line("  Would send to: {$user->email}");
                    $this->line("    - Views: {$stats['total_views']}");
                    $this->line("    - Clicks: {$stats['total_clicks']}");
                    $this->line("    - Top Links: " . count($stats['top_links']));
                    $sent++;
                } else {
                    // Send notification
                    $user->notify(new WeeklyStatsReport($stats));
                    $sent++;

                    Log::info('Weekly stats report sent', [
                        'user_id' => $user->id,
                        'email' => $user->email,
                        'stats' => $stats,
                    ]);
                }
            } catch (\Exception $e) {
                $failed++;
                Log::error('Failed to send weekly stats report', [
                    'user_id' => $user->id,
                    'email' => $user->email,
                    'error' => $e->getMessage(),
                ]);
            }

            $progressBar->advance();
        }

        $progressBar->finish();
        $this->newLine(2);

        // Summary
        $duration = round(microtime(true) - $startTime, 2);
        $mode = $this->option('dry-run') ? '(DRY RUN) ' : '';

        $this->info("✅ {$mode}Weekly stats reports completed in {$duration}s");
        $this->table(
            ['Status', 'Count'],
            [
                ['Sent', $sent],
                ['Skipped (no activity)', $skipped],
                ['Failed', $failed],
                ['Total', $users->count()],
            ]
        );

        if ($failed > 0) {
            $this->warn("⚠️  {$failed} emails failed to send. Check logs for details.");
            return self::FAILURE;
        }

        return self::SUCCESS;
    }
}

