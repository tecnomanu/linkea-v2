<?php

namespace App\Console\Commands;

use App\Models\Company;
use App\Models\Landing;
use App\Models\Link;
use App\Models\Membership;
use App\Models\Newsletter;
use App\Models\Role;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class ImportMongoData extends Command
{
    protected $signature = 'import:mongo
        {--path=storage/mongo_import : Path to JSON files extracted from MongoDB}
        {--fresh : Clear all existing data before import}
        {--dry-run : Preview what would be imported without making changes}';

    protected $description = 'Import data from MongoDB JSON exports to MySQL/SQLite';

    private array $idMap = [
        'users' => [],
        'companies' => [],
        'landings' => [],
        'links' => [],
        'memberships' => [],
        'roles' => [],
        'newsletters' => [],
    ];

    private array $stats = [
        'users' => ['imported' => 0, 'skipped' => 0, 'soft_deleted' => 0],
        'companies' => ['imported' => 0, 'skipped' => 0, 'soft_deleted' => 0],
        'landings' => ['imported' => 0, 'skipped' => 0, 'soft_deleted' => 0],
        'links' => ['imported' => 0, 'skipped' => 0, 'soft_deleted' => 0],
        'memberships' => ['imported' => 0, 'skipped' => 0],
        'newsletters' => ['imported' => 0, 'skipped' => 0],
        'newsletter_users' => ['imported' => 0, 'skipped' => 0],
    ];

    public function handle(): int
    {
        $path = base_path($this->option('path'));
        $fresh = $this->option('fresh');
        $dryRun = $this->option('dry-run');

        if (!is_dir($path)) {
            $this->error("Directory not found: {$path}");
            $this->info("Run the parse_mongo_archive.py script first to extract MongoDB data.");
            return self::FAILURE;
        }

        $this->info("Importing MongoDB data from: {$path}");

        if ($dryRun) {
            $this->warn("DRY RUN MODE - No changes will be made");
        }

        if ($fresh && !$dryRun) {
            if ($this->confirm('This will delete ALL existing data. Are you sure?', false)) {
                $this->clearExistingData();
            } else {
                return self::FAILURE;
            }
        }

        DB::beginTransaction();

        try {
            // Seed roles first (required for user role assignments)
            $this->seedRoles($dryRun);

            // Import in dependency order
            $this->importMemberships($path, $dryRun);
            $this->importUsers($path, $dryRun);
            $this->importCompanies($path, $dryRun);
            $this->importLandings($path, $dryRun);
            $this->importLinks($path, $dryRun);
            $this->importNewsletters($path, $dryRun);
            $this->importNewsletterUsers($path, $dryRun);

            if ($dryRun) {
                DB::rollBack();
                $this->info("Dry run completed - changes rolled back");
            } else {
                DB::commit();
                $this->info("Import completed successfully!");
            }

            $this->printSummary();

            return self::SUCCESS;
        } catch (\Exception $e) {
            DB::rollBack();
            $this->error("Import failed: " . $e->getMessage());
            $this->error($e->getTraceAsString());
            return self::FAILURE;
        }
    }

    private function clearExistingData(): void
    {
        $this->warn("Clearing existing data...");

        // Disable foreign key checks temporarily
        DB::statement('PRAGMA foreign_keys = OFF');

        Link::query()->forceDelete();
        Landing::query()->forceDelete();
        Company::query()->forceDelete();
        User::query()->forceDelete();
        Membership::query()->forceDelete();

        DB::statement('PRAGMA foreign_keys = ON');

        $this->info("Existing data cleared.");
    }

    private function seedRoles(bool $dryRun): void
    {
        $this->info("Seeding roles...");

        $roles = [
            ['name' => 'Root', 'type' => 'root'],
            ['name' => 'Admin', 'type' => 'admin'],
            ['name' => 'Usuario', 'type' => 'user'],
            ['name' => 'Proveedor', 'type' => 'provider'],
        ];

        foreach ($roles as $roleData) {
            $role = Role::firstOrCreate(
                ['type' => $roleData['type']],
                ['name' => $roleData['name']]
            );
            $this->idMap['roles'][$roleData['type']] = $role->id;
        }

        $this->info("  Created/verified " . count($roles) . " roles");
    }

    private function importMemberships(string $path, bool $dryRun): void
    {
        $file = "{$path}/memberships.json";
        if (!file_exists($file)) {
            $this->warn("No memberships.json found, skipping...");
            return;
        }

        $data = json_decode(file_get_contents($file), true);
        $this->info("Importing " . count($data) . " memberships...");

        $bar = $this->output->createProgressBar(count($data));

        foreach ($data as $item) {
            $mongoId = $item['_id'];

            // Check if already exists
            $existing = Membership::where('mongo_id', $mongoId)->first();
            if ($existing) {
                $this->idMap['memberships'][$mongoId] = $existing->id;
                $this->stats['memberships']['skipped']++;
                $bar->advance();
                continue;
            }

            $membership = new Membership([
                'name' => $item['name'],
                'type' => $item['type'],
                'mongo_id' => $mongoId,
            ]);

            if (!$dryRun) {
                $membership->save();
            } else {
                // Generate a temporary UUID for dry-run ID mapping
                $membership->id = \Illuminate\Support\Str::uuid()->toString();
            }

            $this->idMap['memberships'][$mongoId] = $membership->id;
            $this->stats['memberships']['imported']++;
            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
    }

    private function importUsers(string $path, bool $dryRun): void
    {
        $file = "{$path}/users.json";
        if (!file_exists($file)) {
            $this->error("users.json not found!");
            return;
        }

        $data = json_decode(file_get_contents($file), true);
        $this->info("Importing " . count($data) . " users...");

        // Map legacy MongoDB role_ids to role types
        // These IDs were found in the MongoDB dump
        $legacyRoleMap = [
            '60e60c8632bff4267d1c4792' => 'root',   // root_linkea
            '60e60c8632bff4267d1c4793' => 'user',   // regular users
        ];

        $bar = $this->output->createProgressBar(count($data));

        foreach ($data as $item) {
            $mongoId = $item['_id'];

            // Check if already exists by mongo_id or email
            $existing = User::where('mongo_id', $mongoId)
                ->orWhere('email', $item['email'])
                ->first();

            if ($existing) {
                $this->idMap['users'][$mongoId] = $existing->id;
                $this->stats['users']['skipped']++;
                $bar->advance();
                continue;
            }

            // Ensure settings and capability are proper arrays for JSON casting
            $settings = $item['settings'] ?? null;
            if (!is_array($settings) && !is_null($settings)) {
                $settings = null;
            }

            $capability = $item['capability'] ?? null;
            if (!is_array($capability) && !is_null($capability)) {
                $capability = null;
            }

            // Handle avatar - can be string URL or object with image/thumb
            $avatar = $item['avatar'] ?? null;
            if (is_array($avatar)) {
                // Convert to string - use the main image path
                $avatar = $avatar['image'] ?? $avatar['thumb'] ?? null;
            }

            $firstName = $item['first_name'] ?? '';
            $lastName = $item['last_name'] ?? '';
            $name = trim("{$firstName} {$lastName}");
            if (empty($name)) {
                $name = $item['username'] ?? $item['email'];
            }



            $user = new User([
                'name' => $name,
                'first_name' => $firstName ?: null,
                'last_name' => $lastName ?: null,
                'email' => $item['email'],
                'password' => $item['password'] ?? Hash::make('changeme123'),
                'avatar' => $avatar,
                'settings' => $settings,
                'capability' => $capability,
                'mautic_id' => isset($item['mautic_id']) ? (string) $item['mautic_id'] : null,
                'verification_code' => isset($item['verification_code']) ? (string) $item['verification_code'] : null,
                'verified_at' => $this->parseDate($item['verified_at'] ?? null),
                'mongo_id' => $mongoId,
            ]);

            // Handle timestamps
            if (isset($item['created_at'])) {
                $user->created_at = $this->parseDate($item['created_at']);
            }
            if (isset($item['updated_at'])) {
                $user->updated_at = $this->parseDate($item['updated_at']);
            }
            if (isset($item['deleted_at'])) {
                $user->deleted_at = $this->parseDate($item['deleted_at']);
                $this->stats['users']['soft_deleted']++;
            }

            if (!$dryRun) {
                $user->save();

                // Determine role from legacy role_id
                $roleType = 'user'; // default
                $roleIds = $item['role_id'] ?? [];
                if (is_array($roleIds)) {
                    foreach ($roleIds as $legacyRoleId) {
                        if (is_string($legacyRoleId) && isset($legacyRoleMap[$legacyRoleId])) {
                            $roleType = $legacyRoleMap[$legacyRoleId];
                            break;
                        }
                    }
                }

                // Attach the correct role
                $role = Role::where('type', $roleType)->first();
                if ($role) {
                    $user->roles()->attach($role->id);
                }
            } else {
                $user->id = \Illuminate\Support\Str::uuid()->toString();
            }

            $this->idMap['users'][$mongoId] = $user->id;
            $this->stats['users']['imported']++;
            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
    }

    private function importCompanies(string $path, bool $dryRun): void
    {
        $file = "{$path}/companies.json";
        if (!file_exists($file)) {
            $this->error("companies.json not found!");
            return;
        }

        $data = json_decode(file_get_contents($file), true);
        $this->info("Importing " . count($data) . " companies...");

        $bar = $this->output->createProgressBar(count($data));

        foreach ($data as $item) {
            $mongoId = $item['_id'];

            // Check if already exists
            $existing = Company::where('mongo_id', $mongoId)->first();
            if ($existing) {
                $this->idMap['companies'][$mongoId] = $existing->id;
                $this->stats['companies']['skipped']++;
                $bar->advance();
                continue;
            }

            $ownerId = null;
            if (isset($item['owner_id']) && isset($this->idMap['users'][$item['owner_id']])) {
                $ownerId = $this->idMap['users'][$item['owner_id']];
            }

            $membershipId = null;
            if (isset($item['membership_id']) && isset($this->idMap['memberships'][$item['membership_id']])) {
                $membershipId = $this->idMap['memberships'][$item['membership_id']];
            }



            $company = new Company([
                'name' => $item['name'],
                'owner_id' => $ownerId,
                'membership_id' => $membershipId,
                'mongo_id' => $mongoId,
            ]);

            if (isset($item['created_at'])) {
                $company->created_at = $this->parseDate($item['created_at']);
            }
            if (isset($item['updated_at'])) {
                $company->updated_at = $this->parseDate($item['updated_at']);
            }
            if (isset($item['deleted_at'])) {
                $company->deleted_at = $this->parseDate($item['deleted_at']);
                $this->stats['companies']['soft_deleted']++;
            }

            if (!$dryRun) {
                $company->save();
            } else {
                $company->id = \Illuminate\Support\Str::uuid()->toString();
            }

            $this->idMap['companies'][$mongoId] = $company->id;
            $this->stats['companies']['imported']++;
            $bar->advance();
        }

        // Update users with their company_id (second pass)
        if (!$dryRun) {
            $usersData = json_decode(file_get_contents("{$path}/users.json"), true);
            foreach ($usersData as $userData) {
                if (isset($userData['company_id']) && isset($this->idMap['companies'][$userData['company_id']])) {
                    $userId = $this->idMap['users'][$userData['_id']] ?? null;
                    if ($userId) {
                        User::where('id', $userId)->update([
                            'company_id' => $this->idMap['companies'][$userData['company_id']]
                        ]);
                    }
                }
            }
        }

        $bar->finish();
        $this->newLine();
    }

    private function importLandings(string $path, bool $dryRun): void
    {
        $file = "{$path}/landings.json";
        if (!file_exists($file)) {
            $this->error("landings.json not found!");
            return;
        }

        $data = json_decode(file_get_contents($file), true);
        $this->info("Importing " . count($data) . " landings...");

        // Load users data to find user_id for landings
        $usersData = json_decode(file_get_contents("{$path}/users.json"), true);
        $userByCompany = [];
        foreach ($usersData as $u) {
            if (isset($u['company_id'])) {
                $userByCompany[$u['company_id']] = $u['_id'];
            }
        }

        $bar = $this->output->createProgressBar(count($data));

        foreach ($data as $item) {
            $mongoId = $item['_id'];

            // Check if already exists
            $existing = Landing::where('mongo_id', $mongoId)->first();
            if ($existing) {
                $this->idMap['landings'][$mongoId] = $existing->id;
                $this->stats['landings']['skipped']++;
                $bar->advance();
                continue;
            }

            $companyId = null;
            if (isset($item['company_id']) && isset($this->idMap['companies'][$item['company_id']])) {
                $companyId = $this->idMap['companies'][$item['company_id']];
            }

            // Determine user_id: try direct user_id first, then lookup via company
            $userId = null;
            if (isset($item['user_id']) && isset($this->idMap['users'][$item['user_id']])) {
                $userId = $this->idMap['users'][$item['user_id']];
            } elseif (isset($item['company_id']) && isset($userByCompany[$item['company_id']])) {
                $userId = $this->idMap['users'][$userByCompany[$item['company_id']]] ?? null;
            }

            if (!$userId) {
                $this->warn("\nSkipping landing {$item['name']} - no user_id found");
                $bar->advance();
                continue;
            }

            // Normalize template_config to match new frontend expectations
            $templateConfig = $item['template_config'] ?? null;

            // Handle duplicate slugs
            $slug = $item['slug'] ?? $item['domain_name'];
            if ($slug && Landing::where('slug', $slug)->exists()) {
                $slug = $slug . '_' . substr($mongoId, -6);
            }

            $landing = new Landing([
                'name' => $item['name'],
                'slug' => $slug,
                'domain_name' => $item['domain_name'] ?? $item['slug'],
                'logo' => $item['logo'] ?? null,
                'verify' => $item['verify'] ?? false,
                'company_id' => $companyId,
                'user_id' => $userId,
                'template_config' => $templateConfig,
                'options' => $item['options'] ?? null,
                'mongo_id' => $mongoId,
            ]);

            if (isset($item['created_at'])) {
                $landing->created_at = $this->parseDate($item['created_at']);
            }
            if (isset($item['updated_at'])) {
                $landing->updated_at = $this->parseDate($item['updated_at']);
            }
            if (isset($item['deleted_at'])) {
                $landing->deleted_at = $this->parseDate($item['deleted_at']);
                $this->stats['landings']['soft_deleted']++;
            }

            if (!$dryRun) {
                $landing->save();
            } else {
                $landing->id = \Illuminate\Support\Str::uuid()->toString();
            }

            $this->idMap['landings'][$mongoId] = $landing->id;
            $this->stats['landings']['imported']++;
            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
    }

    private function importLinks(string $path, bool $dryRun): void
    {
        $file = "{$path}/links.json";
        if (!file_exists($file)) {
            $this->error("links.json not found!");
            return;
        }

        $data = json_decode(file_get_contents($file), true);
        $this->info("Importing " . count($data) . " links...");

        $bar = $this->output->createProgressBar(count($data));

        foreach ($data as $item) {
            $mongoId = $item['_id'];

            // Check if already exists
            $existing = Link::where('mongo_id', $mongoId)->first();
            if ($existing) {
                $this->idMap['links'][$mongoId] = $existing->id;
                $this->stats['links']['skipped']++;
                $bar->advance();
                continue;
            }

            $landingId = null;
            if (isset($item['landing_id']) && isset($this->idMap['landings'][$item['landing_id']])) {
                $landingId = $this->idMap['landings'][$item['landing_id']];
            }

            if (!$landingId) {
                $bar->advance();
                continue;
            }

            // Normalize types from legacy to new system
            // Legacy -> New mappings (see types.ts for full list)
            $type = $item['type'] ?? null;
            $typeMap = [
                'button' => 'link',      // Standard button becomes link
                'heading' => 'header',   // Heading becomes header
                // These stay the same:
                // 'social' => 'social',
                // 'whatsapp' => 'whatsapp',
                // 'youtube' => 'youtube',
                // 'spotify' => 'spotify',
                // 'mastodon' => 'mastodon',
            ];

            // Apply mapping or default to 'link' if unknown/null
            if ($type && isset($typeMap[$type])) {
                $type = $typeMap[$type];
            } elseif (!$type) {
                $type = 'link'; // Default for missing type
            }
            // Otherwise keep original type (social, whatsapp, youtube, spotify, mastodon)

            // Handle slug - could be numeric from legacy
            $slug = $item['slug'] ?? null;
            if (is_numeric($slug)) {
                $slug = 'link_' . $slug;
            }

            $link = new Link([
                'landing_id' => $landingId,
                'text' => $item['text'] ?? null,
                'link' => $item['link'] ?? null,
                'state' => $item['state'] ?? true,
                'slug' => $slug,
                'order' => $item['order'] ?? 0,
                'type' => $type,
                'group' => $item['group'] ?? 'links',
                'icon' => $item['icon'] ?? null,
                'image' => $item['image'] ?? null,
                'options' => is_array($item['options'] ?? null) ? $item['options'] : null,
                'config' => $item['config'] ?? null,
                'visited' => $item['visited'] ?? 0,
                'mongo_id' => $mongoId,
            ]);

            if (isset($item['created_at'])) {
                $link->created_at = $this->parseDate($item['created_at']);
            }
            if (isset($item['updated_at'])) {
                $link->updated_at = $this->parseDate($item['updated_at']);
            }
            if (isset($item['deleted_at'])) {
                $link->deleted_at = $this->parseDate($item['deleted_at']);
                $this->stats['links']['soft_deleted']++;
            }

            if (!$dryRun) {
                $link->save();
            } else {
                $link->id = \Illuminate\Support\Str::uuid()->toString();
            }

            $this->idMap['links'][$mongoId] = $link->id;
            $this->stats['links']['imported']++;
            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
    }

    private function importNewsletters(string $path, bool $dryRun): void
    {
        $file = "{$path}/newsletters.json";
        if (!file_exists($file)) {
            $this->warn("No newsletters.json found, skipping...");
            return;
        }

        $data = json_decode(file_get_contents($file), true);
        $this->info("Importing " . count($data) . " newsletters...");

        $bar = $this->output->createProgressBar(count($data));

        foreach ($data as $item) {
            $mongoId = $item['_id'];

            // Check if already exists
            $existing = Newsletter::where('mongo_id', $mongoId)->first();
            if ($existing) {
                $this->idMap['newsletters'][$mongoId] = $existing->id;
                $this->stats['newsletters']['skipped']++;
                $bar->advance();
                continue;
            }

            $newsletter = new Newsletter([
                'subject' => $item['subject'] ?? '',
                'message' => $item['message'] ?? '',
                'status' => $item['status'] ?? 'draft',
                'sent' => $item['sent'] ?? false,
                'mongo_id' => $mongoId,
            ]);

            if (isset($item['created_at'])) {
                $newsletter->created_at = $this->parseDate($item['created_at']);
            }
            if (isset($item['updated_at'])) {
                $newsletter->updated_at = $this->parseDate($item['updated_at']);
            }
            if (isset($item['deleted_at'])) {
                $newsletter->deleted_at = $this->parseDate($item['deleted_at']);
            }

            if (!$dryRun) {
                $newsletter->save();
            } else {
                $newsletter->id = \Illuminate\Support\Str::uuid()->toString();
            }

            $this->idMap['newsletters'][$mongoId] = $newsletter->id;
            $this->stats['newsletters']['imported']++;
            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
    }

    private function importNewsletterUsers(string $path, bool $dryRun): void
    {
        $file = "{$path}/newsletter_users.json";
        if (!file_exists($file)) {
            $this->warn("No newsletter_users.json found, skipping...");
            return;
        }

        $data = json_decode(file_get_contents($file), true);
        $this->info("Importing " . count($data) . " newsletter_users...");

        $bar = $this->output->createProgressBar(count($data));

        foreach ($data as $item) {
            $mongoId = $item['_id'];

            $newsletterId = null;
            if (isset($item['newsletter_id']) && isset($this->idMap['newsletters'][$item['newsletter_id']])) {
                $newsletterId = $this->idMap['newsletters'][$item['newsletter_id']];
            }

            $userId = null;
            if (isset($item['user_id']) && isset($this->idMap['users'][$item['user_id']])) {
                $userId = $this->idMap['users'][$item['user_id']];
            }

            if (!$newsletterId || !$userId) {
                $bar->advance();
                continue;
            }

            // Check if pivot already exists
            $existing = \DB::table('newsletter_user')
                ->where('newsletter_id', $newsletterId)
                ->where('user_id', $userId)
                ->first();

            if ($existing) {
                $this->stats['newsletter_users']['skipped']++;
                $bar->advance();
                continue;
            }

            if (!$dryRun) {
                \DB::table('newsletter_user')->insert([
                    'id' => \Illuminate\Support\Str::uuid()->toString(),
                    'newsletter_id' => $newsletterId,
                    'user_id' => $userId,
                    'date' => $this->parseDate($item['date'] ?? null),
                    'sent' => $item['sent'] ?? true,
                    'viewed_count' => $item['viewed_count'] ?? 0,
                    'ip' => $item['ip'] ?? null,
                    'created_at' => $this->parseDate($item['created_at'] ?? null) ?? now(),
                    'updated_at' => $this->parseDate($item['updated_at'] ?? null) ?? now(),
                ]);
            }

            $this->stats['newsletter_users']['imported']++;
            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
    }

    private function parseDate($value): ?Carbon
    {
        if (!$value) {
            return null;
        }

        // Handle MongoDB date object format
        if (is_array($value) && isset($value['date'])) {
            return Carbon::parse($value['date']);
        }

        // Handle ISO date strings
        if (is_string($value)) {
            try {
                return Carbon::parse($value);
            } catch (\Exception $e) {
                return null;
            }
        }

        return null;
    }

    private function printSummary(): void
    {
        $this->newLine();
        $this->info("=== Import Summary ===");
        $headers = ['Collection', 'Imported', 'Skipped', 'Soft Deleted', 'Total'];
        $rows = [];

        foreach ($this->stats as $collection => $stats) {
            $rows[] = [
                ucfirst($collection),
                $stats['imported'],
                $stats['skipped'],
                $stats['soft_deleted'] ?? '-',
                $stats['imported'] + $stats['skipped'],
            ];
        }

        $this->table($headers, $rows);
    }
}
