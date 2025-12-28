<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Company;
use Tests\TestCase;

/**
 * Tests for notifications API routes
 */
class NotificationsApiRoutesTest extends TestCase
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
     * Test notifications endpoint requires authentication.
     */
    public function test_notifications_requires_auth(): void
    {
        $response = $this->getJson('/api/notifications');

        $response->assertStatus(401);
    }

    /**
     * Test authenticated user can get notifications.
     */
    public function test_authenticated_user_can_get_notifications(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->getJson('/api/notifications');

        $response->assertStatus(200);
    }

    /**
     * Test authenticated user can mark notifications as viewed.
     */
    public function test_authenticated_user_can_mark_viewed(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->postJson('/api/notifications/viewed');

        $this->assertTrue(
            in_array($response->status(), [200, 204]),
            "Expected status 200 or 204 but got {$response->status()}"
        );
    }

    /**
     * Test authenticated user can mark all notifications as read.
     */
    public function test_authenticated_user_can_mark_all_read(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->postJson('/api/notifications/read-all');

        $this->assertTrue(
            in_array($response->status(), [200, 204]),
            "Expected status 200 or 204 but got {$response->status()}"
        );
    }
}
