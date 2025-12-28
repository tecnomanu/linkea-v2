<?php

/**
 * =======================================================================
 * Authentication Routes
 * =======================================================================
 *  
 * Handles all authentication-related routes including:
 * - Login/Register
 * - Password Reset
 * - Email Verification  
 * - Logout
 */

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\SocialAuthController;
use Illuminate\Support\Facades\Route;

/**
 * Redirect /auth to /auth/login
 */
Route::redirect('/auth', '/auth/login');

/**
 * Auth Routes with /auth prefix
 */
Route::prefix('auth')->group(function () {
    /**
     * Guest Routes (Not Authenticated)
     */
    Route::middleware('guest')->group(function () {
        // Login
        Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
        Route::post('/login', [AuthController::class, 'login']);

        // Register
        Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
        Route::post('/register', [AuthController::class, 'register']);

        // Password Reset - Request
        Route::get('/forgot-password', [AuthController::class, 'showForgotPassword'])->name('password.request');
        Route::post('/forgot-password', [AuthController::class, 'sendResetLink'])->name('password.email');

        // Password Reset - Reset with token
        Route::get('/reset-password/{token}', [AuthController::class, 'showResetPassword'])->name('password.reset');
        Route::post('/reset-password', [AuthController::class, 'resetPassword'])->name('password.store');

        // Social Login
        Route::get('/{provider}/redirect', [SocialAuthController::class, 'redirect'])->name('auth.social.redirect');
        Route::match(['get', 'post'], '/{provider}/callback', [SocialAuthController::class, 'callback'])->name('auth.social.callback');
    });

    /**
     * Authenticated Routes
     */
    Route::middleware('auth')->group(function () {
        // Logout
        Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

        // Email Verification
        Route::get('/verify-email', [AuthController::class, 'showVerifyEmail'])->name('verification.notice');
        Route::post('/verify-email', [AuthController::class, 'verifyEmail'])->name('verification.verify');
        Route::post('/verification-notification', [AuthController::class, 'resendVerificationCode'])
            ->middleware('throttle:6,1')
            ->name('verification.send');

        // Username Setup (Onboarding)
        Route::get('/setup-username', [\App\Http\Controllers\Auth\SetupUsernameController::class, 'show'])->name('auth.setup.username');
        Route::post('/setup-username', [\App\Http\Controllers\Auth\SetupUsernameController::class, 'store'])->name('auth.setup.username.store');
    });
});
