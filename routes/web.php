<?php

/**
 * =======================================================================
 * Web Routes
 * =======================================================================
 * 
 * Handles all web/frontend routes including:
 * - Public pages (Home, Privacy, etc.)
 * - Panel routes (authenticated users)
 * - Admin routes
 * - Public landing pages (catch-all)
 * - System health/utility routes
 */

use App\Http\Controllers\WebController;
use App\Http\Controllers\Panel\PanelController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\SystemRouterController;
use Illuminate\Support\Facades\Route;

/**
 * =======================================================================
 * PUBLIC WEB ROUTES
 * =======================================================================
 */

// Home Page
Route::get('/', [WebController::class, 'index'])->name('home');

// Gallery Page - All public landings
Route::get('/gallery', [WebController::class, 'gallery'])->name('gallery');

// System Routes
Route::get('/health', [SystemRouterController::class, 'health'])->name('health');
Route::get('/privacy', [SystemRouterController::class, 'privacy'])->name('privacy');
Route::get('/sitemap.xml', [SystemRouterController::class, 'sitemap'])->name('sitemap');
Route::get('/llm.txt', [SystemRouterController::class, 'llmContext'])->name('llm.context');

// Statistics - Moved to api.php (no CSRF needed for public tracking)

/**
 * =======================================================================
 * PANEL ROUTES (Authenticated)
 * =======================================================================
 */

Route::middleware(['auth', 'verified'])->prefix('panel')->group(function () {
    // Dashboard/Overview
    Route::get('/', [PanelController::class, 'index'])->name('panel');

    // Links Management (View only - data saved via API)
    Route::get('/links', [PanelController::class, 'links'])->name('panel.links');

    // Design/Appearance (View only - data saved via API)
    Route::get('/design', [PanelController::class, 'design'])->name('panel.design');

    // Settings (View only - data saved via API)
    Route::get('/settings', [PanelController::class, 'settings'])->name('panel.settings');

    // Profile
    Route::get('/profile', [PanelController::class, 'profile'])->name('panel.profile');
});

/**
 * =======================================================================
 * ADMIN ROUTES (Root users only)
 * =======================================================================
 */

Route::middleware(['auth', 'root'])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard
    Route::get('/', [AdminController::class, 'index'])->name('dashboard');

    // Landings Management
    Route::get('/landings', [AdminController::class, 'landings'])->name('landings');
    Route::delete('/landings/{landing}', [AdminController::class, 'destroyLanding'])->name('landings.destroy');

    // Users Management
    Route::get('/users', [AdminController::class, 'users'])->name('users');
    Route::delete('/users/{user}', [AdminController::class, 'destroyUser'])->name('users.destroy');

    // Companies Management
    Route::get('/companies', [AdminController::class, 'companies'])->name('companies');
    Route::delete('/companies/{company}', [AdminController::class, 'destroyCompany'])->name('companies.destroy');

    // Newsletters Management
    Route::get('/newsletters', [AdminController::class, 'newsletters'])->name('newsletters');
    Route::get('/newsletters/create', [AdminController::class, 'createNewsletter'])->name('newsletters.create');
    Route::post('/newsletters', [AdminController::class, 'storeNewsletter'])->name('newsletters.store');
    Route::get('/newsletters/{newsletter}/edit', [AdminController::class, 'editNewsletter'])->name('newsletters.edit');
    Route::put('/newsletters/{newsletter}', [AdminController::class, 'updateNewsletter'])->name('newsletters.update');
    Route::delete('/newsletters/{newsletter}', [AdminController::class, 'destroyNewsletter'])->name('newsletters.destroy');
    Route::post('/newsletters/{newsletter}/send', [AdminController::class, 'sendNewsletter'])->name('newsletters.send');
    Route::post('/newsletters/{newsletter}/send-test', [AdminController::class, 'sendTestNewsletter'])->name('newsletters.send-test');

    // Notifications Management
    Route::get('/notifications', [AdminController::class, 'notifications'])->name('notifications');
    Route::get('/notifications/create', [AdminController::class, 'createNotification'])->name('notifications.create');
    Route::post('/notifications', [AdminController::class, 'storeNotification'])->name('notifications.store');
    Route::get('/notifications/{notification}/edit', [AdminController::class, 'editNotification'])->name('notifications.edit');
    Route::put('/notifications/{notification}', [AdminController::class, 'updateNotification'])->name('notifications.update');
    Route::delete('/notifications/{notification}', [AdminController::class, 'destroyNotification'])->name('notifications.destroy');
    Route::post('/notifications/{notification}/send', [AdminController::class, 'sendNotification'])->name('notifications.send');
});

/**
 * =======================================================================
 * DEVELOPMENT/TEST ROUTES (Only available in local/debug mode)
 * =======================================================================
 * These routes return 404 in production to hide their existence.
 */

use App\Http\Controllers\Dev\EmailPreviewController;

if (app()->environment('local', 'development', 'testing') || config('app.debug')) {
    Route::prefix('test')->group(function () {
        // Email Templates Preview
        Route::get('/email-templates', [EmailPreviewController::class, 'index'])->name('test.email-templates');
        Route::get('/email-templates/{template}', [EmailPreviewController::class, 'show'])->name('test.email-templates.show');
        Route::post('/email-templates/{template}/send', [EmailPreviewController::class, 'sendTest'])->name('test.email-templates.send');
    });
}

/**
 * =======================================================================
 * CATCH-ALL ROUTE (Must be last)
 * =======================================================================
 * 
 * Handles public landing pages by slug/domain
 * This must be the LAST route defined
 */

Route::get('/{any}', [SystemRouterController::class, 'landingView'])
    ->where('any', '.*')
    ->name('landing.view');
