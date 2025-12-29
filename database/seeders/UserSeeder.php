<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Root User
        $rootUser = User::where('email', 'root@root.com')->first();

        if (!$rootUser) {
            $rootUser = User::create([
                'name' => 'Admin Admin',
                'first_name' => 'Admin',
                'last_name' => 'Admin',
                'password' => Hash::make('12345678'),
                'email' => 'root@root.com',
                'verified_at' => now(),
            ]);

            $rootRole = Role::where('name', 'Root')->first();
            if ($rootRole) {
                $rootUser->roles()->attach($rootRole);
            }
        }

        // Create Test User
        $testUser = User::where('email', 'test@example.com')->first();

        if (!$testUser) {
            $testUser = User::create([
                'name' => 'Test User',
                'first_name' => 'Test',
                'last_name' => 'User',
                'email' => 'test@example.com',
                'password' => Hash::make('password'),
                'verified_at' => now(),
            ]);

            $userRole = Role::where('type', 'user')->first();
            if ($userRole) {
                $testUser->roles()->attach($userRole);
            }
        }

        // Create additional test user
        $testUser2 = User::where('email', 'test2@example.com')->first();

        if (!$testUser2) {
            $testUser2 = User::create([
                'name' => 'Test Two',
                'first_name' => 'Test',
                'last_name' => 'Two',
                'email' => 'test2@example.com',
                'password' => Hash::make('password123'),
                'verified_at' => now(),
            ]);

            $userRole = Role::where('type', 'user')->first();
            if ($userRole) {
                $testUser2->roles()->attach($userRole);
            }
        }
    }
}
