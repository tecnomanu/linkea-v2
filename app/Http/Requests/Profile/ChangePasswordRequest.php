<?php

namespace App\Http\Requests\Profile;

use App\Constants\ResponseMessages;
use Illuminate\Foundation\Http\FormRequest;

class ChangePasswordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
            'password_confirmation' => 'required|string',
        ];
    }

    public function messages(): array
    {
        return [
            'current_password.required' => ResponseMessages::REQUIRED_FIELD,
            'password.required' => ResponseMessages::REQUIRED_FIELD,
            'password.min' => ResponseMessages::PASSWORD_MIN_LENGTH,
            'password.confirmed' => ResponseMessages::PASSWORDS_DONT_MATCH,
        ];
    }
}
