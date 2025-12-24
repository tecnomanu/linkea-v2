<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            ['name' => 'Root', 'type' => 'root'],
            ['name' => 'Admin', 'type' => 'admin'],
            ['name' => 'Usuario', 'type' => 'user'],
            ['name' => 'Proveedor', 'type' => 'provider'],
        ];

        foreach ($roles as $roleData) {
            Role::firstOrCreate(
                ['type' => $roleData['type']],
                [
                    'name' => $roleData['name'],
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now()
                ]
            );
        }
    }
}
