<?php

namespace App\Support;

use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Validator;

/**
 * Validation helper for manual validation outside FormRequests.
 */
final class ValidationHelper
{
    /**
     * Validate data against rules, throwing exception on failure.
     *
     * @throws HttpResponseException
     */
    public static function validate(mixed $request, array $rules, array $messages = []): array
    {
        $data = method_exists($request, 'all') ? $request->all() : $request;

        $validator = Validator::make($data, $rules, $messages);

        if ($validator->fails()) {
            throw new HttpResponseException(
                response()->json($validator->errors()->getMessages(), 422)
            );
        }

        return $validator->validated();
    }

    /**
     * Validate and return result without throwing.
     *
     * @return array{valid: bool, errors: array, data: array}
     */
    public static function check(mixed $data, array $rules, array $messages = []): array
    {
        $dataArray = is_array($data) ? $data : (method_exists($data, 'all') ? $data->all() : []);

        $validator = Validator::make($dataArray, $rules, $messages);

        return [
            'valid' => !$validator->fails(),
            'errors' => $validator->errors()->getMessages(),
            'data' => $validator->validated(),
        ];
    }
}
