<?php

namespace App\Http\Controllers\Api;

use App\Constants\ResponseMessages;
use App\Http\Controllers\Controller;
use App\Http\Resources\LandingResource;
use App\Models\Landing;
use App\Models\User;
use App\Services\ImageService;
use App\Services\LandingService;
use App\Traits\AuthorizesLanding;
use App\Traits\HasApiResponse;
use App\Traits\RESTActions;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class LandingsController extends Controller
{
    use RESTActions, HasApiResponse, AuthorizesLanding;

    const MODEL = Landing::class;

    public function __construct(
        protected LandingService $landingService,
        protected ImageService $imageService
    ) {}

    /**
     * Get current user's landing.
     */
    public function current(): JsonResponse
    {
        /** @var User|null $user */
        $user = Auth::user();

        if (!$user) {
            return $this->unauthorized();
        }

        $landing = Landing::where('company_id', $user->company_id)
            ->with('links')
            ->first();

        if (!$landing) {
            return $this->notFound(ResponseMessages::LANDING_NOT_FOUND);
        }

        return $this->success(new LandingResource($landing));
    }

    /**
     * Update landing.
     */
    public function put(Request $request, string $id): JsonResponse
    {
        /** @var User|null $user */
        $user = Auth::user();

        if (!$user) {
            return $this->unauthorized();
        }

        $landing = $this->getAuthorizedLandingByCompany($id, $user->company_id);

        if (!$landing) {
            return $this->landingUnauthorizedResponse();
        }

        $type = $request->input('type');

        if ($type === 'template_config') {
            $this->handleTemplateConfigUpdate($request, $landing);
        }

        if ($type === 'options') {
            $this->handleOptionsUpdate($request, $landing);
        }

        // Generic update for other fields
        $fillableData = $request->only(['name', 'verify']);
        if (!empty($fillableData)) {
            $landing->update($fillableData);
        }

        return $this->success(
            new LandingResource($landing->fresh()),
            ResponseMessages::UPDATED
        );
    }

    /**
     * Validate landing name availability.
     */
    public function validateName(Request $request): JsonResponse
    {
        /** @var User|null $user */
        $user = Auth::user();

        if (!$user) {
            return $this->unauthorized();
        }

        $name = $request->input('name');

        if (!$name) {
            return $this->validationError(['name' => ResponseMessages::REQUIRED_FIELD]);
        }

        $isAvailable = $this->landingService->isHandleAvailable($name);

        if (!$isAvailable) {
            return $this->error(ResponseMessages::HANDLE_TAKEN, Response::HTTP_CONFLICT);
        }

        return $this->success(['status' => 'success'], ResponseMessages::HANDLE_AVAILABLE);
    }

    /**
     * Handle template_config type update.
     */
    protected function handleTemplateConfigUpdate(Request $request, Landing $landing): void
    {
        $updateData = [];

        // Handle logo upload
        $logo = $request->input('logo');
        if ($logo && is_array($logo) && isset($logo['base64_image'])) {
            $savedLogo = $this->imageService->saveLogo($logo, $landing->id);
            if ($savedLogo) {
                $updateData['logo'] = $savedLogo;
            }
        }

        // Handle template_config
        $templateConfig = $request->input('template_config');
        if ($templateConfig) {
            $updateData['template_config'] = $templateConfig;
        }

        if (!empty($updateData)) {
            $landing->update($updateData);
        }
    }

    /**
     * Handle options type update.
     */
    protected function handleOptionsUpdate(Request $request, Landing $landing): void
    {
        $updateData = [];

        $options = $request->input('options');
        if ($options) {
            $updateData['options'] = $options;
        }

        $domainName = $request->input('domain_name');
        if ($domainName) {
            $updateData['domain_name'] = $domainName;
            $updateData['slug'] = $domainName;
        }

        if (!empty($updateData)) {
            $landing->update($updateData);
        }
    }
}
