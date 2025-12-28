<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Services\SenderNetService;
use Illuminate\Console\Command;

class FixSenderNetUsers extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'sendernet:fix-users
                            {--force : Force execution even in local environment}
                            {--limit=100 : Process users in chunks}';

    /**
     * The console command description.
     */
    protected $description = 'Fix existing Sender.net subscribers: sync names and set status to ACTIVE';

    /**
     * Execute the console command.
     */
    public function handle(SenderNetService $senderNetService): int
    {
        $this->info('🔧 Fixing Sender.net names and status...');

        if ($this->option('force')) {
            $senderNetService->forceEnable();
            $this->warn('⚠️  Force mode enabled');
        }

        if (!$senderNetService->isEnabled()) {
            $this->error('❌ Sender.net integration is disabled.');
            return Command::FAILURE;
        }

        // Get count of users
        $totalUsers = User::count();
        $this->info("Found {$totalUsers} users in database.");

        $bar = $this->output->createProgressBar($totalUsers);
        $bar->start();

        User::chunk($this->option('limit'), function ($users) use ($senderNetService, $bar) {
            foreach ($users as $user) {
                // Determine tags
                $tags = $senderNetService->buildTagsForUser($user);

                // Update subscriber (this will fix names and set status relative to ACTIVE)
                // We pass the tags so they get updated as well
                $senderNetService->updateSubscriber($user, [], $tags);

                // Sleep to avoid rate limits (429) - 0.5s
                usleep(500000); // 500ms
                $bar->advance();
            }
        });

        $bar->finish();
        $this->newLine();
        $this->info('✅ All users processed.');

        return Command::SUCCESS;
    }
}
