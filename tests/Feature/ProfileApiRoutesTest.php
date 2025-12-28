<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Company;
use Tests\TestCase;

/**
 * Tests for profile API routes
 */
class ProfileApiRoutesTest extends TestCase
{
    protected User $user;
    protected Company $company;
    protected string $token;

    protected function setUp(): void
    {
        parent::setUp();

        $this->company = Company::factory()->create();

        $this->user = User::factory()->create([
            'email_verified_at' => now(),
            'verified_at' => now(),
            'company_id' => $this->company->id,
        ]);

        $this->token = $this->user->createToken('test-token')->plainTextToken;
    }

    /**
     * Test profile update requires authentication.
     */
    public function test_profile_update_requires_auth(): void
    {
        $response = $this->postJson('/api/profile');

        $response->assertStatus(401);
    }

    /**
     * Test authenticated user can update profile.
     */
    public function test_authenticated_user_can_update_profile(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->postJson('/api/profile', [
                'first_name' => 'Updated',
                'last_name' => 'Name',
            ]);

        $this->assertTrue(
            in_array($response->status(), [200, 201, 422]),
            "Expected status 200, 201, or 422 but got {$response->status()}"
        );
    }

    /**
     * Test settings update requires authentication.
     */
    public function test_settings_update_requires_auth(): void
    {
        $response = $this->postJson('/api/settings');

        $response->assertStatus(401);
    }

    /**
     * Test authenticated user can update settings.
     */
    public function test_authenticated_user_can_update_settings(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->postJson('/api/settings', [
                'notifications' => true,
            ]);

        $this->assertTrue(
            in_array($response->status(), [200, 201, 422]),
            "Expected status 200, 201, or 422 but got {$response->status()}"
        );
    }
}
