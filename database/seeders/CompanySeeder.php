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
        $rootUser = User::where('email', 'root@root.com')->first();

        if ($rootUser) {
            $linkeaCompany = Company::where('name', 'Linkea')->first();

            if (!$linkeaCompany) {
                $linkeaCompany = Company::create([
                    'name' => 'Linkea',
                    'owner_id' => $rootUser->id,
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now()
                ]);
            }

            // Update user with company_id
            $rootUser->update(['company_id' => $linkeaCompany->id]);
        }

        // Create Test Company for Test User
        $testUser = User::where('email', 'test@example.com')->first();

        if ($testUser) {
            $testCompany = Company::where('name', 'Test Company')->first();

            if (!$testCompany) {
                $testCompany = Company::create([
                    'name' => 'Test Company',
                    'owner_id' => $testUser->id,
                ]);
            }

            $testUser->update(['company_id' => $testCompany->id]);
        }

        // Create Test2 Company for Test2 User
        $testUser2 = User::where('email', 'test2@example.com')->first();

        if ($testUser2) {
            $testCompany2 = Company::where('name', 'Test Company 2')->first();

            if (!$testCompany2) {
                $testCompany2 = Company::create([
                    'name' => 'Test Company 2',
                    'owner_id' => $testUser2->id,
                ]);
            }

            $testUser2->update(['company_id' => $testCompany2->id]);
        }
    }
}
