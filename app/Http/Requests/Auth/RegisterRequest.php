<?php

namespace App\Http\Requests\Auth;

use App\Constants\ReservedSlugs;
use App\Constants\ResponseMessages;
use App\Models\Landing;
use App\Rules\ValidHandle;
use App\Support\Helpers\StringHelper;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

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
                'unique:users',
                new ValidHandle(), // Centralized validation from StringHelper
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

    /**
     * Additional validation after standard rules.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $username = StringHelper::normalizeHandle($this->input('username', ''));

            if (empty($username)) {
                return;
            }

            // Check reserved slugs
            if (ReservedSlugs::isReserved($username)) {
                $validator->errors()->add('username', 'Este nombre de usuario no esta disponible');
                return;
            }

            // Check collision with existing landing slugs
            $existingLanding = Landing::where('slug', $username)
                ->orWhere('domain_name', $username)
                ->exists();

            if ($existingLanding) {
                $validator->errors()->add('username', ResponseMessages::USERNAME_TAKEN);
            }
        });
    }

    public function messages(): array
    {
        return [
            'username.required' => ResponseMessages::REQUIRED_FIELD,
            'username.unique' => ResponseMessages::USERNAME_TAKEN,
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
        $username = StringHelper::normalizeHandle($data['username']);

        return [
            'username' => $username,
            'email' => strtolower($data['email']),
            'password' => $data['password'],
            'first_name' => $data['first_name'] ?? ucfirst($username),
            'last_name' => $data['last_name'] ?? '',
            'name' => isset($data['first_name'])
                ? trim($data['first_name'] . ' ' . ($data['last_name'] ?? ''))
                : ucfirst($username),
        ];
    }
}
