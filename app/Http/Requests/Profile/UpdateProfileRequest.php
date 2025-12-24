<?php

namespace App\Http\Requests\Profile;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'nullable|string|max:255',
            'first_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'birthday' => 'nullable|date',
            'avatar' => 'nullable', // Can be string URL or array with base64
        ];
    }

    /**
     * Get filtered data for update (excludes protected fields).
     */
    public function toServiceFormat(): array
    {
        return $this->only(['name', 'first_name', 'last_name', 'birthday', 'avatar']);
    }
}
