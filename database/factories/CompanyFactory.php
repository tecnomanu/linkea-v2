<?php

namespace Database\Factories;

use App\Models\Company;
use App\Models\User;
use App\Models\Membership;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Company>
 */
class CompanyFactory extends Factory
{
    protected $model = Company::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->company(),
        ];
    }

    /**
     * Configure the company with an owner.
     */
    public function withOwner(?User $user = null): static
    {
        return $this->state(fn(array $attributes) => [
            'owner_id' => $user?->id ?? User::factory(),
        ]);
    }

    /**
     * Configure the company with a membership.
     */
    public function withMembership(?Membership $membership = null): static
    {
        return $this->state(fn(array $attributes) => [
            'membership_id' => $membership?->id ?? Membership::factory(),
        ]);
    }
}
