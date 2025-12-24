<?php

namespace App\Http\Requests\Auth;

use App\Constants\ResponseMessages;
use Illuminate\Foundation\Http\FormRequest;

class VerifyEmailRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'code' => 'required|string|size:6',
            'id' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'code.required' => ResponseMessages::REQUIRED_FIELD,
            'code.size' => 'El codigo debe tener 6 digitos',
        ];
    }
}
