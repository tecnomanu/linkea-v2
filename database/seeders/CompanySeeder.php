<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class CompanySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Linkea Company for Root User
        $rootUser = User::where('username', 'root_linkea')->first();

        if ($rootUser) {
            $linkeaCompany = Company::where('slug', 'linkea')->first();

            if (!$linkeaCompany) {
                $linkeaCompany = Company::create([
                    'name' => 'Linkea',
                    'slug' => 'linkea',
                    'owner_id' => $rootUser->id,
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now()
                ]);
            }

            // Update user with company_id
            $rootUser->update(['company_id' => $linkeaCompany->id]);
        }

        // Create Test Company for Test User
        $testUser = User::where('username', 'testuser')->first();

        if ($testUser) {
            $testCompany = Company::where('slug', 'test-company')->first();

            if (!$testCompany) {
                $testCompany = Company::create([
                    'name' => 'Test Company',
                    'slug' => 'test-company',
                    'owner_id' => $testUser->id,
                ]);
            }

            $testUser->update(['company_id' => $testCompany->id]);
        }

        // Create Test2 Company for Test2 User
        $testUser2 = User::where('username', 'testuser2')->first();

        if ($testUser2) {
            $testCompany2 = Company::where('slug', 'test-company-2')->first();

            if (!$testCompany2) {
                $testCompany2 = Company::create([
                    'name' => 'Test Company 2',
                    'slug' => 'test-company-2',
                    'owner_id' => $testUser2->id,
                ]);
            }

            $testUser2->update(['company_id' => $testCompany2->id]);
        }
    }
}
