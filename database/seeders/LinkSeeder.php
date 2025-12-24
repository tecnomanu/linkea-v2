<?php

namespace Database\Seeders;

use App\Models\Link;
use App\Models\Landing;
use Illuminate\Database\Seeder;

class LinkSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Links for testuser landing
        $testLanding = Landing::where('slug', 'testuser')->first();

        if ($testLanding) {
            // Clear existing links to avoid duplicates
            Link::where('landing_id', $testLanding->id)->delete();

            // Create sample links
            Link::create([
                'landing_id' => $testLanding->id,
                'text' => 'Mi Sitio Web',
                'link' => 'https://google.com',
                'state' => true,
                'order' => 1,
                'type' => 'link',
                'group' => 'links',
                'icon' => ['name' => 'Globe', 'type' => 'solid']
            ]);

            Link::create([
                'landing_id' => $testLanding->id,
                'text' => 'Instagram',
                'link' => 'https://instagram.com',
                'state' => true,
                'order' => 2,
                'type' => 'social',
                'group' => 'socials',
                'icon' => ['name' => 'Instagram', 'type' => 'brand']
            ]);

            Link::create([
                'landing_id' => $testLanding->id,
                'text' => 'WhatsApp',
                'link' => 'https://wa.me/12345678',
                'state' => true,
                'order' => 3,
                'type' => 'social',
                'group' => 'socials',
                'icon' => ['name' => 'MessageCircle', 'type' => 'solid']
            ]);

            Link::create([
                'landing_id' => $testLanding->id,
                'text' => 'Twitter',
                'link' => 'https://twitter.com',
                'state' => true,
                'order' => 4,
                'type' => 'social',
                'group' => 'socials',
                'icon' => ['name' => 'Twitter', 'type' => 'brand']
            ]);
        }

        // Create Links for testuser2 landing
        $testLanding2 = Landing::where('slug', 'testuser2')->first();

        if ($testLanding2) {
            Link::where('landing_id', $testLanding2->id)->delete();

            Link::create([
                'landing_id' => $testLanding2->id,
                'text' => 'Portfolio',
                'link' => 'https://portfolio.example.com',
                'state' => true,
                'order' => 1,
                'type' => 'link',
                'group' => 'links',
                'icon' => ['name' => 'Briefcase', 'type' => 'solid']
            ]);

            Link::create([
                'landing_id' => $testLanding2->id,
                'text' => 'GitHub',
                'link' => 'https://github.com',
                'state' => true,
                'order' => 2,
                'type' => 'social',
                'group' => 'socials',
                'icon' => ['name' => 'Github', 'type' => 'brand']
            ]);

            Link::create([
                'landing_id' => $testLanding2->id,
                'text' => 'LinkedIn',
                'link' => 'https://linkedin.com',
                'state' => true,
                'order' => 3,
                'type' => 'social',
                'group' => 'socials',
                'icon' => ['name' => 'Linkedin', 'type' => 'brand']
            ]);
        }
    }
}
