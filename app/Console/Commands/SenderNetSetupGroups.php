<?php

namespace App\Console\Commands;

use App\Services\SenderNetService;
use Illuminate\Console\Command;

/**
 * Command to setup Sender.net groups.
 * Creates required groups and caches their IDs.
 */
class SenderNetSetupGroups extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'sendernet:setup-groups
                            {--force : Force setup even in local environment}
                            {--clear : Clear group cache first}';

    /**
     * The console command description.
     */
    protected $description = 'Create required Sender.net groups and cache their IDs';

    /**
     * Execute the console command.
     */
    public function handle(SenderNetService $senderNetService): int
    {
        $this->info('🚀 Setting up Sender.net groups...');
        $this->newLine();

        // Check if force enabled for local environment
        if ($this->option('force')) {
            $senderNetService->forceEnable();
            $this->warn('⚠️  Force mode enabled');
        }

        // Check token configuration
        if (!config('services.sendernet.api_token')) {
            $this->error('❌ SENDERNET_API_TOKEN is not configured in .env');
            return Command::FAILURE;
        }

        // Clear cache if requested
        if ($this->option('clear')) {
            $senderNetService->clearGroupCache();
            $this->info('🗑️  Cache cleared');
        }

        // Ensure groups exist
        $this->info('Creating/verifying groups...');
        $groups = $senderNetService->ensureGroupsExist();

        // Display results
        $this->newLine();
        $this->info('📋 Groups:');

        $table = [];
        foreach ($groups as $name => $id) {
            $status = $id ? '✅' : '❌';
            $table[] = [$name, $id ?? 'Failed', $status];
        }

        $this->table(['Group Name', 'ID', 'Status'], $table);

        // Check for failures
        $failures = array_filter($groups, fn($id) => $id === null);
        if (!empty($failures)) {
            $this->error('❌ Some groups failed to create');
            return Command::FAILURE;
        }

        $this->newLine();
        $this->info('✅ All groups are ready!');
        $this->info('   Group IDs are cached for 24 hours.');

        return Command::SUCCESS;
    }
}
