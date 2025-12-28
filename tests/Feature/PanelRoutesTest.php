<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Landing;
use App\Models\Company;
use App\Models\Role;
use Tests\TestCase;

/**
 * Tests for panel routes (authenticated user dashboard)
 */
class PanelRoutesTest extends TestCase
{
    protected User $user;
    protected Company $company;
    protected Landing $landing;

    protected function setUp(): void
    {
        parent::setUp();

        // Create a company first
        $this->company = Company::factory()->create();

        // Create a verified user with company (setup completed)
        $this->user = User::factory()->create([
            'email_verified_at' => now(),
            'verified_at' => now(),
            'company_id' => $this->company->id,
        ]);

        // Create a landing for the user
        $this->landing = Landing::factory()->create([
            'user_id' => $this->user->id,
            'company_id' => $this->company->id,
        ]);
    }

    /**
     * Test panel routes require authentication.
     */
    public function test_panel_requires_authentication(): void
    {
        $response = $this->get('/panel');

        $response->assertRedirect('/auth/login');
    }

    /**
     * Test panel links page requires authentication.
     */
    public function test_panel_links_requires_authentication(): void
    {
        $response = $this->get('/panel/links');

        $response->assertRedirect('/auth/login');
    }

    /**
     * Test panel design page requires authentication.
     */
    public function test_panel_design_requires_authentication(): void
    {
        $response = $this->get('/panel/design');

        $response->assertRedirect('/auth/login');
    }

    /**
     * Test panel settings page requires authentication.
     */
    public function test_panel_settings_requires_authentication(): void
    {
        $response = $this->get('/panel/settings');

        $response->assertRedirect('/auth/login');
    }

    /**
     * Test panel profile page requires authentication.
     */
    public function test_panel_profile_requires_authentication(): void
    {
        $response = $this->get('/panel/profile');

        $response->assertRedirect('/auth/login');
    }

    /**
     * Test authenticated user with completed setup can access panel dashboard.
     */
    public function test_authenticated_user_can_access_panel(): void
    {
        $response = $this->actingAs($this->user)->get('/panel');

        $response->assertStatus(200);
    }

    /**
     * Test authenticated user can access panel links page.
     */
    public function test_authenticated_user_can_access_panel_links(): void
    {
        $response = $this->actingAs($this->user)->get('/panel/links');

        $response->assertStatus(200);
    }

    /**
     * Test authenticated user can access panel design page.
     */
    public function test_authenticated_user_can_access_panel_design(): void
    {
        $response = $this->actingAs($this->user)->get('/panel/design');

        $response->assertStatus(200);
    }

    /**
     * Test authenticated user can access panel settings page.
     */
    public function test_authenticated_user_can_access_panel_settings(): void
    {
        $response = $this->actingAs($this->user)->get('/panel/settings');

        $response->assertStatus(200);
    }

    /**
     * Test authenticated user can access panel profile page.
     */
    public function test_authenticated_user_can_access_panel_profile(): void
    {
        $response = $this->actingAs($this->user)->get('/panel/profile');

        $response->assertStatus(200);
    }

    /**
     * Test user without company_id (incomplete setup) is redirected to setup.
     */
    public function test_user_without_company_redirected_to_setup(): void
    {
        $userWithoutCompany = User::factory()->create([
            'email_verified_at' => now(),
            'verified_at' => now(),
            'company_id' => null, // No company = setup incomplete
        ]);

        $response = $this->actingAs($userWithoutCompany)->get('/panel');

        // Should redirect to setup username page
        $response->assertRedirect('/auth/setup-username');
    }

    /**
     * Test unverified user is properly handled by middleware.
     * Note: EnsureSetupCompleted runs before verified middleware in web middleware stack
     */
    public function test_unverified_user_flow(): void
    {
        $unverifiedUser = User::factory()->create([
            'email_verified_at' => null,
            'verified_at' => null,
            'company_id' => null,
        ]);

        $response = $this->actingAs($unverifiedUser)->get('/panel');

        // Should redirect somewhere (either setup or verify)
        $response->assertRedirect();
    }
}
