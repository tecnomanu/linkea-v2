<?php

namespace App\Http\Controllers\Api;

use App\Constants\ResponseMessages;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\RequestPasswordRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Http\Requests\Auth\VerifyEmailRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use App\Traits\HasApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    use HasApiResponse;

    public function __construct(
        protected AuthService $authService
    ) {}

    public function login(LoginRequest $request): JsonResponse
    {
        $result = $this->authService->login($request->credentials());

        if (!$result) {
            return $this->error(ResponseMessages::INVALID_CREDENTIALS, 404);
        }

        return $this->success([
            'token' => $result['token'],
            'user' => new UserResource($result['user']),
        ], ResponseMessages::LOGIN_SUCCESS);
    }

    public function register(RegisterRequest $request): JsonResponse
    {
        try {
            $result = $this->authService->register($request->toServiceFormat());

            return $this->created([
                'token' => $result['token'],
                'user' => new UserResource($result['user']),
            ], ResponseMessages::USER_REGISTERED);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    public function verifyEmail(VerifyEmailRequest $request): JsonResponse
    {
        $data = $request->validated();

        $verified = $this->authService->verifyEmail(
            $data['code'],
            $data['id'] ?? null
        );

        if (!$verified) {
            return $this->error(ResponseMessages::INVALID_VERIFICATION_CODE, 403);
        }

        return $this->success(['status' => 'valid'], ResponseMessages::EMAIL_VERIFIED);
    }

    public function requestPassword(RequestPasswordRequest $request): JsonResponse
    {
        $token = $this->authService->requestPasswordReset($request->input('email'));

        if (!$token) {
            return $this->error(ResponseMessages::USER_NOT_FOUND, 405);
        }

        // TODO: Send email notification with token
        // $user->notify(new SendTokenResetPassword($token));

        return $this->success(['status' => 'sent'], ResponseMessages::PASSWORD_RESET_SENT);
    }

    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        $data = $request->validated();

        $reset = $this->authService->resetPassword($data['reset_token'], $data['password']);

        if (!$reset) {
            return $this->error(ResponseMessages::PASSWORD_RESET_TOKEN_INVALID, 405);
        }

        return $this->success(['status' => 'sent'], ResponseMessages::PASSWORD_RESET_SUCCESS);
    }

    public function logout(Request $request): JsonResponse
    {
        if ($request->user()) {
            $this->authService->logout($request->user());
        }

        return $this->success(null, ResponseMessages::LOGOUT_SUCCESS);
    }
}
