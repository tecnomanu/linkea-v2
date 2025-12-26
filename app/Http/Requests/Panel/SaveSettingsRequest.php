<?php

namespace App\Http\Requests\Panel;

use App\Constants\ReservedSlugs;
use App\Constants\UserRoles;
use App\Models\User;
use App\Support\Helpers\StringHelper;
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
                'min:3',
                'max:30',
                'regex:/^@?[a-z0-9][a-z0-9._-]*[a-z0-9]$/i',
                Rule::unique('landings', 'slug')->ignore(
                    $this->route('landingId')
                ),
                // Custom validation for reserved slugs and user collision
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
     * Checks reserved slugs (root can bypass) and user collision.
     */
    protected function validateHandleAvailability($value, $fail): void
    {
        if (!$value) {
            return;
        }

        $normalized = StringHelper::normalizeHandle($value);
        $user = $this->user();
        $isRoot = $user && $user->hasRole(UserRoles::ROOT);

        // Check reserved slugs (root users can bypass)
        if (!$isRoot && ReservedSlugs::isReserved($normalized)) {
            $fail('Este nombre de usuario no esta disponible');
            return;
        }

        // Check collision with existing usernames (excluding current user)
        $userQuery = User::where('username', $normalized);
        if ($user) {
            $userQuery->where('id', '!=', $user->id);
        }

        if ($userQuery->exists()) {
            $fail('Este nombre de usuario ya esta en uso');
            return;
        }

        // Check collision with domain_name in landings (different field than slug)
        $landingId = $this->route('landingId');
        $domainExists = \App\Models\Landing::where('domain_name', $normalized)
            ->where('id', '!=', $landingId)
            ->exists();

        if ($domainExists) {
            $fail('Este nombre de usuario ya esta en uso');
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

        // Normalize handle (remove @ prefix, lowercase)
        if ($handle) {
            $handle = StringHelper::normalizeHandle($handle);
        }

        // Build meta object for SEO fields
        $meta = array_filter([
            'title' => $data['seoTitle'] ?? null,
            'description' => $data['seoDescription'] ?? null,
            // 'image' => $data['seoImage'] ?? null, // Future: custom OG image
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
