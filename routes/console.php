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

// Future: Statistics aggregation, email notifications, etc.
