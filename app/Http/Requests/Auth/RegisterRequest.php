<?php

namespace App\Http\Requests\Auth;

use App\Constants\ResponseMessages;
use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'username' => [
                'required',
                'string',
                'max:255',
                'min:5',
                'unique:users',
                'regex:/^[-a-z0-9_.]+$/',
            ],
            'email' => [
                'required',
                'email:rfc,dns',
                'max:255',
                'unique:users',
            ],
            'password' => 'required|string|confirmed|min:8',
            'password_confirmation' => 'required|string',
            'first_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'username.required' => ResponseMessages::REQUIRED_FIELD,
            'username.min' => ResponseMessages::USERNAME_MIN_LENGTH,
            'username.unique' => ResponseMessages::USERNAME_TAKEN,
            'username.regex' => 'El nombre de usuario solo puede contener letras, numeros, guiones y puntos',
            'email.required' => ResponseMessages::REQUIRED_FIELD,
            'email.email' => ResponseMessages::INVALID_EMAIL,
            'email.unique' => ResponseMessages::EMAIL_TAKEN,
            'password.required' => ResponseMessages::REQUIRED_FIELD,
            'password.min' => ResponseMessages::PASSWORD_MIN_LENGTH,
            'password.confirmed' => ResponseMessages::PASSWORDS_DONT_MATCH,
        ];
    }

    /**
     * Get normalized registration data.
     */
    public function toServiceFormat(): array
    {
        $data = $this->validated();

        return [
            'username' => strtolower($data['username']),
            'email' => strtolower($data['email']),
            'password' => $data['password'],
            'first_name' => $data['first_name'] ?? ucfirst($data['username']),
            'last_name' => $data['last_name'] ?? '',
            'name' => isset($data['first_name'])
                ? trim($data['first_name'] . ' ' . ($data['last_name'] ?? ''))
                : ucfirst($data['username']),
        ];
    }
}
