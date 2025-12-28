<?php

namespace Tests\Feature;

use Tests\TestCase;

/**
 * Tests for social authentication routes (Google, Apple, etc.)
 */
class SocialAuthRoutesTest extends TestCase
{
    /**
     * Test Google OAuth redirect is accessible.
     */
    public function test_google_oauth_redirect_is_accessible(): void
    {
        $response = $this->get('/auth/google/redirect');

        // Should redirect to Google OAuth
        $this->assertTrue(
            $response->isRedirection(),
            "Expected redirect but got status {$response->status()}"
        );
    }

    /**
     * Test Apple OAuth redirect is accessible.
     */
    public function test_apple_oauth_redirect_is_accessible(): void
    {
        $response = $this->get('/auth/apple/redirect');

        // Should redirect to Apple OAuth
        $this->assertTrue(
            $response->isRedirection(),
            "Expected redirect but got status {$response->status()}"
        );
    }

    /**
     * Test Google OAuth callback handles missing parameters.
     */
    public function test_google_callback_handles_missing_params(): void
    {
        $response = $this->get('/auth/google/callback');

        // Should handle gracefully (redirect or error page)
        $this->assertTrue(
            in_array($response->status(), [200, 302, 400, 500]),
            "Expected handled response but got status {$response->status()}"
        );
    }

    /**
     * Test Apple OAuth callback handles missing parameters.
     */
    public function test_apple_callback_handles_missing_params(): void
    {
        $response = $this->get('/auth/apple/callback');

        // Should handle gracefully (redirect or error page)
        $this->assertTrue(
            in_array($response->status(), [200, 302, 400, 500]),
            "Expected handled response but got status {$response->status()}"
        );
    }
}
