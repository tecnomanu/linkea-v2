<?php

namespace Database\Seeders;

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
        $rootUser = User::where('email', 'root@root.com')->first();
        $linkeaCompany = Company::where('name', 'Linkea')->first();

        if ($rootUser && $linkeaCompany) {
            $landing = Landing::where('slug', 'linkea')->first();

            if (!$landing) {
                Landing::create([
                    'name' => 'Linkea',
                    'slug' => 'linkea',
                    'logo' => null,
                    'domain_name' => 'linkea',
                    'template_config' => [],
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
                    'domain_name' => 'testuser',
                    'company_id' => $testCompany->id,
                    'user_id' => $testUser->id,
                    'verify' => true,
                    'logo' => ['image' => '/images/logos/logo-icon.webp'],
                    'template_config' => [
                        'background' => [
                            'bgName' => 'gradient',
                            'background' => 'linear-gradient(90deg, #FE6A16 0%, #ff528e 100%)',
                            'backgroundColor' => '#FE6A16'
                        ],
                        'textColor' => '#ffffff',
                        'buttons' => [
                            'backgroundColor' => '#ffffff',
                            'textColor' => '#000000',
                            'backgroundHoverColor' => '#f0f0f0',
                            'textHoverColor' => '#000000',
                            'rounded' => '24px'
                        ]
                    ],
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
                    'domain_name' => 'testuser2',
                    'company_id' => $testCompany2->id,
                    'user_id' => $testUser2->id,
                    'verify' => true,
                    'logo' => ['image' => '/images/logos/logo-icon.webp'],
                    'template_config' => [
                        'background' => [
                            'bgName' => 'solid',
                            'backgroundColor' => '#1a1a1a'
                        ],
                        'textColor' => '#ffffff',
                        'buttons' => [
                            'backgroundColor' => '#FE6A16',
                            'textColor' => '#ffffff',
                            'rounded' => '12px'
                        ]
                    ],
                    'options' => ['title' => '@testuser2']
                ]);
            }
        }
    }
}
