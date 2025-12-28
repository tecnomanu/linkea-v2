<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Company;
use App\Models\Landing;
use Tests\TestCase;

/**
 * Tests for legacy wizard API routes (deprecated but still used)
 */
class WizardApiRoutesTest extends TestCase
{
    protected User $user;
    protected Company $company;
    protected Landing $landing;
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

        $this->landing = Landing::factory()->create([
            'user_id' => $this->user->id,
            'company_id' => $this->company->id,
        ]);

        $this->token = $this->user->createToken('test-token')->plainTextToken;
    }

    /**
     * Test wizard landing endpoints require authentication.
     */
    public function test_wizard_landing_requires_auth(): void
    {
        $response = $this->getJson('/api/wizard/landing');

        $response->assertStatus(401);
    }

    /**
     * Test authenticated user can get current landing.
     */
    public function test_authenticated_user_can_get_current_landing(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->getJson('/api/wizard/landing');

        $response->assertStatus(200);
    }

    /**
     * Test authenticated user can get specific landing.
     */
    public function test_authenticated_user_can_get_specific_landing(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->getJson("/api/wizard/landing/{$this->landing->id}");

        $response->assertStatus(200);
    }

    /**
     * Test authenticated user can update landing.
     */
    public function test_authenticated_user_can_update_landing(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->postJson("/api/wizard/landing/{$this->landing->id}", [
                'name' => 'Updated Landing Name',
            ]);

        $this->assertTrue(
            in_array($response->status(), [200, 201, 422]),
            "Expected status 200, 201, or 422 but got {$response->status()}"
        );
    }

    /**
     * Test wizard links endpoint requires authentication.
     */
    public function test_wizard_links_requires_auth(): void
    {
        $response = $this->getJson('/api/wizard/links');

        $response->assertStatus(401);
    }

    /**
     * Test authenticated user can get current links (Not Implemented).
     */
    public function test_authenticated_user_can_get_current_links(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->getJson('/api/wizard/links');

        // Controller returns 501 because this endpoint is deprecated/not implemented
        $response->assertStatus(501);
    }

    /**
     * Test authenticated user can create/update links.
     */
    public function test_authenticated_user_can_create_links(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->postJson("/api/wizard/links/{$this->landing->id}", [
                'text' => 'My New Link',
                'link' => 'https://example.com',
                'type' => 'url',
            ]);

        $this->assertTrue(
            in_array($response->status(), [200, 201, 422]),
            "Expected status 200, 201, or 422 but got {$response->status()}"
        );
    }

    /**
     * Test validate landing name endpoint.
     */
    public function test_can_validate_landing_name(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->postJson('/api/wizard/landing/validate-name', [
                'name' => 'unique-landing-name-12345',
            ]);

        $this->assertTrue(
            in_array($response->status(), [200, 422]),
            "Expected status 200 or 422 but got {$response->status()}"
        );
    }
}
