<?php

namespace App\Traits;

use App\Constants\ResponseMessages;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

/**
 * Provides standardized JSON response methods for API controllers.
 */
trait HasApiResponse
{
    protected function success(
        mixed $data = null,
        string $message = ResponseMessages::SUCCESS,
        int $status = Response::HTTP_OK
    ): JsonResponse {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $status);
    }

    protected function created(
        mixed $data = null,
        string $message = ResponseMessages::CREATED
    ): JsonResponse {
        return $this->success($data, $message, Response::HTTP_CREATED);
    }

    protected function error(
        string $message = ResponseMessages::SERVER_ERROR,
        int $status = Response::HTTP_INTERNAL_SERVER_ERROR,
        mixed $errors = null
    ): JsonResponse {
        $response = [
            'success' => false,
            'message' => $message,
        ];

        if ($errors !== null) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $status);
    }

    protected function notFound(string $message = ResponseMessages::NOT_FOUND): JsonResponse
    {
        return $this->error($message, Response::HTTP_NOT_FOUND);
    }

    protected function unauthorized(string $message = ResponseMessages::UNAUTHORIZED): JsonResponse
    {
        return $this->error($message, Response::HTTP_UNAUTHORIZED);
    }

    protected function forbidden(string $message = ResponseMessages::FORBIDDEN): JsonResponse
    {
        return $this->error($message, Response::HTTP_FORBIDDEN);
    }

    protected function validationError(
        mixed $errors,
        string $message = ResponseMessages::VALIDATION_ERROR
    ): JsonResponse {
        return $this->error($message, Response::HTTP_UNPROCESSABLE_ENTITY, $errors);
    }
}

