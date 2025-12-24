<?php

namespace App\Traits;

use App\Constants\ResponseMessages;
use App\Models\Landing;
use Illuminate\Http\JsonResponse;

/**
 * Provides landing authorization methods for controllers.
 */
trait AuthorizesLanding
{
    /**
     * Get landing with ownership verification.
     * Returns null if not found or not authorized.
     */
    protected function getAuthorizedLanding(string $landingId, ?string $userId = null): ?Landing
    {
        $userId = $userId ?? auth()->id();

        if (!$userId) {
            return null;
        }

        $landing = Landing::find($landingId);

        if (!$landing || $landing->user_id !== $userId) {
            return null;
        }

        return $landing;
    }

    /**
     * Get landing by company ownership.
     */
    protected function getAuthorizedLandingByCompany(string $landingId, ?string $companyId = null): ?Landing
    {
        $companyId = $companyId ?? auth()->user()?->company_id;

        if (!$companyId) {
            return null;
        }

        $landing = Landing::find($landingId);

        if (!$landing || $landing->company_id !== $companyId) {
            return null;
        }

        return $landing;
    }

    /**
     * Return unauthorized response for landing access.
     */
    protected function landingUnauthorizedResponse(): JsonResponse
    {
        return response()->json([
            'message' => ResponseMessages::LANDING_NOT_FOUND,
        ], 403);
    }
}

