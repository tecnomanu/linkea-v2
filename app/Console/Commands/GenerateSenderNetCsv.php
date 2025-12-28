<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Services\SenderNetService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class GenerateSenderNetCsv extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'sendernet:generate-csv';

    /**
     * The console command description.
     */
    protected $description = 'Generate a CSV file for manual bulk import to Sender.net';

    /**
     * Execute the console command.
     */
    public function handle(SenderNetService $senderNetService): int
    {
        $this->info('Generate Sender.net CSV Export...');

        $users = User::all();
        $this->info("Found {$users->count()} users.");

        // Ensure groups are cached/resolved
        $senderNetService->forceEnable();
        $groups = $senderNetService->ensureGroupsExist(); // Returns [name => id]

        $usersGroupId = $groups[SenderNetService::GROUP_USERS] ?? '';

        // Header with specific columns for easier mapping
        $csvData[] = [
            'Email',
            'First Name',
            'Last Name',
            'Status',           // Subscriber status
            'Groups',          // Group IDs
            'Tags',            // Tags for segmentation
            'Verified At',     // Custom field
            'Linkea Handle',   // Custom field
            'Is Legacy'        // Custom field
        ];

        $bar = $this->output->createProgressBar($users->count());
        $bar->start();

        foreach ($users as $user) {
            // Name logic
            $firstName = $user->first_name;
            $lastName = $user->last_name;

            if (empty($firstName) && !empty($user->name)) {
                $parts = explode(' ', trim($user->name));
                if (count($parts) === 1) {
                    $firstName = $parts[0];
                } else {
                    $lastName = array_pop($parts);
                    $firstName = implode(' ', $parts);
                }
            }
            // Fallback to first_name if still empty
            if (empty($firstName) && !empty($user->first_name)) {
                $firstName = $user->first_name;
            }

            // Tags logic
            $tags = $senderNetService->buildTagsForUser($user);
            $tagString = implode(',', $tags);

            // Groups Logic - Users Group + Custom Groups
            $userGroups = [$usersGroupId];
            $groupString = implode(',', array_filter($userGroups));

            // Custom Fields Data
            $verifiedAt = $user->verified_at ? $user->verified_at->toDateTimeString() : '';
            $handle = $user->landings()->first()?->slug ?? '';
            $isLegacy = $user->mongo_id ? 'yes' : 'no';

            // Status Logic (Force Active unless unsubscribed locally? We assume ACTIVE for import)
            // Sender.net import usually asks for status mapping, but having a column helps
            $status = 'ACTIVE';

            $csvData[] = [
                $user->email,
                $firstName,
                $lastName,
                $status,
                $groupString,
                $tagString,
                $verifiedAt,
                $handle,
                $isLegacy
            ];

            $bar->advance();
        }

        $bar->finish();
        $this->newLine();

        // Write to file
        $fileName = 'sendernet_export_' . date('Y-m-d_H-i-s') . '.csv';
        $path = storage_path('app/' . $fileName);

        $fp = fopen($path, 'w');
        foreach ($csvData as $row) {
            fputcsv($fp, $row);
        }
        fclose($fp);

        $this->info('✅ CSV file generated successfully:');
        $this->line("   " . $path);

        $this->info("You can now upload this file to Sender.net > Subscribers > Import");

        return Command::SUCCESS;
    }
}
