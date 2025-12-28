<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Services\SenderNetService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

/**
 * Command to export users to Sender.net.
 * 
 * This command syncs existing users to Sender.net, handling duplicates
 * automatically by checking existing subscribers first.
 * 
 * Usage examples:
 *   php artisan sendernet:export-users
 *   php artisan sendernet:export-users --verified-only
 *   php artisan sendernet:export-users --force
 *   php artisan sendernet:export-users --dry-run
 */
class ExportUsersToSenderNet extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sendernet:export-users
                            {--verified-only : Only export verified users}
                            {--force : Force export even in local environment}
                            {--dry-run : Show what would be exported without actually exporting}
                            {--limit= : Limit the number of users to export}
                            {--offset= : Start from a specific offset}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Export users from the system to Sender.net, handling duplicates automatically';

    /**
     * Execute the console command.
     */
    public function handle(SenderNetService $senderNetService): int
    {
        $this->info('🚀 Starting Sender.net user export...');
        $this->newLine();

        // Check if force enabled for local environment
        if ($this->option('force')) {
            $senderNetService->forceEnable();
            $this->warn('⚠️  Force mode enabled - will export even in local environment');
        }

        // Check if dry run
        $isDryRun = $this->option('dry-run');
        if ($isDryRun) {
            $this->warn('📋 Dry run mode - no actual exports will be made');
        }

        // Check token configuration
        if (!config('services.sendernet.api_token')) {
            $this->error('❌ SENDERNET_API_TOKEN is not configured in .env');
            return Command::FAILURE;
        }

        // Build query
        $query = User::query();

        if ($this->option('verified-only')) {
            $query->whereNotNull('verified_at');
            $this->info('📧 Filtering: Only verified users');
        }

        if ($offset = $this->option('offset')) {
            $query->skip((int) $offset);
            $this->info("⏭️  Starting from offset: {$offset}");
        }

        if ($limit = $this->option('limit')) {
            $query->take((int) $limit);
            $this->info("🔢 Limit: {$limit} users");
        }

        $users = $query->get();
        $total = $users->count();

        $this->info("📊 Found {$total} users to process");
        $this->newLine();

        if ($total === 0) {
            $this->warn('No users to export.');
            return Command::SUCCESS;
        }

        // Confirm before proceeding
        if (!$isDryRun && !$this->option('force')) {
            if (!$this->confirm("Do you want to proceed with exporting {$total} users to Sender.net?")) {
                $this->info('Export cancelled.');
                return Command::SUCCESS;
            }
        }

        if ($isDryRun) {
            return $this->performDryRun($users, $senderNetService);
        }

        return $this->performExport($users, $senderNetService);
    }

    /**
     * Perform a dry run showing what would be exported.
     */
    protected function performDryRun($users, SenderNetService $senderNetService): int
    {
        $this->info('Checking existing subscribers in Sender.net...');

        // Force enable to fetch existing emails
        $senderNetService->forceEnable();
        $existingEmails = $senderNetService->getAllSubscriberEmails();

        $this->info("Found {$existingEmails->count()} existing subscribers in Sender.net");
        $this->newLine();

        $table = [];
        $newCount = 0;
        $existsCount = 0;

        foreach ($users as $user) {
            $exists = $existingEmails->contains(strtolower($user->email));
            $status = $exists ? '⏭️  Exists' : '✨ New';

            if ($exists) {
                $existsCount++;
            } else {
                $newCount++;
            }

            // Get linkea handle
            $handle = $user->landings()->first()?->slug ?? '-';

            $table[] = [
                $user->id,
                $user->email,
                $handle,
                $user->verified_at ? '✅' : '❌',
                $status,
            ];
        }

        $this->table(
            ['ID', 'Email', 'Handle', 'Verified', 'Status'],
            $table
        );

        $this->newLine();
        $this->info("📊 Summary:");
        $this->line("   • Would add: {$newCount} new subscribers");
        $this->line("   • Would skip: {$existsCount} existing subscribers");

        return Command::SUCCESS;
    }

    /**
     * Perform the actual export.
     */
    protected function performExport($users, SenderNetService $senderNetService): int
    {
        $progressCallback = function ($status, $user, $message) {
            $emoji = match ($status) {
                'synced' => '✅',
                'updated' => '🔄',
                'exists' => '⏭️',
                'skipped' => '⏭️',
                'failed' => '❌',
                default => '•',
            };

            $this->line("   {$emoji} {$user->email}: {$message}");
        };

        $this->info('Starting export...');
        $this->newLine();

        $stats = $senderNetService->syncUsers(
            $users,
            $this->option('verified-only'),
            $progressCallback
        );

        $this->newLine();
        $this->info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->info('📊 Export Summary:');
        $this->line("   • Total processed: {$stats['total']}");
        $this->line("   • Successfully synced (new): {$stats['synced']}");
        $this->line("   • Updated existing: {$stats['updated']}");
        $this->line("   • Skipped: {$stats['skipped']}");
        $this->line("   • Failed: {$stats['failed']}");
        $this->info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        // Log the export
        Log::info('Sender.net export completed', $stats);

        if ($stats['failed'] > 0) {
            $this->warn('⚠️  Some users failed to export. Check logs for details.');
            return Command::FAILURE;
        }

        $this->info('✅ Export completed successfully!');
        return Command::SUCCESS;
    }
}
