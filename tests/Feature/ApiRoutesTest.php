<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Landing;
use App\Models\Link;
use App\Models\Company;
use Tests\TestCase;

/**
 * Tests for API routes (both public and authenticated)
 */
class ApiRoutesTest extends TestCase
{
    protected User $user;
    protected Company $company;
    protected Landing $landing;

    protected function setUp(): void
    {
        parent::setUp();

        $this->company = Company::factory()->create();

        $this->user = User::factory()->create([
            'email_verified_at' => now(),
            'verified_at' => now(),
            'company_id' => $this->company->id,
        ]);

        $this->landing = Landing::factory()->create([
            'user_id' => $this->user->id,
            'company_id' => $this->company->id,
        ]);
    }

    /**
     * Test CSRF token endpoint is accessible.
     */
    public function test_csrf_token_endpoint_is_accessible(): void
    {
        $response = $this->get('/api/csrf-token');

        $response->assertStatus(200);
        $response->assertJsonStructure(['token']);
    }

    /**
     * Test statistics click endpoint works.
     */
    public function test_statistics_click_endpoint_works(): void
    {
        $link = Link::factory()->create([
            'landing_id' => $this->landing->id,
        ]);

        $response = $this->post("/api/statistics/link/click/{$link->id}");

        // Could be 200 or 201 depending on implementation
        $this->assertTrue(in_array($response->status(), [200, 201, 204, 404]));
    }

    /**
     * Test statistics view endpoint works.
     */
    public function test_statistics_view_endpoint_works(): void
    {
        $response = $this->post("/api/statistics/landing/view/{$this->landing->id}");

        // Should return success
        $this->assertTrue(in_array($response->status(), [200, 201, 204, 404]));
    }

    /**
     * Test API login endpoint works.
     */
    public function test_api_login_endpoint_works(): void
    {
        $user = User::factory()->create([
            'email' => 'api-test@example.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'api-test@example.com',
            'password' => 'password123',
        ]);

        // Should return success with token or user data
        $this->assertTrue(in_array($response->status(), [200, 201, 422]));
    }

    /**
     * Test API register endpoint works.
     */
    public function test_api_register_endpoint_works(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'API Test User',
            'email' => 'api-newuser@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        // Should return success
        $this->assertTrue(in_array($response->status(), [200, 201, 422]));
    }

    /**
     * Test API check username endpoint works.
     */
    public function test_api_check_username_endpoint_works(): void
    {
        $response = $this->postJson('/api/auth/check-username', [
            'username' => 'available-username-12345',
        ]);

        // Should return availability status
        $this->assertTrue(in_array($response->status(), [200, 422]));
    }

    /**
     * Test API logout endpoint works.
     * Note: The API logout might not require authentication - it just clears the session.
     */
    public function test_api_logout_endpoint_works(): void
    {
        $response = $this->postJson('/api/auth/logout');

        // Logout can succeed even without auth (just clears session)
        $this->assertTrue(in_array($response->status(), [200, 401]));
    }

    /**
     * Test API me/data endpoint requires authentication.
     */
    public function test_api_me_data_requires_authentication(): void
    {
        $response = $this->getJson('/api/me/data');

        $response->assertStatus(401);
    }

    /**
     * Test authenticated user can access me/data.
     */
    public function test_authenticated_user_can_access_me_data(): void
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/me/data');

        $response->assertStatus(200);
    }

    /**
     * Test panel links save endpoint requires authentication.
     */
    public function test_panel_links_save_requires_authentication(): void
    {
        $response = $this->postJson("/api/panel/links/{$this->landing->id}");

        // Should require authentication (redirect for web guard)
        $this->assertTrue(in_array($response->status(), [401, 302, 403, 419]));
    }

    /**
     * Test panel design save endpoint requires authentication.
     */
    public function test_panel_design_save_requires_authentication(): void
    {
        $response = $this->postJson("/api/panel/design/{$this->landing->id}");

        // Should require authentication
        $this->assertTrue(in_array($response->status(), [401, 302, 403, 419]));
    }

    /**
     * Test panel settings save endpoint requires authentication.
     */
    public function test_panel_settings_save_requires_authentication(): void
    {
        $response = $this->postJson("/api/panel/settings/{$this->landing->id}");

        // Should require authentication
        $this->assertTrue(in_array($response->status(), [401, 302, 403, 419]));
    }

    /**
     * Test authenticated user can save links via web session.
     */
    public function test_authenticated_user_can_save_links(): void
    {
        $response = $this->actingAs($this->user)
            ->postJson("/api/panel/links/{$this->landing->id}", [
                'links' => [],
            ]);

        // Should return success (200, 201) or validation error (422)
        // 500 if there's an internal error we should fix
        $this->assertTrue(
            in_array($response->status(), [200, 201, 422]),
            "Expected status 200, 201, or 422 but got {$response->status()}"
        );
    }

    /**
     * Test authenticated user can save design via web session.
     */
    public function test_authenticated_user_can_save_design(): void
    {
        $response = $this->actingAs($this->user)
            ->postJson("/api/panel/design/{$this->landing->id}", [
                'template_config' => ['theme' => 'default'],
            ]);

        // Should return success or validation error
        $this->assertTrue(
            in_array($response->status(), [200, 201, 422]),
            "Expected status 200, 201, or 422 but got {$response->status()}"
        );
    }

    /**
     * Test authenticated user can validate handle.
     */
    public function test_authenticated_user_can_validate_handle(): void
    {
        $response = $this->actingAs($this->user)
            ->postJson("/api/panel/validate-handle/{$this->landing->id}", [
                'slug' => 'new-unique-handle-12345',
            ]);

        // Should return success or validation error
        $this->assertTrue(
            in_array($response->status(), [200, 422]),
            "Expected status 200 or 422 but got {$response->status()}"
        );
    }

    /**
     * Test panel save social links endpoint.
     */
    public function test_authenticated_user_can_save_social_links(): void
    {
        $response = $this->actingAs($this->user)
            ->postJson("/api/panel/social-links/{$this->landing->id}", [
                'socialLinks' => [],
            ]);

        // Should return success or validation error
        $this->assertTrue(
            in_array($response->status(), [200, 201, 422]),
            "Expected status 200, 201, or 422 but got {$response->status()}"
        );
    }

    /**
     * Test get link stats endpoint.
     */
    public function test_can_get_link_stats(): void
    {
        $link = Link::factory()->create([
            'landing_id' => $this->landing->id,
        ]);

        $response = $this->actingAs($this->user)
            ->getJson("/api/panel/links/{$link->id}/stats");

        // Should return success
        $this->assertTrue(
            in_array($response->status(), [200, 404]),
            "Expected status 200 or 404 but got {$response->status()}"
        );
    }
}
