<?php

namespace App\Http\Requests\Auth;

use App\Constants\ResponseMessages;
use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'username' => 'required|string|max:255',
            'password' => 'required|string',
        ];
    }

    public function messages(): array
    {
        return [
            'username.required' => ResponseMessages::REQUIRED_FIELD,
            'password.required' => ResponseMessages::REQUIRED_FIELD,
        ];
    }

    /**
     * Get normalized credentials for authentication.
     */
    public function credentials(): array
    {
        return [
            'username' => strtolower($this->input('username')),
            'password' => $this->input('password'),
        ];
    }
}
