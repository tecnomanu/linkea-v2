<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Run seeders in correct dependency order
        $this->call([
            RoleSeeder::class,
            UserSeeder::class,
            CompanySeeder::class,
            LandingSeeder::class,
            LinkSeeder::class,
        ]);
    }
}
