<?php

namespace App\Console\Commands;

use App\Models\Landing;
use App\Models\LandingStatistic;
use App\Models\Link;
use App\Models\LinkStatistic;
use Carbon\Carbon;
use Illuminate\Console\Command;

class GenerateTestStats extends Command
{
    protected $signature = 'stats:generate {slug=linkea} {--from=2025-12-01} {--to=2025-12-26}';
    protected $description = 'Generate test statistics for a landing page';

    public function handle(): int
    {
        $slug = $this->argument('slug');
        $fromDate = Carbon::parse($this->option('from'));
        $toDate = Carbon::parse($this->option('to'));

        $landing = Landing::where('slug', $slug)
            ->orWhere('domain_name', $slug)
            ->first();

        if (!$landing) {
            $this->error("Landing '{$slug}' not found.");
            return 1;
        }

        $this->info("Found landing: {$landing->name} (ID: {$landing->id})");

        // Get clickable links (exclude headers)
        $links = Link::where('landing_id', $landing->id)
            ->whereNull('deleted_at')
            ->where('type', '!=', 'header')
            ->get();

        $this->info("Found {$links->count()} clickable links");

        // Generate data for each day
        $currentDate = $fromDate->copy();
        $totalViews = 0;
        $totalClicks = 0;

        while ($currentDate <= $toDate) {
            // Generate views for landing (more traffic on weekdays, less on weekends)
            $isWeekend = $currentDate->isWeekend();
            $baseViews = $isWeekend ? rand(30, 80) : rand(80, 200);
            
            // Add some randomness and trends (growing traffic)
            $dayOfMonth = $currentDate->day;
            $trendMultiplier = 1 + ($dayOfMonth / 50); // Slight upward trend
            $views = (int) ($baseViews * $trendMultiplier * (rand(80, 120) / 100));

            // Insert or update landing stats
            LandingStatistic::updateOrCreate(
                [
                    'landing_id' => $landing->id,
                    'date' => $currentDate->toDateString(),
                ],
                [
                    'views' => $views,
                ]
            );

            $totalViews += $views;

            // Generate clicks for each link
            foreach ($links as $link) {
                // CTR varies by link position and type (first links get more clicks)
                $baseCtr = rand(5, 25) / 100; // 5-25% CTR
                $clicks = (int) ($views * $baseCtr * (rand(60, 140) / 100));
                
                // Some days might have 0 clicks for some links
                if (rand(1, 10) <= 2) {
                    $clicks = 0;
                }

                if ($clicks > 0) {
                    LinkStatistic::updateOrCreate(
                        [
                            'link_id' => $link->id,
                            'date' => $currentDate->toDateString(),
                        ],
                        [
                            'visits' => $clicks,
                        ]
                    );

                    // Update link's total visited count
                    $link->increment('visited', $clicks);
                    $totalClicks += $clicks;
                }
            }

            $this->line("  {$currentDate->format('Y-m-d')}: {$views} views");
            $currentDate->addDay();
        }

        // Update landing total views
        $landing->increment('views', $totalViews);

        $this->newLine();
        $this->info("Stats generated successfully!");
        $this->table(
            ['Metric', 'Value'],
            [
                ['Total Views', number_format($totalViews)],
                ['Total Clicks', number_format($totalClicks)],
                ['Days', $fromDate->diffInDays($toDate) + 1],
                ['Links', $links->count()],
            ]
        );

        return 0;
    }
}

