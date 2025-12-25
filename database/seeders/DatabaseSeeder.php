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
        // Check if we should import from MongoDB
        $mongoImportPath = storage_path('mongo_import/users.json');

        if (file_exists($mongoImportPath)) {
            $this->command->info('MongoDB import files found. Importing real data...');
            $this->call([
                MongoImportSeeder::class,
            ]);
        } else {
            // Run seeders with test data in correct dependency order
            $this->command->info('No MongoDB import files. Using test data...');
            $this->call([
                RoleSeeder::class,
                UserSeeder::class,
                CompanySeeder::class,
                LandingSeeder::class,
                LinkSeeder::class,
            ]);
        }
    }
}
