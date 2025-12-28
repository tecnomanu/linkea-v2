<?php

namespace Database\Factories;

use App\Models\Membership;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Membership>
 */
class MembershipFactory extends Factory
{
    protected $model = Membership::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => 'Free',
            'type' => 'free',
        ];
    }

    /**
     * Configure as premium membership.
     */
    public function premium(): static
    {
        return $this->state(fn(array $attributes) => [
            'name' => 'Premium',
            'type' => 'premium',
        ]);
    }

    /**
     * Configure as pro membership.
     */
    public function pro(): static
    {
        return $this->state(fn(array $attributes) => [
            'name' => 'Pro',
            'type' => 'pro',
        ]);
    }
}
