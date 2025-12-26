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
            // Title & Subtitle (stored in template_config)
            'title' => 'nullable|string|max:100',
            'subtitle' => 'nullable|string|max:500',
            'showTitle' => 'nullable|boolean', // Toggle to show/hide title
            'showSubtitle' => 'nullable|boolean', // Toggle to show/hide subtitle
            'avatar' => 'nullable|string', // Can be base64 image (large)
            'theme' => 'nullable|string|max:50',
            'customDesign' => 'nullable|array',
            // Background properties
            'customDesign.backgroundColor' => 'nullable|string|max:50',
            'customDesign.backgroundImage' => 'nullable|string', // SVG data URL can be very large
            'customDesign.backgroundEnabled' => 'nullable|boolean', // Switch to show/hide bg image
            'customDesign.backgroundSize' => 'nullable|string|max:50',
            'customDesign.backgroundPosition' => 'nullable|string|max:50',
            'customDesign.backgroundRepeat' => 'nullable|string|max:50',
            'customDesign.backgroundAttachment' => 'nullable|string|in:fixed,scroll',
            'customDesign.backgroundProps' => 'nullable|array', // Legacy bg editor props (kept for migration)
            'customDesign.backgroundControls' => 'nullable|array', // Legacy bg editor controls config
            // Button properties
            'customDesign.buttonStyle' => 'nullable|string|in:solid,outline,soft,hard',
            'customDesign.buttonShape' => 'nullable|string|in:sharp,rounded,pill',
            'customDesign.buttonSize' => 'nullable|string|in:compact,normal',
            'customDesign.buttonColor' => 'nullable|string|max:50',
            'customDesign.buttonTextColor' => 'nullable|string|max:50',
            'customDesign.buttonBorderColor' => 'nullable|string|max:50', // Optional separate border color
            'customDesign.showButtonIcons' => 'nullable|boolean',
            'customDesign.buttonIconAlignment' => 'nullable|string|in:left,inline,right',
            'customDesign.showLinkSubtext' => 'nullable|boolean',
            // Typography
            'customDesign.fontPair' => 'nullable|string|in:modern,elegant,mono',
            // Text color for page content (auto-calculated if not set)
            'customDesign.textColor' => 'nullable|string|max:50',
            'customDesign.roundedAvatar' => 'nullable|boolean',
            'customDesign.avatarFloating' => 'nullable|boolean', // Floating avatar with shadow (default: true)

            // Saved custom themes (max 2)
            'savedCustomThemes' => 'nullable|array|max:2',
            'savedCustomThemes.*.id' => 'required|string|max:50',
            'savedCustomThemes.*.name' => 'required|string|max:50',
            'savedCustomThemes.*.customDesign' => 'required|array',
            'savedCustomThemes.*.createdAt' => 'required|string',

            // Last custom design backup (for restore when switching back from preset)
            'lastCustomDesign' => 'nullable|array',
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
        // Image is always stored, backgroundEnabled controls visibility
        if (isset($customDesign['backgroundImage']) && $customDesign['backgroundImage']) {
            $backgroundConfig['backgroundImage'] = $customDesign['backgroundImage'];
            // Use provided values or defaults
            $backgroundConfig['backgroundSize'] = $customDesign['backgroundSize'] ?? 'cover';
            $backgroundConfig['backgroundPosition'] = $customDesign['backgroundPosition'] ?? 'center';
            $backgroundConfig['backgroundRepeat'] = $customDesign['backgroundRepeat'] ?? 'no-repeat';
            $backgroundConfig['backgroundAttachment'] = $customDesign['backgroundAttachment'] ?? 'scroll';
        }

        // Background enabled switch (defaults to true if image exists)
        if (isset($customDesign['backgroundEnabled'])) {
            $backgroundConfig['backgroundEnabled'] = $customDesign['backgroundEnabled'];
        }

        // Include legacy background editor props and controls (kept for migration)
        if (isset($customDesign['backgroundProps']) && is_array($customDesign['backgroundProps'])) {
            $backgroundConfig['props'] = $customDesign['backgroundProps'];
        }
        if (isset($customDesign['backgroundControls']) && is_array($customDesign['backgroundControls'])) {
            $backgroundConfig['controls'] = $customDesign['backgroundControls'];
        }

        // Build buttons config with icon options
        $buttonsConfig = array_filter([
            'style' => $customDesign['buttonStyle'] ?? null,
            'shape' => $customDesign['buttonShape'] ?? null,
            'size' => $customDesign['buttonSize'] ?? null,
            'backgroundColor' => $customDesign['buttonColor'] ?? null,
            'textColor' => $customDesign['buttonTextColor'] ?? null,
            'borderColor' => $customDesign['buttonBorderColor'] ?? null, // Separate border color
        ]);

        // Add icon options (use isset to preserve false/explicit values)
        if (isset($customDesign['showButtonIcons'])) {
            $buttonsConfig['showIcons'] = $customDesign['showButtonIcons'];
        }
        if (isset($customDesign['buttonIconAlignment'])) {
            $buttonsConfig['iconAlignment'] = $customDesign['buttonIconAlignment'];
        }

        // Build template_config with title, subtitle and their visibility toggles
        $templateConfig = [
            'background' => $backgroundConfig,
            'buttons' => $buttonsConfig,
            'fontPair' => $customDesign['fontPair'] ?? 'modern',
            // Text color for page content (legacy support)
            'textColor' => $customDesign['textColor'] ?? null,
            // Show link URLs/subtexts under button titles
            'showLinkSubtext' => $customDesign['showLinkSubtext'] ?? false,
            'header' => [
                'roundedAvatar' => $customDesign['roundedAvatar'] ?? true,
                'avatarFloating' => $customDesign['avatarFloating'] ?? true,
            ],
            // Saved custom themes (max 2 slots)
            'savedCustomThemes' => $data['savedCustomThemes'] ?? null,
            // Last custom design backup for restore
            'lastCustomDesign' => $data['lastCustomDesign'] ?? null,
        ];

        // Add title & subtitle to template_config (only if provided)
        if (array_key_exists('title', $data)) {
            $templateConfig['title'] = $data['title'];
        }
        if (array_key_exists('subtitle', $data)) {
            $templateConfig['subtitle'] = $data['subtitle'];
        }
        
        // Add visibility toggles to template_config
        if (array_key_exists('showTitle', $data)) {
            $templateConfig['showTitle'] = (bool) $data['showTitle'];
        }
        if (array_key_exists('showSubtitle', $data)) {
            $templateConfig['showSubtitle'] = (bool) $data['showSubtitle'];
        }

        $result = [
            'template_config' => $templateConfig,
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
