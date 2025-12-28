<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Landing;
use App\Models\Company;
use App\Models\Role;
use Tests\TestCase;

/**
 * Tests for admin routes (requires root role)
 */
class AdminRoutesTest extends TestCase
{
    protected User $adminUser;
    protected User $regularUser;
    protected Company $adminCompany;
    protected Company $regularCompany;
    protected Role $rootRole;
    protected Role $userRole;

    protected function setUp(): void
    {
        parent::setUp();

        // Create roles
        $this->rootRole = Role::factory()->create([
            'name' => 'Root',
            'type' => 'root',
        ]);

        $this->userRole = Role::factory()->create([
            'name' => 'User',
            'type' => 'user',
        ]);

        // Create companies
        $this->adminCompany = Company::factory()->create();
        $this->regularCompany = Company::factory()->create();

        // Create admin user with root role AND company_id (setup completed)
        $this->adminUser = User::factory()->create([
            'email_verified_at' => now(),
            'verified_at' => now(),
            'company_id' => $this->adminCompany->id,
        ]);
        $this->adminUser->roles()->attach($this->rootRole);

        // Create regular user with company_id (setup completed)
        $this->regularUser = User::factory()->create([
            'email_verified_at' => now(),
            'verified_at' => now(),
            'company_id' => $this->regularCompany->id,
        ]);
        $this->regularUser->roles()->attach($this->userRole);
    }

    /**
     * Test admin dashboard requires authentication.
     */
    public function test_admin_dashboard_requires_authentication(): void
    {
        $response = $this->get('/admin');

        $response->assertRedirect('/auth/login');
    }

    /**
     * Test regular users are redirected to panel (they can't access admin).
     */
    public function test_regular_users_cannot_access_admin_dashboard(): void
    {
        $response = $this->actingAs($this->regularUser)->get('/admin');

        // Should redirect to panel with error (not 403)
        $response->assertRedirect('/panel');
    }

    /**
     * Test admin users can access admin dashboard.
     */
    public function test_admin_users_can_access_admin_dashboard(): void
    {
        $response = $this->actingAs($this->adminUser)->get('/admin');

        $response->assertStatus(200);
    }

    /**
     * Test admin landings page is accessible.
     */
    public function test_admin_users_can_access_landings_page(): void
    {
        $response = $this->actingAs($this->adminUser)->get('/admin/landings');

        $response->assertStatus(200);
    }

    /**
     * Test admin users page is accessible.
     */
    public function test_admin_users_can_access_users_page(): void
    {
        $response = $this->actingAs($this->adminUser)->get('/admin/users');

        $response->assertStatus(200);
    }

    /**
     * Test admin companies page is accessible.
     */
    public function test_admin_users_can_access_companies_page(): void
    {
        $response = $this->actingAs($this->adminUser)->get('/admin/companies');

        $response->assertStatus(200);
    }

    /**
     * Test admin newsletters page is accessible.
     */
    public function test_admin_users_can_access_newsletters_page(): void
    {
        $response = $this->actingAs($this->adminUser)->get('/admin/newsletters');

        $response->assertStatus(200);
    }

    /**
     * Test admin notifications page is accessible.
     */
    public function test_admin_users_can_access_notifications_page(): void
    {
        $response = $this->actingAs($this->adminUser)->get('/admin/notifications');

        $response->assertStatus(200);
    }

    /**
     * Test admin can delete a landing.
     */
    public function test_admin_can_delete_landing(): void
    {
        $landing = Landing::factory()->create([
            'user_id' => $this->regularUser->id,
        ]);

        $response = $this->actingAs($this->adminUser)
            ->delete("/admin/landings/{$landing->id}");

        $this->assertTrue(in_array($response->status(), [200, 302]));
    }

    /**
     * Test admin can delete a user.
     */
    public function test_admin_can_delete_user(): void
    {
        $userToDelete = User::factory()->create();

        $response = $this->actingAs($this->adminUser)
            ->delete("/admin/users/{$userToDelete->id}");

        $this->assertTrue(in_array($response->status(), [200, 302]));
    }

    /**
     * Test admin can delete a company.
     */
    public function test_admin_can_delete_company(): void
    {
        $company = Company::factory()->create();

        $response = $this->actingAs($this->adminUser)
            ->delete("/admin/companies/{$company->id}");

        $this->assertTrue(in_array($response->status(), [200, 302]));
    }

    /**
     * Test regular users are redirected when trying to delete landings.
     */
    public function test_regular_users_cannot_delete_landings(): void
    {
        $landing = Landing::factory()->create([
            'user_id' => $this->regularUser->id,
        ]);

        $response = $this->actingAs($this->regularUser)
            ->delete("/admin/landings/{$landing->id}");

        // Should redirect to panel (not 403)
        $response->assertRedirect('/panel');
    }
}
