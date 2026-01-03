<?php

namespace App\Console\Commands;

use App\Constants\UserRoles;
use App\Models\Role;
use App\Models\User;
use Illuminate\Console\Command;

/**
 * Fix users who were incorrectly assigned 'admin' role during registration.
 * 
 * This command corrects a critical bug where new users were assigned 'admin' role
 * instead of 'user' role during the registration process.
 * 
 * CRITICAL: Only fixes users who:
 * 1. Are NOT the owner of their company (owner should remain admin)
 * 2. Currently have 'admin' role
 * 3. Are regular users who shouldn't have admin privileges
 */
class FixUserRoles extends Command
{
    protected $signature = 'fix:user-roles 
                            {--dry-run : Show what would be changed without actually changing it}
                            {--force : Skip confirmation prompt}';

    protected $description = 'Fix users incorrectly assigned admin role during registration';

    public function handle(): int
    {
        $dryRun = $this->option('dry-run');
        
        if (!$dryRun && !$this->option('force')) {
            if (!$this->confirm('⚠️  This will change user roles. Continue?')) {
                $this->info('Operation cancelled.');
                return 0;
            }
        }

        $this->info('🔍 Searching for users with incorrect admin role...');

        $adminRole = Role::where('type', UserRoles::ADMIN)->first();
        $userRole = Role::where('type', UserRoles::USER)->first();
        $rootRole = Role::where('type', UserRoles::ROOT)->first();

        if (!$adminRole || !$userRole) {
            $this->error('❌ Required roles not found in database. Run: php artisan db:seed --class=RoleSeeder');
            return 1;
        }

        // Get all users with admin role
        $adminUsers = User::with(['company', 'roles'])
            ->whereHas('roles', function ($query) use ($adminRole) {
                $query->where('roles.id', $adminRole->id);
            })
            ->get();

        $toFix = [];
        $toKeep = [];

        foreach ($adminUsers as $user) {
            // Skip if user has ROOT role (they should keep admin too)
            if ($user->roles->contains('id', $rootRole?->id)) {
                $toKeep[] = [
                    'name' => $user->text,
                    'email' => $user->email,
                    'reason' => 'ROOT user'
                ];
                continue;
            }

            // Keep admin if user is company owner
            if ($user->company && $user->company->owner_id === $user->id) {
                $toKeep[] = [
                    'name' => $user->text,
                    'email' => $user->email,
                    'reason' => 'Company owner'
                ];
                continue;
            }

            // Otherwise, should be downgraded to 'user' role
            $toFix[] = $user;
        }

        // Display summary
        $this->newLine();
        $this->info("📊 Summary:");
        $this->line("   Total admin users: " . $adminUsers->count());
        $this->line("   To keep as admin: " . count($toKeep));
        $this->line("   To fix (downgrade to user): " . count($toFix));

        if (count($toKeep) > 0) {
            $this->newLine();
            $this->info("✅ Users keeping admin role:");
            $this->table(
                ['Name', 'Email', 'Reason'],
                array_map(fn($u) => [$u['name'], $u['email'], $u['reason']], $toKeep)
            );
        }

        if (count($toFix) === 0) {
            $this->newLine();
            $this->info('✅ No users to fix. All admin assignments are correct!');
            return 0;
        }

        $this->newLine();
        $this->warn("⚠️  Users to be changed from 'admin' to 'user':");
        $fixTable = array_map(function ($user) {
            return [
                $user->text,
                $user->email,
                $user->company ? $user->company->name : 'No company',
                $user->created_at->diffForHumans(),
            ];
        }, $toFix);

        $this->table(['Name', 'Email', 'Company', 'Registered'], $fixTable);

        if ($dryRun) {
            $this->newLine();
            $this->info('🔍 DRY RUN - No changes made');
            $this->info('Run without --dry-run to apply changes');
            return 0;
        }

        // Apply fixes
        $this->newLine();
        $this->info('🔧 Applying fixes...');
        
        $progressBar = $this->output->createProgressBar(count($toFix));
        $progressBar->start();

        $fixed = 0;
        foreach ($toFix as $user) {
            try {
                // Remove admin role
                $user->roles()->detach($adminRole->id);
                
                // Add user role if not already present
                if (!$user->roles->contains('id', $userRole->id)) {
                    $user->roles()->attach($userRole->id);
                }

                $fixed++;
            } catch (\Exception $e) {
                $this->newLine();
                $this->error("Failed to fix user {$user->email}: {$e->getMessage()}");
            }

            $progressBar->advance();
        }

        $progressBar->finish();
        $this->newLine(2);

        $this->info("✅ Fixed $fixed users successfully!");
        $this->info('🎉 All user roles are now correct.');

        return 0;
    }
}

