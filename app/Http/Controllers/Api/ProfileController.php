<?php

namespace App\Http\Controllers\Api;

use App\Constants\ResponseMessages;
use App\Http\Controllers\Controller;
use App\Http\Requests\Profile\ChangePasswordRequest;
use App\Http\Requests\Profile\UpdateProfileRequest;
use App\Http\Requests\Profile\UpdateSettingsRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\UserService;
use App\Traits\HasApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    use HasApiResponse;

    public function __construct(
        protected UserService $userService
    ) {}

    public function get(): JsonResponse
    {
        /** @var User|null $user */
        $user = Auth::user();

        if (!$user) {
            return $this->unauthorized();
        }

        $userWithRelations = $this->userService->getWithRelations($user->id);

        return $this->success(new UserResource($userWithRelations));
    }

    public function update(UpdateProfileRequest $request): JsonResponse
    {
        /** @var User|null $user */
        $user = Auth::user();

        if (!$user) {
            return $this->unauthorized();
        }

        $updatedUser = $this->userService->updateProfile($user, $request->toServiceFormat());

        return $this->success(
            new UserResource($updatedUser),
            ResponseMessages::UPDATED
        );
    }

    public function changeSettings(UpdateSettingsRequest $request): JsonResponse
    {
        /** @var User|null $user */
        $user = Auth::user();

        if (!$user) {
            return $this->unauthorized();
        }

        $updatedUser = $this->userService->updateSettings($user, $request->getSettings());

        return $this->success(
            new UserResource($updatedUser),
            ResponseMessages::UPDATED
        );
    }

    public function changePassword(ChangePasswordRequest $request): JsonResponse
    {
        /** @var User|null $user */
        $user = Auth::user();

        if (!$user) {
            return $this->unauthorized();
        }

        $data = $request->validated();

        // Verify current password
        if (!$this->userService->verifyPassword($user, $data['current_password'])) {
            return $this->error('Contrasena actual incorrecta', 403);
        }

        $this->userService->changePassword($user, $data['password']);

        return $this->success(null, ResponseMessages::PASSWORD_RESET_SUCCESS);
    }
}
