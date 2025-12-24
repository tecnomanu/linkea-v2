<?php

namespace App\Http\Requests\Profile;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'settings' => 'required|array',
            'settings.autoSave' => 'nullable|boolean',
            'settings.notifications' => 'nullable|boolean',
            'settings.theme' => 'nullable|string|in:light,dark,system',
            'settings.language' => 'nullable|string|in:es,en',
        ];
    }

    /**
     * Get settings array for service.
     */
    public function getSettings(): array
    {
        return $this->validated()['settings'] ?? [];
    }
}
