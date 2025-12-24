<?php

namespace App\Console\Commands;

use App\Models\Link;
use App\Models\LinkStatistic;
use Carbon\Carbon;
use Illuminate\Console\Command;

class GenerateLinkStatistics extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'links:generate-stats 
                            {--links= : Specific link IDs separated by comma (optional)}
                            {--days=30 : Number of days to generate statistics for}
                            {--min=5 : Minimum visits per day}
                            {--max=100 : Maximum visits per day}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate random statistics (visits) for links including daily breakdown';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $linkIds = $this->option('links');
        $days = (int) $this->option('days');
        $min = (int) $this->option('min');
        $max = (int) $this->option('max');

        // Get links
        if ($linkIds) {
            $ids = explode(',', $linkIds);
            $links = Link::whereIn('id', $ids)->get();
        } else {
            $links = Link::all();
        }

        if ($links->isEmpty()) {
            $this->error('No links found!');
            return 1;
        }

        $this->info("Generating random statistics for {$links->count()} links over {$days} days...");

        $bar = $this->output->createProgressBar($links->count());
        $bar->start();

        foreach ($links as $link) {
            $totalVisits = 0;

            // Generate daily stats for the last N days
            for ($i = 0; $i < $days; $i++) {
                $date = Carbon::today()->subDays($i);
                $visits = rand($min, $max);
                $totalVisits += $visits;

                // Upsert daily statistic
                LinkStatistic::updateOrCreate(
                    [
                        'link_id' => $link->id,
                        'date' => $date,
                    ],
                    [
                        'visits' => $visits,
                    ]
                );
            }

            // Update total visits in link
            $link->update(['visited' => $totalVisits]);
            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);
        $this->info("✅ Statistics generated successfully!");

        // Show summary
        $this->table(
            ['Link ID', 'Title', 'Total Visits', 'Last 7 Days'],
            $links->map(function ($link) {
                $last7Days = LinkStatistic::where('link_id', $link->id)
                    ->where('date', '>=', Carbon::today()->subDays(7))
                    ->sum('visits');

                return [
                    substr($link->id, 0, 8) . '...',
                    $link->text ?? 'No title',
                    number_format($link->visited),
                    number_format($last7Days)
                ];
            })
        );

        return 0;
    }
}
