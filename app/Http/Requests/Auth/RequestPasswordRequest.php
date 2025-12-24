<?php

namespace App\Http\Requests\Auth;

use App\Constants\ResponseMessages;
use Illuminate\Foundation\Http\FormRequest;

class RequestPasswordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => 'required|email',
        ];
    }

    public function messages(): array
    {
        return [
            'email.required' => ResponseMessages::REQUIRED_FIELD,
            'email.email' => ResponseMessages::INVALID_EMAIL,
        ];
    }
}
