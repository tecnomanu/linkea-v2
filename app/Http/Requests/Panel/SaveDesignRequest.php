<?php

namespace App\Http\Requests\Panel;

use Illuminate\Foundation\Http\FormRequest;

class SaveDesignRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'nullable|string|max:100',
            'bio' => 'nullable|string|max:500',
            'avatar' => 'nullable|string', // Can be base64 image (large)
            'theme' => 'nullable|string|max:50',
            'customDesign' => 'nullable|array',
            'customDesign.backgroundColor' => 'nullable|string|max:50',
            'customDesign.backgroundImage' => 'nullable|string', // SVG data URL can be very large
            'customDesign.backgroundProps' => 'nullable|array', // Legacy bg editor props (colors, opacity, scale)
            'customDesign.backgroundControls' => 'nullable|array', // Legacy bg editor controls config
            'customDesign.buttonStyle' => 'nullable|string|in:solid,outline,soft,hard',
            'customDesign.buttonShape' => 'nullable|string|in:sharp,rounded,pill',
            'customDesign.buttonColor' => 'nullable|string|max:50',
            'customDesign.buttonTextColor' => 'nullable|string|max:50',
            'customDesign.fontPair' => 'nullable|string|in:modern,elegant,mono',
            'customDesign.roundedAvatar' => 'nullable|boolean',
        ];
    }

    /**
     * Transform to backend landing format
     */
    public function toServiceFormat(): array
    {
        $data = $this->validated();
        $customDesign = $data['customDesign'] ?? [];

        // Build background config
        $backgroundConfig = [
            'bgName' => $data['theme'] ?? 'custom',
            'backgroundColor' => $customDesign['backgroundColor'] ?? '#ffffff',
        ];
        
        // Include backgroundImage if provided (SVG patterns, gradients, etc.)
        if (isset($customDesign['backgroundImage']) && $customDesign['backgroundImage']) {
            $backgroundConfig['backgroundImage'] = $customDesign['backgroundImage'];
            // Also set common background properties for legacy compatibility
            $backgroundConfig['backgroundAttachment'] = 'fixed';
            $backgroundConfig['backgroundSize'] = 'cover';
            $backgroundConfig['backgroundPosition'] = 'center';
        }

        // Include legacy background editor props and controls
        if (isset($customDesign['backgroundProps']) && is_array($customDesign['backgroundProps'])) {
            $backgroundConfig['props'] = $customDesign['backgroundProps'];
        }
        if (isset($customDesign['backgroundControls']) && is_array($customDesign['backgroundControls'])) {
            $backgroundConfig['controls'] = $customDesign['backgroundControls'];
        }

        $result = [
            'name' => $data['name'] ?? null,
            'options' => array_filter([
                'bio' => $data['bio'] ?? null,
            ]),
            'template_config' => [
                'background' => $backgroundConfig,
                'buttons' => array_filter([
                    'style' => $customDesign['buttonStyle'] ?? null,
                    'shape' => $customDesign['buttonShape'] ?? null,
                    'backgroundColor' => $customDesign['buttonColor'] ?? null,
                    'textColor' => $customDesign['buttonTextColor'] ?? null,
                ]),
                'typography' => array_filter([
                    'fontPair' => $customDesign['fontPair'] ?? null,
                ]),
                'header' => [
                    'roundedAvatar' => $customDesign['roundedAvatar'] ?? true,
                ],
            ],
        ];

        // Handle avatar - only include logo if avatar is explicitly provided
        // This prevents clearing the logo when user only changes other design options
        $avatar = $data['avatar'] ?? null;
        if ($avatar !== null && $avatar !== '') {
            // If base64 or URL, store it
            $result['logo'] = ['image' => $avatar, 'thumb' => $avatar];
        }

        return $result;
    }
}
