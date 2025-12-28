<?php

namespace Database\Factories;

use App\Models\Landing;
use App\Models\User;
use App\Models\Company;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Landing>
 */
class LandingFactory extends Factory
{
    protected $model = Landing::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->name();

        return [
            'name' => $name,
            'slug' => Str::slug($name) . '-' . fake()->unique()->numberBetween(1000, 9999),
            'logo' => null,
            'verify' => false,
            'domain_name' => null,
            'template_config' => [
                'theme' => 'default',
                'colors' => [
                    'primary' => '#000000',
                    'background' => '#ffffff',
                ],
            ],
            'options' => [],
            'views' => 0,
            'user_id' => User::factory(),
        ];
    }

    /**
     * Configure the landing as verified.
     */
    public function verified(): static
    {
        return $this->state(fn(array $attributes) => [
            'verify' => true,
        ]);
    }

    /**
     * Configure the landing with a non-dicebear logo (for featured).
     */
    public function withRealLogo(): static
    {
        return $this->state(fn(array $attributes) => [
            'logo' => json_encode(['original' => '/images/sample-logo.webp']),
        ]);
    }

    /**
     * Configure the landing with a company.
     */
    public function forCompany(?Company $company = null): static
    {
        return $this->state(fn(array $attributes) => [
            'company_id' => $company?->id ?? Company::factory(),
        ]);
    }

    /**
     * Configure the landing for a specific user.
     */
    public function forUser(User $user): static
    {
        return $this->state(fn(array $attributes) => [
            'user_id' => $user->id,
        ]);
    }

    /**
     * Configure the landing as featured (verified + real logo).
     */
    public function featured(): static
    {
        return $this->verified()->withRealLogo();
    }
}
