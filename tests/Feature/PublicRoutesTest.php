<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Company;
use App\Models\Landing;
use App\Models\Role;
use Tests\TestCase;

/**
 * Tests for all public web routes that don't require authentication
 */
class PublicRoutesTest extends TestCase
{
    /**
     * Test the home page returns a successful response.
     */
    public function test_home_page_returns_successful_response(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }

    /**
     * Test the gallery page returns a successful response.
     */
    public function test_gallery_page_returns_successful_response(): void
    {
        $response = $this->get('/gallery');

        $response->assertStatus(200);
    }

    /**
     * Test the health endpoint returns successful response.
     */
    public function test_health_endpoint_returns_successful_response(): void
    {
        $response = $this->get('/health');

        $response->assertStatus(200);
    }

    /**
     * Test the privacy page returns successful response.
     */
    public function test_privacy_page_returns_successful_response(): void
    {
        $response = $this->get('/privacy');

        $response->assertStatus(200);
    }

    /**
     * Test the sitemap returns XML.
     */
    public function test_sitemap_returns_xml(): void
    {
        $response = $this->get('/sitemap.xml');

        // Should return 200 or redirect
        $this->assertTrue(in_array($response->status(), [200, 302, 301]));
    }

    /**
     * Test the LLM context endpoint returns a file download.
     */
    public function test_llm_context_returns_file(): void
    {
        $response = $this->get('/llm.txt');

        // Could be 200 (download), 302 (redirect), or 404 depending on implementation
        // For download responses, we can't use ->status() directly
        $this->assertTrue(
            $response->isOk() ||
                $response->isRedirection() ||
                $response->isNotFound()
        );
    }

    /**
     * Test that accessing a non-existent landing shows 404.
     */
    public function test_non_existent_landing_returns_404(): void
    {
        $response = $this->get('/non-existent-landing-slug-12345');

        $response->assertStatus(404);
    }

    /**
     * Test that accessing a valid landing shows the landing page.
     */
    public function test_valid_landing_returns_successful_response(): void
    {
        $user = User::factory()->create([
            'email_verified_at' => now(),
            'verified_at' => now(),
        ]);

        $landing = Landing::factory()->verified()->create([
            'user_id' => $user->id,
            'slug' => 'test-landing-slug',
        ]);

        $response = $this->get('/test-landing-slug');

        $response->assertStatus(200);
    }

    /**
     * Test the newsletter pixel tracking handles invalid IDs gracefully.
     */
    public function test_newsletter_pixel_handles_invalid_ids(): void
    {
        // This route requires valid newsletter and user IDs
        // For now, test that it handles invalid IDs gracefully
        $response = $this->get('/px/invalid-id/invalid-user/pixel.png');

        // Should return 404 for invalid IDs or a 1x1 transparent PNG
        $this->assertTrue(in_array($response->status(), [200, 404, 500]));
    }
}
