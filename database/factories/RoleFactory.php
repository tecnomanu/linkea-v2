<?php

namespace Database\Factories;

use App\Models\Role;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Role>
 */
class RoleFactory extends Factory
{
    protected $model = Role::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => 'User',
            'type' => 'user',
        ];
    }

    /**
     * Configure the role as root/admin.
     */
    public function root(): static
    {
        return $this->state(fn(array $attributes) => [
            'name' => 'Root',
            'type' => 'root',
        ]);
    }

    /**
     * Configure the role as a regular user.
     */
    public function user(): static
    {
        return $this->state(fn(array $attributes) => [
            'name' => 'User',
            'type' => 'user',
        ]);
    }
}
