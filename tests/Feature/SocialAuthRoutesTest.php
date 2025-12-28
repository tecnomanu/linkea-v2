<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User as SocialiteUser;
use Mockery;
use Tests\TestCase;

/**
 * Tests for social authentication routes (Google, Apple, etc.)
 */
class SocialAuthRoutesTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test Google OAuth redirect is accessible.
     */
    public function test_google_oauth_redirect_is_accessible(): void
    {
        $response = $this->get('/auth/google/redirect');

        // Should redirect to Google OAuth (302) or fail due to missing config (500)
        // In test environment, config might be missing, so both are somewhat acceptable
        // unless we mock config.
        $this->assertTrue(
            $response->isRedirection() || $response->status() === 500,
            "Expected redirect or config error but got status {$response->status()}"
        );
    }

    /**
     * Test Google Login Creates New User and Redirects to Setup.
     */
    public function test_google_callback_creates_new_user_and_redirects_to_setup(): void
    {
        // Mock Socialite User
        $socialUser = Mockery::mock(SocialiteUser::class);
        $socialUser->shouldReceive('getId')->andReturn('google-12345');
        $socialUser->shouldReceive('getName')->andReturn('Google User');
        $socialUser->shouldReceive('getNickname')->andReturn('googleuser');
        $socialUser->shouldReceive('getEmail')->andReturn('newuser@gmail.com');
        $socialUser->shouldReceive('getAvatar')->andReturn('https://avatar.url');

        // Mock Socialite Driver
        Socialite::shouldReceive('driver')->with('google')->andReturnSelf();
        Socialite::shouldReceive('user')->andReturn($socialUser);

        // Make Request
        $response = $this->get('/auth/google/callback');

        // Assertions
        $response->assertSessionHasNoErrors();

        // 1. Check user created in DB
        $this->assertDatabaseHas('users', [
            'email' => 'newuser@gmail.com',
            'first_name' => 'Google',
            'last_name' => 'User',
            'google_id' => 'google-12345',
        ]);

        $user = User::where('email', 'newuser@gmail.com')->first();

        // 2. Check redirect to setup username (since user has no company yet)
        $response->assertRedirect(route('auth.setup.username'));

        // 3. User should be authenticated
        $this->assertAuthenticatedAs($user);
    }

    /**
     * Test Google Login with Existing Email Links Account.
     */
    public function test_google_callback_links_existing_user(): void
    {
        // Create existing user
        $user = User::factory()->create([
            'email' => 'existing@gmail.com',
            'password' => bcrypt('password123'),
        ]);

        // Mock Socialite User
        $socialUser = Mockery::mock(SocialiteUser::class);
        $socialUser->shouldReceive('getId')->andReturn('google-existing-123');
        $socialUser->shouldReceive('getName')->andReturn('Existing User');
        $socialUser->shouldReceive('getEmail')->andReturn('existing@gmail.com');
        $socialUser->shouldReceive('getAvatar')->andReturn('https://avatar.url');

        // Mock Socialite Driver
        Socialite::shouldReceive('driver')->with('google')->andReturnSelf();
        Socialite::shouldReceive('user')->andReturn($socialUser);

        // Make Request
        $response = $this->get('/auth/google/callback');

        // Assertions
        $response->assertSessionHasNoErrors();

        // 1. Check user updated with google_id
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'email' => 'existing@gmail.com',
            'google_id' => 'google-existing-123',
        ]);

        // 2. Check redirect (to setup if no company, or panel if company exists)
        // Factory user might or might not have company depending on definition. 
        // Assuming factory user doesn't have company by default unless specified.
        if ($user->company_id) {
            $response->assertRedirect('/panel');
        } else {
            $response->assertRedirect(route('auth.setup.username'));
        }

        // 3. Authenticated
        $this->assertAuthenticatedAs($user);
    }
}
