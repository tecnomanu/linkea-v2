<?php

namespace App\Console\Commands;

use App\Notifications\WeeklyStatsReport;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Mail;

/**
 * Test command to send a weekly stats email using Laravel Mail.
 * Does not require database access.
 */
class TestWeeklyStatsMail extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'test:weekly-stats-mail 
                            {email : Email address to send test to}
                            {--mailer=sender : Mailer to use (log, sender, smtp)}';

    /**
     * The console command description.
     */
    protected $description = 'Test sending weekly stats email using Laravel Mail (no database required)';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $email = $this->argument('email');
        $mailer = $this->option('mailer');

        $this->info("🧪 Testing Weekly Stats Email");
        $this->info("📧 Mailer: {$mailer}");
        $this->info("📬 Sending to: {$email}");

        // Debug: Show configuration
        $this->newLine();
        $this->info("🔍 DEBUG - Configuration:");
        $this->line("  SENDER_ENABLED: " . (env('SENDER_ENABLED') ? 'true' : 'false'));
        
        $senderApiKey = env('SENDER_API_KEY');
        if ($senderApiKey) {
            $this->line("  SENDER_API_KEY: " . substr($senderApiKey, 0, 20) . "..." . substr($senderApiKey, -10));
            $this->line("  Token length: " . strlen($senderApiKey) . " chars");
        } else {
            $this->error("  SENDER_API_KEY: NOT SET!");
        }
        
        $this->line("  config('sender.api_key'): " . (config('sender.api_key') ? substr(config('sender.api_key'), 0, 20) . "..." : 'NOT SET'));
        $this->line("  config('services.sendernet.api_token'): " . (config('services.sendernet.api_token') ? substr(config('services.sendernet.api_token'), 0, 20) . "..." : 'NOT SET'));
        $this->newLine();

        try {
            // Generate mock stats data
            $stats = $this->getMockStats();

            // Create notification instance
            $notification = new WeeklyStatsReport($stats);
            
            // Get the mail message
            $mockUser = (object)[
                'email' => $email,
                'first_name' => 'Usuario Test',
            ];
            
            $mailMessage = $notification->toMail($mockUser);

            // Send using the specified mailer
            $this->info('📤 Sending email...');
            
            Mail::mailer($mailer)->send([], [], function ($message) use ($email, $mailMessage) {
                $message->to($email, 'Usuario Test')
                    ->subject($mailMessage->subject)
                    ->html($mailMessage->render());
            });

            $this->info("✅ Email sent successfully using '{$mailer}' mailer!");
            
            if ($mailer === 'log') {
                $this->info("   Check storage/logs/laravel.log for the email content");
            }
            
            return self::SUCCESS;
        } catch (\Exception $e) {
            $this->error("❌ Error: {$e->getMessage()}");
            $this->error("   Trace: " . $e->getTraceAsString());
            return self::FAILURE;
        }
    }

    /**
     * Get mock stats data for testing.
     */
    protected function getMockStats(): array
    {
        $now = Carbon::now();
        $weekAgo = $now->copy()->subWeek();

        return [
            'user_name' => 'Usuario Test',
            'landing_name' => 'Mi Linkea Test',
            'landing_url' => config('app.url') . '/test-linkea',
            'total_views' => 1234,
            'total_clicks' => 567,
            'views_change' => 15.3,
            'clicks_change' => 23.8,
            'views_sparkline' => [120, 145, 178, 156, 189, 198, 248],
            'clicks_sparkline' => [45, 67, 89, 78, 92, 87, 109],
            'top_links' => [
                [
                    'title' => 'Instagram',
                    'clicks' => 234,
                    'sparkline' => [30, 35, 38, 32, 36, 33, 30],
                ],
                [
                    'title' => 'YouTube',
                    'clicks' => 189,
                    'sparkline' => [25, 28, 30, 27, 29, 26, 24],
                ],
                [
                    'title' => 'Portfolio',
                    'clicks' => 144,
                    'sparkline' => [18, 20, 22, 19, 21, 23, 21],
                ],
                [
                    'title' => 'Contacto',
                    'clicks' => 98,
                    'sparkline' => [12, 14, 16, 13, 15, 14, 14],
                ],
                [
                    'title' => 'Blog',
                    'clicks' => 67,
                    'sparkline' => [8, 10, 11, 9, 10, 9, 10],
                ],
            ],
            'week_start' => $weekAgo->format('d/m'),
            'week_end' => $now->format('d/m'),
        ];
    }
}

