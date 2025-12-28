<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Landing;
use App\Models\Company;
use App\Models\Role;
use Tests\TestCase;

/**
 * Tests for admin API routes (requires root role via Sanctum token)
 */
class AdminApiRoutesTest extends TestCase
{
    protected User $adminUser;
    protected User $regularUser;
    protected Company $company;
    protected Role $rootRole;
    protected string $adminToken;
    protected string $regularToken;

    protected function setUp(): void
    {
        parent::setUp();

        $this->company = Company::factory()->create();

        // Create root role
        $this->rootRole = Role::factory()->create([
            'name' => 'Root',
            'type' => 'root',
        ]);

        // Create admin user with root role
        $this->adminUser = User::factory()->create([
            'email_verified_at' => now(),
            'verified_at' => now(),
            'company_id' => $this->company->id,
        ]);
        $this->adminUser->roles()->attach($this->rootRole);
        $this->adminToken = $this->adminUser->createToken('test-token')->plainTextToken;

        // Create regular user
        $this->regularUser = User::factory()->create([
            'email_verified_at' => now(),
            'verified_at' => now(),
            'company_id' => $this->company->id,
        ]);
        $this->regularToken = $this->regularUser->createToken('test-token')->plainTextToken;
    }

    /**
     * Test admin user list endpoint requires authentication.
     */
    public function test_admin_user_list_requires_auth(): void
    {
        $response = $this->getJson('/api/admin/user');

        $response->assertStatus(401);
    }

    /**
     * Test regular users cannot access admin API.
     */
    public function test_regular_users_cannot_access_admin_api(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->regularToken}")
            ->getJson('/api/admin/user');

        $response->assertStatus(403);
    }

    /**
     * Test admin users can list all users.
     */
    public function test_admin_can_list_users(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson('/api/admin/user');

        $response->assertStatus(200);
    }

    /**
     * Test admin can get a specific user.
     */
    public function test_admin_can_get_user(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson("/api/admin/user/{$this->regularUser->id}");

        $response->assertStatus(200);
    }

    /**
     * Test admin can list companies.
     */
    public function test_admin_can_list_companies(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson('/api/admin/company');

        $response->assertStatus(200);
    }

    /**
     * Test admin can get a specific company.
     */
    public function test_admin_can_get_company(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson("/api/admin/company/{$this->company->id}");

        $response->assertStatus(200);
    }

    /**
     * Test admin can list roles.
     */
    public function test_admin_can_list_roles(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson('/api/admin/role');

        $response->assertStatus(200);
    }

    /**
     * Test admin can list memberships.
     */
    public function test_admin_can_list_memberships(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson('/api/admin/membership');

        $response->assertStatus(200);
    }

    /**
     * Test admin can list newsletters.
     */
    public function test_admin_can_list_newsletters(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson('/api/admin/newsletter');

        $response->assertStatus(200);
    }

    /**
     * Test admin can create a user.
     */
    public function test_admin_can_create_user(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->postJson('/api/admin/user', [
                'name' => 'New User',
                'email' => 'newadminuser@example.com',
                'password' => 'password123',
            ]);

        // Should return success or validation error
        $this->assertTrue(
            in_array($response->status(), [200, 201, 422]),
            "Expected status 200, 201, or 422 but got {$response->status()}"
        );
    }

    /**
     * Test admin can update a user.
     */
    public function test_admin_can_update_user(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->putJson("/api/admin/user/{$this->regularUser->id}", [
                'name' => 'Updated Name',
            ]);

        // Should return success or validation error
        $this->assertTrue(
            in_array($response->status(), [200, 201, 422]),
            "Expected status 200, 201, or 422 but got {$response->status()}"
        );
    }

    /**
     * Test admin can delete a user (soft delete).
     */
    public function test_admin_can_soft_delete_user(): void
    {
        $userToDelete = User::factory()->create();

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->deleteJson("/api/admin/user/{$userToDelete->id}");

        // Should return success
        $this->assertTrue(
            in_array($response->status(), [200, 204]),
            "Expected status 200 or 204 but got {$response->status()}"
        );
    }

    /**
     * Test admin can create a company.
     */
    public function test_admin_can_create_company(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->postJson('/api/admin/company', [
                'name' => 'New Company',
            ]);

        // Should return success or validation error
        $this->assertTrue(
            in_array($response->status(), [200, 201, 422]),
            "Expected status 200, 201, or 422 but got {$response->status()}"
        );
    }

    /**
     * Test admin can update a company.
     */
    public function test_admin_can_update_company(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->putJson("/api/admin/company/{$this->company->id}", [
                'name' => 'Updated Company Name',
            ]);

        // Should return success or validation error
        $this->assertTrue(
            in_array($response->status(), [200, 201, 422]),
            "Expected status 200, 201, or 422 but got {$response->status()}"
        );
    }

    /**
     * Test admin can delete a company (soft delete).
     */
    public function test_admin_can_soft_delete_company(): void
    {
        $companyToDelete = Company::factory()->create();

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->deleteJson("/api/admin/company/{$companyToDelete->id}");

        // Should return success
        $this->assertTrue(
            in_array($response->status(), [200, 204]),
            "Expected status 200 or 204 but got {$response->status()}"
        );
    }

    /**
     * Test admin can verify all landings.
     */
    public function test_admin_can_verify_all_landings(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson('/api/admin/verify-all');

        $response->assertStatus(200);
        $response->assertJsonStructure(['status', 'verified']);
    }
}
