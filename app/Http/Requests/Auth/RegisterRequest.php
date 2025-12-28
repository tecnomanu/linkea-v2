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
            // This is the linkea handle (landing slug) - now renamed for clarity
            'username' => [
                'required',
                'string',
                new ValidHandle(), // Centralized validation from StringHelper
            ],
            'email' => [
                'required',
                'email:rfc,dns',  // Validates format and checks if domain exists
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
            $handle = StringHelper::normalizeHandle($this->input('username', ''));

            if (empty($handle)) {
                return;
            }

            // Check reserved slugs
            if (ReservedSlugs::isReserved($handle)) {
                $validator->errors()->add('username', 'Este nombre de usuario no esta disponible');
                return;
            }

            // Check collision with existing landing slugs (the only unique constraint)
            $existingLanding = Landing::where('slug', $handle)
                ->orWhere('domain_name', $handle)
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
            'email.required' => ResponseMessages::REQUIRED_FIELD,
            'email.email' => 'Este email no parece real. Verifica que este bien escrito.',
            'email.unique' => ResponseMessages::EMAIL_TAKEN,
            'password.required' => ResponseMessages::REQUIRED_FIELD,
            'password.min' => ResponseMessages::PASSWORD_MIN_LENGTH,
            'password.confirmed' => ResponseMessages::PASSWORDS_DONT_MATCH,
        ];
    }

    /**
     * Get normalized registration data.
     * 
     * Note: Frontend sends 'username' but we transform it to 'linkea_handle'
     * for the service to make it clear this is the landing slug.
     */
    public function toServiceFormat(): array
    {
        $data = $this->validated();
        $linkeaHandle = StringHelper::normalizeHandle($data['username']);

        return [
            'linkea_handle' => $linkeaHandle,
            'email' => strtolower($data['email']),
            'password' => $data['password'],
            'first_name' => $data['first_name'] ?? ucfirst($linkeaHandle),
            'last_name' => $data['last_name'] ?? '',
            'name' => isset($data['first_name'])
                ? trim($data['first_name'] . ' ' . ($data['last_name'] ?? ''))
                : ucfirst($linkeaHandle),
        ];
    }
}
