<?php

namespace App\Http\Requests\Panel;

use App\Constants\ReservedSlugs;
use App\Constants\UserRoles;
use App\Support\Helpers\StringHelper;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SaveSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Normalize handle before validation runs.
     * This ensures Rule::unique searches for the correct value.
     */
    protected function prepareForValidation(): void
    {
        if ($this->has('handle') && $this->handle) {
            $this->merge([
                'handle' => StringHelper::normalizeHandle($this->handle),
            ]);
        }
    }

    public function rules(): array
    {
        $landingId = $this->route('landingId');

        return [
            'handle' => [
                'nullable',
                'string',
                'min:3',
                'max:30',
                'regex:/^[a-z0-9][a-z0-9._-]*[a-z0-9]$/i',
                // Check uniqueness in slug field (excluding current landing)
                Rule::unique('landings', 'slug')->ignore($landingId),
                // Check uniqueness in domain_name field (excluding current landing)
                Rule::unique('landings', 'domain_name')->ignore($landingId),
                // Custom validation for reserved slugs
                function ($attribute, $value, $fail) {
                    $this->validateHandleAvailability($value, $fail);
                },
            ],
            'seoTitle' => 'nullable|string|max:70',
            'seoDescription' => 'nullable|string|max:160',
            'googleAnalyticsId' => 'nullable|string|max:50',
            'facebookPixelId' => 'nullable|string|max:50',
            'isPrivate' => 'nullable|boolean',
        ];
    }

    /**
     * Custom validation for handle availability.
     * Checks reserved slugs (root can bypass).
     * Uniqueness is already handled by Rule::unique for slug and domain_name.
     */
    protected function validateHandleAvailability($value, $fail): void
    {
        if (!$value) {
            return;
        }

        $user = $this->user();
        $isRoot = $user && $user->hasRole(UserRoles::ROOT);

        // Check reserved slugs (root users can bypass)
        if (!$isRoot && ReservedSlugs::isReserved($value)) {
            $fail('Este nombre de usuario no esta disponible');
        }
    }

    public function messages(): array
    {
        return [
            'handle.regex' => 'Solo letras, numeros, guion (-), guion bajo (_) y punto (.)',
            'handle.unique' => 'Este nombre de usuario ya esta en uso',
            'handle.min' => 'Minimo 3 caracteres',
            'handle.max' => 'Maximo 30 caracteres',
        ];
    }

    /**
     * Transform to backend landing format
     */
    public function toServiceFormat(): array
    {
        $data = $this->validated();
        $handle = $data['handle'] ?? null;

        // Build meta object for SEO fields
        $meta = array_filter([
            'title' => $data['seoTitle'] ?? null,
            'description' => $data['seoDescription'] ?? null,
        ], fn($v) => $v !== null);

        // Build analytics object
        $analytics = array_filter([
            'google_code' => $data['googleAnalyticsId'] ?? null,
            'facebook_pixel' => $data['facebookPixelId'] ?? null,
        ], fn($v) => $v !== null);

        // Build options with structured sub-objects
        $options = [];
        if (!empty($meta)) {
            $options['meta'] = $meta;
        }
        if (!empty($analytics)) {
            $options['analytics'] = $analytics;
        }

        // Add boolean fields explicitly (they should always be set when present)
        if (array_key_exists('isPrivate', $data)) {
            $options['is_private'] = (bool) $data['isPrivate'];
        }

        return [
            'slug' => $handle,
            'options' => $options,
        ];
    }
}
