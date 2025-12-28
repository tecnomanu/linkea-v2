<?php

namespace Database\Factories;

use App\Models\Link;
use App\Models\Landing;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Link>
 */
class LinkFactory extends Factory
{
    protected $model = Link::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'slug' => Str::random(10),
            'state' => true,
            'text' => fake()->sentence(3),
            'group' => 'links',
            'type' => 'url',
            'link' => fake()->url(),
            'icon' => null,
            'image' => null,
            'order' => fake()->numberBetween(0, 100),
            'options' => [],
            'config' => [],
            'visited' => 0,
            'landing_id' => Landing::factory(),
        ];
    }

    /**
     * Configure the link as a social link.
     */
    public function social(string $platform = 'instagram'): static
    {
        $socialUrls = [
            'instagram' => 'https://instagram.com/' . fake()->userName(),
            'twitter' => 'https://twitter.com/' . fake()->userName(),
            'facebook' => 'https://facebook.com/' . fake()->userName(),
            'linkedin' => 'https://linkedin.com/in/' . fake()->userName(),
            'youtube' => 'https://youtube.com/@' . fake()->userName(),
            'tiktok' => 'https://tiktok.com/@' . fake()->userName(),
        ];

        return $this->state(fn(array $attributes) => [
            'group' => 'socials',
            'type' => $platform,
            'link' => $socialUrls[$platform] ?? fake()->url(),
        ]);
    }

    /**
     * Configure the link as inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn(array $attributes) => [
            'state' => false,
        ]);
    }

    /**
     * Configure the link for a specific landing.
     */
    public function forLanding(Landing $landing): static
    {
        return $this->state(fn(array $attributes) => [
            'landing_id' => $landing->id,
        ]);
    }
}
