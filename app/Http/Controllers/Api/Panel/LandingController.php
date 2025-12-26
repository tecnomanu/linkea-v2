<?php

namespace App\Http\Controllers\Api\Panel;

use App\Constants\ResponseMessages;
use App\Http\Controllers\Controller;
use App\Http\Requests\Panel\SaveDesignRequest;
use App\Http\Requests\Panel\SaveSettingsRequest;
use App\Http\Resources\LandingResource;
use App\Services\LandingService;
use App\Support\Helpers\StringHelper;
use App\Traits\AuthorizesLanding;
use App\Traits\HasApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Handles landing page data management for the Inertia/React panel.
 */
class LandingController extends Controller
{
    use HasApiResponse, AuthorizesLanding;

    public function __construct(
        protected LandingService $landingService
    ) {}

    /**
     * Save design/appearance settings.
     */
    public function saveDesign(SaveDesignRequest $request, string $landingId): JsonResponse
    {
        $landing = $this->getAuthorizedLanding($landingId);

        if (!$landing) {
            return $this->landingUnauthorizedResponse();
        }

        $updatedLanding = $this->landingService->updateDesign(
            $landing,
            $request->toServiceFormat()
        );

        return $this->success(
            ['landing' => new LandingResource($updatedLanding)],
            ResponseMessages::DESIGN_SAVED
        );
    }

    /**
     * Save general settings (SEO, handle, analytics, etc.).
     */
    public function saveSettings(SaveSettingsRequest $request, string $landingId): JsonResponse
    {
        $landing = $this->getAuthorizedLanding($landingId);

        if (!$landing) {
            return $this->landingUnauthorizedResponse();
        }

        $updatedLanding = $this->landingService->updateSettings(
            $landing,
            $request->toServiceFormat()
        );

        return $this->success(
            ['landing' => new LandingResource($updatedLanding)],
            ResponseMessages::SETTINGS_SAVED
        );
    }

    /**
     * Validate username/handle availability and format.
     */
    public function validateHandle(Request $request, string $landingId): JsonResponse
    {
        $handle = $request->input('handle');

        if (!$handle) {
            return $this->validationError(
                ['handle' => ResponseMessages::HANDLE_REQUIRED],
                ResponseMessages::HANDLE_REQUIRED
            );
        }

        // First validate format (no dots allowed, etc.)
        $formatValidation = StringHelper::validateHandle($handle);
        if (!$formatValidation['valid']) {
            return $this->success([
                'valid' => false,
                'message' => $formatValidation['message'],
            ]);
        }

        // Then check availability
        $normalizedHandle = StringHelper::normalizeHandle($handle);
        $isAvailable = $this->landingService->isHandleAvailable($normalizedHandle, $landingId);

        return $this->success([
            'valid' => $isAvailable,
            'message' => $isAvailable
                ? ResponseMessages::HANDLE_AVAILABLE
                : ResponseMessages::HANDLE_TAKEN,
        ]);
    }
}
