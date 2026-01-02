<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// =============================================================================
// Scheduled Tasks
// =============================================================================

// Horizon metrics snapshot (every 5 minutes)
Schedule::command('horizon:snapshot')->everyFiveMinutes();

// Clear expired password reset tokens (daily)
Schedule::command('auth:clear-resets')->daily();

// Prune stale Sanctum tokens (daily)
// Schedule::command('sanctum:prune-expired --hours=24')->daily();

// Weekly stats report - Every Monday at 9:00 AM (Argentina timezone)
Schedule::command('stats:send-weekly-reports')
    ->weeklyOn(1, '9:00') // 1 = Monday
    ->timezone('America/Argentina/Buenos_Aires')
    ->withoutOverlapping()
    ->runInBackground();

// Future: Statistics aggregation, etc.
