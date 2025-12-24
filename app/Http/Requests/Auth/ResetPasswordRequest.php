<?php

namespace App\Http\Requests\Auth;

use App\Constants\ResponseMessages;
use Illuminate\Foundation\Http\FormRequest;

class ResetPasswordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'reset_token' => 'required|string',
            'password' => 'required|string|min:8',
            'confirmPassword' => 'required|string|same:password',
        ];
    }

    public function messages(): array
    {
        return [
            'reset_token.required' => 'Token requerido',
            'password.required' => ResponseMessages::REQUIRED_FIELD,
            'password.min' => ResponseMessages::PASSWORD_MIN_LENGTH,
            'confirmPassword.required' => ResponseMessages::REQUIRED_FIELD,
            'confirmPassword.same' => ResponseMessages::PASSWORDS_DONT_MATCH,
        ];
    }
}
