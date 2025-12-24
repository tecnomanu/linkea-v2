<?php

namespace App\Http\Requests\Panel;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SaveSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'handle' => [
                'nullable',
                'string',
                'max:50',
                'regex:/^@?[a-zA-Z0-9_]+$/',
                Rule::unique('landings', 'slug')->ignore(
                    $this->route('landingId')
                ),
            ],
            'seoTitle' => 'nullable|string|max:70',
            'seoDescription' => 'nullable|string|max:160',
            'googleAnalyticsId' => 'nullable|string|max:50',
            'facebookPixelId' => 'nullable|string|max:50',
            'isPrivate' => 'nullable|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'handle.regex' => 'Username can only contain letters, numbers and underscores',
            'handle.unique' => 'This username is already taken',
        ];
    }

    /**
     * Transform to backend landing format
     */
    public function toServiceFormat(): array
    {
        $data = $this->validated();
        $handle = $data['handle'] ?? null;

        // Remove @ prefix if present
        if ($handle && str_starts_with($handle, '@')) {
            $handle = substr($handle, 1);
        }

        return [
            'slug' => $handle,
            'options' => array_filter([
                'title' => $data['seoTitle'] ?? null,
                'description' => $data['seoDescription'] ?? null,
                'google_analytics_id' => $data['googleAnalyticsId'] ?? null,
                'facebook_pixel_id' => $data['facebookPixelId'] ?? null,
                'is_private' => $data['isPrivate'] ?? false,
            ]),
        ];
    }
}
