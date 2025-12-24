<?php

/**
 * =======================================================================
 * API Routes
 * =======================================================================
 * 
 * Handles all API endpoints including:
 * - Authentication (login, register, password reset)
 * - Profile management
 * - Panel data management (links, design, settings)
 * - Notifications
 * - Admin operations (users, companies, roles, etc.)
 * - Statistics
 * 
 * Most routes require authentication via Sanctum
 */

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\NotificationsController;
use App\Http\Controllers\Api\StatisticsController;
use App\Http\Controllers\Api\UsersController;
use App\Http\Controllers\Api\CompaniesController;
use App\Http\Controllers\Api\RolesController;
use App\Http\Controllers\Api\MembershipsController;
use App\Http\Controllers\Api\Admin\NewslettersController;

// Panel Controllers (new Inertia/React panel)
use App\Http\Controllers\Api\Panel\LinkController;
use App\Http\Controllers\Api\Panel\LandingController;

// Legacy Controllers (deprecated - Angular wizard)
use App\Http\Controllers\Api\LandingsController as LegacyLandingsController;
use App\Http\Controllers\Api\LinksController as LegacyLinksController;

/**
 * =======================================================================
 * CORS Preflight Handler
 * =======================================================================
 */
Route::options('/{any}', function () {
    return response(['status' => 'success'])
        ->header('Access-Control-Allow-Origin', '*')
        ->header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE')
        ->header('Access-Control-Allow-Headers', 'Authorization, Content-Type, Origin');
})->where('any', '.*');

/**
 * =======================================================================
 * AUTHENTICATION ROUTES (Public)
 * =======================================================================
 */
Route::prefix('auth')->group(function () {
    // Login & Registration
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Password Reset
    Route::post('/request-password', [AuthController::class, 'requestPassword']);
    Route::put('/reset-password', [AuthController::class, 'resetPassword']);

    // Email Verification
    Route::prefix('verify')->group(function () {
        Route::post('/', [AuthController::class, 'verifyEmail']);
        Route::middleware('auth:sanctum')->group(function () {
            Route::get('/send', [AuthController::class, 'sendVerificationEmail']);
        });
    });
});

/**
 * =======================================================================
 * PROTECTED ROUTES (Require Authentication)
 * =======================================================================
 */
/**
 * -----------------------------------------------------------------------
 * PANEL ROUTES (New Inertia/React Panel)
 * -----------------------------------------------------------------------
 * These endpoints are used by the auto-save system and other panel features.
 * Uses 'web' guard since users are authenticated via session (Inertia).
 */
Route::prefix('panel')->middleware(['web', 'auth'])->group(function () {
    // Links Management
    Route::post('/links/{landingId}', [LinkController::class, 'saveLinks'])
        ->name('api.panel.links.save');
    Route::post('/social-links/{landingId}', [LinkController::class, 'saveSocialLinks'])
        ->name('api.panel.social-links.save');
    Route::get('/links/{linkId}/stats', [LinkController::class, 'getStats'])
        ->name('api.panel.links.stats');

    // Landing/Design Management
    Route::post('/design/{landingId}', [LandingController::class, 'saveDesign'])
        ->name('api.panel.design.save');
    Route::post('/settings/{landingId}', [LandingController::class, 'saveSettings'])
        ->name('api.panel.settings.save');
    Route::post('/validate-handle/{landingId}', [LandingController::class, 'validateHandle'])
        ->name('api.panel.validate-handle');
});

Route::middleware(['auth:sanctum'])->group(function () {

    /**
     * -----------------------------------------------------------------------
     * PROFILE & USER DATA
     * -----------------------------------------------------------------------
     */
    Route::get('/me/data', [ProfileController::class, 'get']);
    Route::post('/profile', [ProfileController::class, 'update']);
    Route::post('/settings', [ProfileController::class, 'changeSettings']);

    /**
     * -----------------------------------------------------------------------
     * WIZARD ROUTES (Legacy - Deprecated)
     * -----------------------------------------------------------------------
     * @deprecated These routes are for the old Angular panel.
     * Use /api/panel/* routes instead for the new React panel.
     */
    Route::prefix('wizard')->group(function () {
        // Landing Management
        Route::prefix('landing')->group(function () {
            Route::get('', [LegacyLandingsController::class, 'current']);
            Route::post('validate-name', [LegacyLandingsController::class, 'validateName']);
            Route::get('{id}', [LegacyLandingsController::class, 'get']);
            Route::post('{id}', [LegacyLandingsController::class, 'put']);
        });

        // Links Management
        Route::prefix('links')->group(function () {
            Route::get('', [LegacyLinksController::class, 'current']);
            Route::get('{id}', [LegacyLinksController::class, 'get']);
            Route::post('{landingId}', [LegacyLinksController::class, 'createOrUpdate']);
            Route::delete('{id}', [LegacyLinksController::class, 'remove']);
            Route::delete('{id}/destroy', [LegacyLinksController::class, 'destroy']);
        });
    });

    /**
     * -----------------------------------------------------------------------
     * NOTIFICATIONS
     * -----------------------------------------------------------------------
     */
    Route::prefix('notifications')->group(function () {
        Route::get('', [NotificationsController::class, 'all']);
        Route::post('viewed', [NotificationsController::class, 'checkViewed']);
        Route::post('read-all', [NotificationsController::class, 'checkReadAll']);
        Route::post('{id}/read', [NotificationsController::class, 'checkRead']);
    });

    /**
     * -----------------------------------------------------------------------
     * STATISTICS
     * -----------------------------------------------------------------------
     */
    Route::prefix('statistics')->group(function () {
        Route::post('/link/click/{id}', [StatisticsController::class, 'trace']);
    });

    /**
     * -----------------------------------------------------------------------
     * ADMIN ROUTES (Require Root Role)
     * -----------------------------------------------------------------------
     */
    Route::prefix('admin')->middleware('role:root')->group(function () {

        // Users Management
        Route::prefix('user')->group(function () {
            Route::get('', [UsersController::class, 'all']);
            Route::get('{id}', [UsersController::class, 'get']);
            Route::post('', [UsersController::class, 'add']);
            Route::put('{id}', [UsersController::class, 'put']);
            Route::delete('{id}', [UsersController::class, 'remove']);
            Route::delete('{id}/destroy', [UsersController::class, 'destroy']);
            Route::get('{id}/clone', [UsersController::class, 'replicate']);
        });

        // Companies Management
        Route::prefix('company')->group(function () {
            Route::get('', [CompaniesController::class, 'all']);
            Route::get('{id}', [CompaniesController::class, 'get']);
            Route::post('', [CompaniesController::class, 'add']);
            Route::put('{id}', [CompaniesController::class, 'put']);
            Route::delete('{id}', [CompaniesController::class, 'remove']);
            Route::delete('{id}/destroy', [CompaniesController::class, 'destroy']);
            Route::get('{id}/clone', [CompaniesController::class, 'replicate']);
        });

        // Roles Management
        Route::prefix('role')->group(function () {
            Route::get('', [RolesController::class, 'all']);
            Route::get('{id}', [RolesController::class, 'get']);
            Route::post('', [RolesController::class, 'add']);
            Route::put('{id}', [RolesController::class, 'put']);
            Route::delete('{id}', [RolesController::class, 'remove']);
        });

        // Memberships
        Route::get('membership', [MembershipsController::class, 'all']);

        // Landings (Admin View)
        Route::get('landing', [LegacyLandingsController::class, 'all']);

        // Newsletters
        Route::prefix('newsletter')->group(function () {
            Route::get('', [NewslettersController::class, 'all']);
            Route::get('{id}', [NewslettersController::class, 'get']);
            Route::post('', [NewslettersController::class, 'add']);
            Route::put('{id}', [NewslettersController::class, 'put']);
            Route::delete('{id}', [NewslettersController::class, 'remove']);
            Route::delete('{id}/destroy', [NewslettersController::class, 'destroy']);
            Route::post('{id}/send', [NewslettersController::class, 'sendSystemMessage']);
        });

        // Admin Notifications
        Route::post('notifications', [NotificationsController::class, 'add']);

        // Bulk verify landings (Legacy feature)
        Route::get('verify-all', function () {
            $landings = \App\Models\Landing::where("verify", false)->get();
            $verified = [];
            foreach ($landings as $landing) {
                $landing->update(["verify" => true]);
                // $landing->company->owner->notify(new \App\Notifications\VerifyLandingReport());
                $verified[] = $landing->name;
            }
            return response()->json(["status" => "success", "verified" => $verified]);
        });
    });
});

/**
 * =======================================================================
 * PUBLIC API ROUTES
 * =======================================================================
 */

// CSRF Token refresh endpoint (for SPA token mismatch recovery)
Route::get('csrf-token', function () {
    return response()->json(['token' => csrf_token()]);
})->middleware('web')->name('api.csrf-token');

// Statistics - Public endpoint for tracking link clicks (no auth, no CSRF)
Route::post('/statistics/link/click/{id}', [StatisticsController::class, 'trace'])
    ->name('api.statistics.click');

// Newsletter Pixel Tracking
Route::get('pixel/{id}/{userId}/px.png', [NewslettersController::class, 'setPixel'])
    ->name('pixel.track');
