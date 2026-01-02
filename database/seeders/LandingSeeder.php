<?php

namespace Database\Seeders;

use App\Constants\ThemeDefaults;
use App\Models\Landing;
use App\Models\User;
use App\Models\Company;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class LandingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Landing for Root User
        $rootUser = User::where('email', 'ideas@linkea.ar')->first();
        $linkeaCompany = Company::where('name', 'Linkea')->first();

        if ($rootUser && $linkeaCompany) {
            $landing = Landing::where('slug', 'linkea')->first();

            if (!$landing) {
                Landing::create([
                    'name' => 'Linkea',
                    'slug' => 'linkea',
                    'logo' => null,
                    'template_config' => ThemeDefaults::templateConfig('linkea'),
                    'options' => [],
                    'company_id' => $linkeaCompany->id,
                    'user_id' => $rootUser->id,
                    'verify' => true,
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now()
                ]);
            }
        }

        // Create Landing for Test User
        $testUser = User::where('email', 'test@example.com')->first();
        $testCompany = Company::where('name', 'Test Company')->first();

        if ($testUser && $testCompany) {
            $testLanding = Landing::where('slug', 'testuser')->first();

            if (!$testLanding) {
                Landing::create([
                    'name' => 'Mi Linkea',
                    'slug' => 'testuser',
                    'company_id' => $testCompany->id,
                    'user_id' => $testUser->id,
                    'verify' => true, // Normal users start unverified
                    'logo' => ['image' => '/images/logos/logo-icon.webp'],
                    'template_config' => ThemeDefaults::templateConfig('testuser'),
                    'options' => ['title' => '@testuser']
                ]);
            }
        }

        // Create Landing for Test2 User
        $testUser2 = User::where('email', 'test2@example.com')->first();
        $testCompany2 = Company::where('name', 'Test Company 2')->first();

        if ($testUser2 && $testCompany2) {
            $testLanding2 = Landing::where('slug', 'testuser2')->first();

            if (!$testLanding2) {
                Landing::create([
                    'name' => 'Test User 2 Links',
                    'slug' => 'testuser2',
                    'company_id' => $testCompany2->id,
                    'user_id' => $testUser2->id,
                    'verify' => false, // Normal users start unverified
                    'logo' => ['image' => '/images/logos/logo-icon.webp'],
                    'template_config' => ThemeDefaults::templateConfig('testuser2'),
                    'options' => ['title' => '@testuser2']
                ]);
            }
        }
    }
}
