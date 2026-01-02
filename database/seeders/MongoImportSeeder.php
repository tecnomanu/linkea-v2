<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Landing;
use App\Models\Link;
use App\Models\Membership;
use App\Models\Newsletter;
use App\Models\Role;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class MongoImportSeeder extends Seeder
{
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

    public function run(): void
    {
        $path = base_path('storage/mongo_import');

        if (!is_dir($path)) {
            $this->command->error("Directory not found: {$path}");
            $this->command->info("Please ensure MongoDB JSON files are in storage/mongo_import");
            return;
        }

        $this->command->info("Starting MongoDB import from: {$path}");

        DB::beginTransaction();

        try {
            $this->seedRoles();
            $this->importMemberships($path);
            $this->importUsers($path);
            $this->importCompanies($path);
            $this->importLandings($path);
            $this->importLinks($path);
            $this->importNewsletters($path);
            $this->importNewsletterUsers($path);

            DB::commit();
            $this->command->info("MongoDB Import completed successfully!");
            $this->printSummary();
        } catch (\Exception $e) {
            DB::rollBack();
            $this->command->error("Import failed: " . $e->getMessage());
            throw $e;
        }
    }

    private function seedRoles(): void
    {
        $this->command->info("Seeding roles...");

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
    }

    private function importMemberships(string $path): void
    {
        $file = "{$path}/memberships.json";
        if (!file_exists($file)) return;

        $data = json_decode(file_get_contents($file), true);
        $this->command->info("Importing " . count($data) . " memberships...");

        foreach ($data as $item) {
            $mongoId = $item['_id'];

            $existing = Membership::where('mongo_id', $mongoId)->withTrashed()->first();
            if ($existing) {
                $this->idMap['memberships'][$mongoId] = $existing->id;
                $this->stats['memberships']['skipped']++;
                continue;
            }

            $membership = Membership::create([
                'name' => $item['name'],
                'type' => $item['type'],
                'mongo_id' => $mongoId,
            ]);

            $this->idMap['memberships'][$mongoId] = $membership->id;
            $this->stats['memberships']['imported']++;
        }
    }

    private function importUsers(string $path): void
    {
        $file = "{$path}/users.json";
        if (!file_exists($file)) return;

        $data = json_decode(file_get_contents($file), true);
        $this->command->info("Importing " . count($data) . " users...");

        $legacyRoleMap = [
            '60e60c8632bff4267d1c4792' => 'root',
            '60e60c8632bff4267d1c4793' => 'user',
        ];

        foreach ($data as $item) {
            $mongoId = $item['_id'];

            $existing = User::withTrashed()
                ->where('mongo_id', $mongoId)
                ->orWhere('email', $item['email'])
                ->first();

            if ($existing) {
                $this->idMap['users'][$mongoId] = $existing->id;
                $this->stats['users']['skipped']++;
                continue;
            }

            $settings = $item['settings'] ?? null;
            if (!is_array($settings)) $settings = null;

            $capability = $item['capability'] ?? null;
            if (!is_array($capability)) $capability = null;

            // Keep avatar as JSON object with image and thumb paths
            $avatar = $item['avatar'] ?? null;
            // If avatar is already an array with image/thumb, keep it as-is
            // The User model casts it to array and the accessor handles URL resolution

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
                'mautic_id' => isset($item['mautic_id']) ? (string)$item['mautic_id'] : null,
                'verification_code' => isset($item['verification_code']) ? (string)$item['verification_code'] : null,
                'verified_at' => $this->parseDate($item['verified_at'] ?? null),
                'mongo_id' => $mongoId,
            ]);

            if (isset($item['created_at'])) $user->created_at = $this->parseDate($item['created_at']);
            if (isset($item['updated_at'])) $user->updated_at = $this->parseDate($item['updated_at']);
            if (isset($item['deleted_at'])) {
                $user->deleted_at = $this->parseDate($item['deleted_at']);
                $this->stats['users']['soft_deleted']++;
            }

            $user->save();

            // Assign Roles
            $roleType = 'user';
            $roleIds = $item['role_id'] ?? [];
            if (is_array($roleIds)) {
                foreach ($roleIds as $legacyRoleId) {
                    if (is_string($legacyRoleId) && isset($legacyRoleMap[$legacyRoleId])) {
                        $roleType = $legacyRoleMap[$legacyRoleId];
                        break;
                    }
                }
            }
            $role = Role::where('type', $roleType)->first();
            if ($role) $user->roles()->attach($role->id);

            $this->idMap['users'][$mongoId] = $user->id;
            $this->stats['users']['imported']++;
        }
    }

    private function importCompanies(string $path): void
    {
        $file = "{$path}/companies.json";
        if (!file_exists($file)) return;

        $data = json_decode(file_get_contents($file), true);
        $this->command->info("Importing " . count($data) . " companies...");

        foreach ($data as $item) {
            $mongoId = $item['_id'];

            $existing = Company::where('mongo_id', $mongoId)->withTrashed()->first();
            if ($existing) {
                $this->idMap['companies'][$mongoId] = $existing->id;
                $this->stats['companies']['skipped']++;
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

            if (isset($item['created_at'])) $company->created_at = $this->parseDate($item['created_at']);
            if (isset($item['updated_at'])) $company->updated_at = $this->parseDate($item['updated_at']);
            if (isset($item['deleted_at'])) {
                $company->deleted_at = $this->parseDate($item['deleted_at']);
                $this->stats['companies']['soft_deleted']++;
            }

            $company->save();
            $this->idMap['companies'][$mongoId] = $company->id;
            $this->stats['companies']['imported']++;
        }

        // 2nd pass: Update users company_id
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

    private function importLandings(string $path): void
    {
        $file = "{$path}/landings.json";
        if (!file_exists($file)) return;

        $data = json_decode(file_get_contents($file), true);
        $this->command->info("Importing " . count($data) . " landings...");

        // Preload user mappings
        $usersData = json_decode(file_get_contents("{$path}/users.json"), true);
        $userByCompany = [];
        foreach ($usersData as $u) {
            if (isset($u['company_id'])) $userByCompany[$u['company_id']] = $u['_id'];
        }

        foreach ($data as $item) {
            $mongoId = $item['_id'];

            $existing = Landing::where('mongo_id', $mongoId)->withTrashed()->first();
            if ($existing) {
                $this->idMap['landings'][$mongoId] = $existing->id;
                $this->stats['landings']['skipped']++;
                continue;
            }

            $companyId = null;
            if (isset($item['company_id']) && isset($this->idMap['companies'][$item['company_id']])) {
                $companyId = $this->idMap['companies'][$item['company_id']];
            }

            $userId = null;
            if (isset($item['user_id']) && isset($this->idMap['users'][$item['user_id']])) {
                $userId = $this->idMap['users'][$item['user_id']];
            } elseif (isset($item['company_id']) && isset($userByCompany[$item['company_id']])) {
                $userId = $this->idMap['users'][$userByCompany[$item['company_id']]] ?? null;
            }

            if (!$userId) {
                continue; // Skip orphan landings
            }

            $templateConfig = $this->processLegacyTemplateConfig($item['template_config'] ?? []);

            $slug = $item['slug'] ?? $item['domain_name'];
            if ($slug && Landing::where('slug', $slug)->exists()) {
                $slug = $slug . '_' . substr($mongoId, -6);
            }

            // Truncate slug
            if ($slug && strlen($slug) > 190) {
                $slug = substr($slug, 0, 190);
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

            if (isset($item['created_at'])) $landing->created_at = $this->parseDate($item['created_at']);
            if (isset($item['updated_at'])) $landing->updated_at = $this->parseDate($item['updated_at']);
            if (isset($item['deleted_at'])) {
                $landing->deleted_at = $this->parseDate($item['deleted_at']);
                $this->stats['landings']['soft_deleted']++;
            }

            $landing->save();
            $this->idMap['landings'][$mongoId] = $landing->id;
            $this->stats['landings']['imported']++;
        }
    }

    private function importLinks(string $path): void
    {
        $file = "{$path}/links.json";
        if (!file_exists($file)) return;

        $data = json_decode(file_get_contents($file), true);
        $this->command->info("Importing " . count($data) . " links...");

        foreach ($data as $item) {
            $mongoId = $item['_id'];

            $existing = Link::where('mongo_id', $mongoId)->withTrashed()->first();
            if ($existing) {
                $this->idMap['links'][$mongoId] = $existing->id;
                $this->stats['links']['skipped']++;
                continue;
            }

            $landingId = null;
            if (isset($item['landing_id']) && isset($this->idMap['landings'][$item['landing_id']])) {
                $landingId = $this->idMap['landings'][$item['landing_id']];
            } else {
                continue;
            }

            $type = $item['type'] ?? null;
            $typeMap = ['button' => 'link', 'heading' => 'header'];
            if ($type && isset($typeMap[$type])) {
                $type = $typeMap[$type];
            } elseif (!$type) {
                $type = 'link';
            }

            $slug = $item['slug'] ?? null;
            if (is_numeric($slug)) $slug = 'link_' . $slug;
            if ($slug && strlen($slug) > 190) $slug = substr($slug, 0, 190);

            // WhatsApp Fix
            $config = $item['config'] ?? null;
            if ($type === 'whatsapp' && !empty($item['link'])) {
                if (!is_array($config)) $config = [];
                $config['phone_number'] = $item['link'];
            }

            // Truncate fields if necessary (DB protection)
            $text = $item['text'] ?? null;
            // The DB now supports TEXT (64KB), but if content is huge, we let it be 
            // as migration was updated.

            $link = new Link([
                'landing_id' => $landingId,
                'text' => $text,
                'link' => $item['link'] ?? null,
                'state' => $item['state'] ?? true,
                'slug' => $slug,
                'order' => $item['order'] ?? 0,
                'type' => $type,
                'group' => $item['group'] ?? 'links',
                'icon' => $item['icon'] ?? null,
                'image' => $item['image'] ?? null,
                'options' => is_array($item['options'] ?? null) ? $item['options'] : null,
                'config' => $config,
                'visited' => $item['visited'] ?? 0,
                'mongo_id' => $mongoId,
            ]);

            if (isset($item['created_at'])) $link->created_at = $this->parseDate($item['created_at']);
            if (isset($item['updated_at'])) $link->updated_at = $this->parseDate($item['updated_at']);
            if (isset($item['deleted_at'])) {
                $link->deleted_at = $this->parseDate($item['deleted_at']);
                $this->stats['links']['soft_deleted']++;
            }

            $link->save();
            $this->idMap['links'][$mongoId] = $link->id;
            $this->stats['links']['imported']++;
        }
    }

    private function importNewsletters(string $path): void
    {
        $file = "{$path}/newsletters.json";
        if (!file_exists($file)) return;

        $data = json_decode(file_get_contents($file), true);
        $this->command->info("Importing " . count($data) . " newsletters...");

        foreach ($data as $item) {
            $mongoId = $item['_id'];

            $existing = Newsletter::where('mongo_id', $mongoId)->withTrashed()->first();
            if ($existing) {
                $this->idMap['newsletters'][$mongoId] = $existing->id;
                $this->stats['newsletters']['skipped']++;
                continue;
            }

            $newsletter = new Newsletter([
                'subject' => $item['subject'] ?? '',
                'message' => $item['message'] ?? '',
                'status' => $item['status'] ?? 'draft',
                'sent' => $item['sent'] ?? false,
                'mongo_id' => $mongoId,
            ]);

            if (isset($item['created_at'])) $newsletter->created_at = $this->parseDate($item['created_at']);
            if (isset($item['updated_at'])) $newsletter->updated_at = $this->parseDate($item['updated_at']);
            if (isset($item['deleted_at'])) $newsletter->deleted_at = $this->parseDate($item['deleted_at']);

            $newsletter->save();
            $this->idMap['newsletters'][$mongoId] = $newsletter->id;
            $this->stats['newsletters']['imported']++;
        }
    }

    private function importNewsletterUsers(string $path): void
    {
        $file = "{$path}/newsletter_users.json";
        if (!file_exists($file)) return;

        $data = json_decode(file_get_contents($file), true);
        $this->command->info("Importing " . count($data) . " newsletter_users...");

        foreach ($data as $item) {
            $newsletterId = null;
            if (isset($item['newsletter_id']) && isset($this->idMap['newsletters'][$item['newsletter_id']])) {
                $newsletterId = $this->idMap['newsletters'][$item['newsletter_id']];
            }
            $userId = null;
            if (isset($item['user_id']) && isset($this->idMap['users'][$item['user_id']])) {
                $userId = $this->idMap['users'][$item['user_id']];
            }

            if (!$newsletterId || !$userId) continue;

            $existing = DB::table('newsletter_user')
                ->where('newsletter_id', $newsletterId)
                ->where('user_id', $userId)
                ->exists();

            if ($existing) {
                $this->stats['newsletter_users']['skipped']++;
                continue;
            }

            DB::table('newsletter_user')->insert([
                'id' => Str::uuid()->toString(),
                'newsletter_id' => $newsletterId,
                'user_id' => $userId,
                'date' => $this->parseDate($item['date'] ?? null),
                'sent' => $item['sent'] ?? true,
                'viewed_count' => $item['viewed_count'] ?? 0,
                'ip' => $item['ip'] ?? null,
                'created_at' => $this->parseDate($item['created_at'] ?? null) ?? now(),
                'updated_at' => $this->parseDate($item['updated_at'] ?? null) ?? now(),
            ]);

            $this->stats['newsletter_users']['imported']++;
        }
    }

    private function parseDate($value): ?Carbon
    {
        if (!$value) return null;
        if (is_array($value) && isset($value['date'])) return Carbon::parse($value['date']);
        if (is_string($value)) {
            try {
                return Carbon::parse($value);
            } catch (\Exception $e) {
                return null;
            }
        }
        return null;
    }

    private function processLegacyTemplateConfig(array $config): array
    {
        // Legacy: flat avatar
        $config['image_floating'] = false;
        // Legacy Configs Defaults
        if (!isset($config['showLinkSubtext'])) $config['showLinkSubtext'] = false;
        if (!isset($config['showTitle'])) $config['showTitle'] = true;
        if (!isset($config['showSubtitle'])) $config['showSubtitle'] = true;
        if (!isset($config['header'])) $config['header'] = [];
        $config['header']['avatarFloating'] = false;

        $legacyIcons = $config['icons'] ?? [];
        $config['buttons'] = $this->convertLegacyButtons($config['buttons'] ?? [], $legacyIcons);

        return $config;
    }

    private function convertLegacyButtons(array $buttons, array $legacyIcons = []): array
    {
        $bgColor = $buttons['backgroundColor'] ?? '#000000';
        $textColor = $buttons['textColor'] ?? '#ffffff';
        $borderShow = $buttons['borderShow'] ?? false;
        $borderColor = $buttons['borderColor'] ?? '#000000';

        $style = 'solid';

        // Logic for outline vs solid can be refined here
        // For now trusting solid + borderEnabled to render correctly in V2

        $legacyPosition = $legacyIcons['position'] ?? ($buttons['icons']['position'] ?? 'left');
        $iconAlignment = $legacyPosition === 'align' ? 'inline' : $legacyPosition;

        return [
            'style' => $style,
            'shape' => $buttons['shape'] ?? 'pill', // Default changed to match common legacy
            'size' => $buttons['size'] ?? 'compact',
            'backgroundColor' => $bgColor,
            'textColor' => $textColor,
            'borderColor' => $borderColor,
            'borderEnabled' => (bool) $borderShow,
            'showIcons' => $legacyIcons['show'] ?? ($buttons['showIcons'] ?? true),
            'iconAlignment' => $iconAlignment,
        ];
    }

    private function printSummary(): void
    {
        $this->command->info("\n=== Import Summary ===");
        foreach ($this->stats as $collection => $stats) {
            $total = $stats['imported'] + $stats['skipped'];
            $this->command->info(ucfirst($collection) . ": Imported {$stats['imported']}, Skipped {$stats['skipped']}, Total {$total}");
        }
    }
}
