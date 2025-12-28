<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Landing;
use App\Models\Role;
use Tests\TestCase;

/**
 * Tests for authentication routes (login, register, password reset, etc.)
 */
class AuthRoutesTest extends TestCase
{
    /**
     * Test login page is accessible for guests.
     */
    public function test_login_page_is_accessible(): void
    {
        $response = $this->get('/auth/login');

        $response->assertStatus(200);
    }

    /**
     * Test registration page is accessible for guests.
     */
    public function test_register_page_is_accessible(): void
    {
        $response = $this->get('/auth/register');

        $response->assertStatus(200);
    }

    /**
     * Test forgot password page is accessible for guests.
     */
    public function test_forgot_password_page_is_accessible(): void
    {
        $response = $this->get('/auth/forgot-password');

        $response->assertStatus(200);
    }

    /**
     * Test /auth redirects to /auth/login.
     */
    public function test_auth_redirects_to_login(): void
    {
        $response = $this->get('/auth');

        $response->assertRedirect('/auth/login');
    }

    /**
     * Test users can login with valid credentials using identifier field.
     */
    public function test_users_can_login_with_valid_credentials(): void
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password123'),
            'email_verified_at' => now(),
            'verified_at' => now(),
        ]);

        $response = $this->post('/auth/login', [
            'identifier' => 'test@example.com',
            'password' => 'password123',
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertAuthenticated();
    }

    /**
     * Test users can login with landing slug as identifier.
     */
    public function test_users_can_login_with_landing_slug(): void
    {
        $user = User::factory()->create([
            'email' => 'test-slug@example.com',
            'password' => bcrypt('password123'),
            'email_verified_at' => now(),
            'verified_at' => now(),
        ]);

        $landing = Landing::factory()->create([
            'user_id' => $user->id,
            'slug' => 'my-unique-slug',
        ]);

        $response = $this->post('/auth/login', [
            'identifier' => 'my-unique-slug',
            'password' => 'password123',
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertAuthenticated();
    }

    /**
     * Test users can login with landing domain_name as identifier.
     */
    public function test_users_can_login_with_landing_domain_name(): void
    {
        $user = User::factory()->create([
            'email' => 'test-domain@example.com',
            'password' => bcrypt('password123'),
            'email_verified_at' => now(),
            'verified_at' => now(),
        ]);

        $landing = Landing::factory()->create([
            'user_id' => $user->id,
            'slug' => 'other-slug',
            'domain_name' => 'custom-domain',
        ]);

        $response = $this->post('/auth/login', [
            'identifier' => 'custom-domain',
            'password' => 'password123',
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertAuthenticated();
    }

    /**
     * Test login fails with non-existent landing slug.
     */
    public function test_login_fails_with_nonexistent_slug(): void
    {
        $response = $this->post('/auth/login', [
            'identifier' => 'nonexistent-slug',
            'password' => 'password123',
        ]);

        $this->assertGuest();
    }

    /**
     * Test users cannot login with invalid credentials.
     */
    public function test_users_cannot_login_with_invalid_credentials(): void
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->post('/auth/login', [
            'identifier' => 'test@example.com',
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
    }

    /**
     * Test users can register with valid data.
     * Note: Registration requires username (linkea handle), email, password confirmation.
     * The username becomes the landing slug.
     */
    public function test_users_can_register(): void
    {
        $response = $this->post('/auth/register', [
            'username' => 'newuserhandle',
            'email' => 'newuser@gmail.com', // Using a real domain for DNS check
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('users', ['email' => 'newuser@gmail.com']);

        // Verify landing was created with the username as slug
        $this->assertDatabaseHas('landings', ['slug' => 'newuserhandle']);
    }

    /**
     * Test registration fails with invalid email domain.
     */
    public function test_registration_fails_with_invalid_email(): void
    {
        $response = $this->post('/auth/register', [
            'username' => 'testhandle',
            'email' => 'invalid@fakeinvaliddomainxxx.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        // Should have validation errors
        $this->assertDatabaseMissing('users', ['email' => 'invalid@fakeinvaliddomainxxx.com']);
    }

    /**
     * Test authenticated users can logout.
     */
    public function test_authenticated_users_can_logout(): void
    {
        $user = User::factory()->create([
            'email_verified_at' => now(),
        ]);

        $response = $this->actingAs($user)->post('/auth/logout');

        $this->assertGuest();
    }

    /**
     * Test verified email check page is accessible.
     */
    public function test_verify_email_page_requires_authentication(): void
    {
        $response = $this->get('/auth/verify-email');

        $response->assertRedirect('/auth/login');
    }

    /**
     * Test authenticated users can access verify email page.
     */
    public function test_authenticated_users_can_access_verify_email_page(): void
    {
        $user = User::factory()->unverified()->create([
            'verified_at' => null, // Not verified
        ]);

        $response = $this->actingAs($user)->get('/auth/verify-email');

        $response->assertStatus(200);
    }

    /**
     * Test verification notification can be resent.
     */
    public function test_verification_notification_can_be_resent(): void
    {
        $user = User::factory()->unverified()->create([
            'verified_at' => null,
        ]);

        $response = $this->actingAs($user)->post('/auth/verification-notification');

        // Should redirect back or return success
        $this->assertTrue(in_array($response->status(), [200, 302]));
    }

    /**
     * Test password reset link can be requested.
     */
    public function test_password_reset_link_can_be_requested(): void
    {
        $user = User::factory()->create([
            'email' => 'test-reset@gmail.com',
        ]);

        $response = $this->post('/auth/forgot-password', [
            'email' => 'test-reset@gmail.com',
        ]);

        // Should redirect or show success
        $this->assertTrue(in_array($response->status(), [200, 302]));
    }

    /**
     * Test setup username page requires authentication.
     */
    public function test_setup_username_page_requires_authentication(): void
    {
        $response = $this->get('/auth/setup-username');

        $response->assertRedirect('/auth/login');
    }

    /**
     * Test login validation requires identifier field.
     */
    public function test_login_requires_identifier_field(): void
    {
        $response = $this->post('/auth/login', [
            'email' => 'test@example.com', // Wrong field name
            'password' => 'password123',
        ]);

        $response->assertSessionHasErrors(['identifier']);
    }
}
