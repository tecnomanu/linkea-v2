<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Notifications\WeeklyStatsReport;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

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
                            {--dry-run : Display users that would receive email without sending}
                            {--mailer=sender : Mailer to use (default: sender, options: log, sender)}
                            {--test-email= : Send only to this email address (for testing)}';

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

        $mailer = $this->option('mailer');
        $testEmail = $this->option('test-email');
        $isDryRun = $this->option('dry-run');

        // Display sending method
        $this->info("📧 Using mailer: {$mailer}");

        if ($testEmail) {
            $this->warn("🧪 TEST MODE: Sending only to {$testEmail}");
        }

        // Get all verified users with at least one landing
        $query = User::whereNotNull('verified_at')
            ->whereHas('landings')
            ->with('landings.links');

        // If test email is specified, find only that user
        if ($testEmail) {
            $query->where('email', $testEmail);
        }

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

                // Skip if user has no activity (unless testing)
                if (!$testEmail && $stats['total_views'] === 0 && $stats['total_clicks'] === 0) {
                    $skipped++;
                    $progressBar->advance();
                    continue;
                }

                if ($isDryRun) {
                    $this->newLine();
                    $this->line("  Would send to: {$user->email}");
                    $this->line("    - Views: {$stats['total_views']}");
                    $this->line("    - Clicks: {$stats['total_clicks']}");
                    $this->line("    - Top Links: " . count($stats['top_links']));
                    $sent++;
                } else {
                    // Send via Laravel Mail using specified mailer
                    $notification = new WeeklyStatsReport($stats);
                    $mailMessage = $notification->toMail($user);

                    // Send using the specified mailer
                    Mail::mailer($mailer)
                        ->send([], [], function ($message) use ($user, $mailMessage) {
                            $message->to($user->email, $user->first_name ?: 'Usuario')
                                ->subject($mailMessage->subject)
                                ->html($mailMessage->render());
                        });

                    $sent++;

                    Log::info('Weekly stats report sent', [
                        'user_id' => $user->id,
                        'email' => $user->email,
                        'mailer' => $mailer,
                        'stats' => $stats,
                    ]);
                }
            } catch (\Exception $e) {
                $failed++;
                $this->error("\n  Failed to send to {$user->email}: {$e->getMessage()}");
                Log::error('Failed to send weekly stats report', [
                    'user_id' => $user->id,
                    'email' => $user->email,
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                ]);
            }

            $progressBar->advance();
        }

        $progressBar->finish();
        $this->newLine(2);

        // Summary
        $duration = round(microtime(true) - $startTime, 2);
        $mode = $isDryRun ? '(DRY RUN) ' : '';

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
