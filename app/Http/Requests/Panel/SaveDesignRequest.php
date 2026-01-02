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

        // Check if backgroundImage is base64 (needs upload) or URL (already uploaded)
        $backgroundImage = $customDesign['backgroundImage'] ?? null;
        $isBase64Background = $backgroundImage && str_starts_with($backgroundImage, 'data:image/');

        // Include backgroundImage if provided AND it's not base64
        // Base64 images will be processed later and uploaded to S3
        if ($backgroundImage && !$isBase64Background) {
            // It's a URL or already processed, store it directly
            $backgroundConfig['backgroundImage'] = $backgroundImage;
            // Use provided values or defaults
            $backgroundConfig['backgroundSize'] = $customDesign['backgroundSize'] ?? 'cover';
            $backgroundConfig['backgroundPosition'] = $customDesign['backgroundPosition'] ?? 'center';
            $backgroundConfig['backgroundRepeat'] = $customDesign['backgroundRepeat'] ?? 'no-repeat';
            $backgroundConfig['backgroundAttachment'] = $customDesign['backgroundAttachment'] ?? 'scroll';
        } elseif ($isBase64Background) {
            // Keep the properties but not the image (will be added after S3 upload)
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
        // We use a custom filter to preserve empty strings ("") which are valid (e.g. to clear a color),
        // but remove nulls (which mean "not updated").
        $buttonsConfigRaw = [
            'style' => $customDesign['buttonStyle'] ?? null,
            'shape' => $customDesign['buttonShape'] ?? null,
            'size' => $customDesign['buttonSize'] ?? null,
            'backgroundColor' => $customDesign['buttonColor'] ?? null,
            'textColor' => $customDesign['buttonTextColor'] ?? null,
            'borderColor' => $customDesign['buttonBorderColor'] ?? null,
        ];

        // Explicitly handle borderColor clearing: 
        // If the key exists in input but is null (or empty), we force it to "" 
        // to ensure it survives filtering and overwrites the DB value in mergeDeep.
        if (array_key_exists('buttonBorderColor', $customDesign) && empty($customDesign['buttonBorderColor'])) {
            $buttonsConfigRaw['borderColor'] = "";
        }

        $buttonsConfig = array_filter($buttonsConfigRaw, fn($v) => !is_null($v));

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
        // Note: Laravel's ConvertEmptyStringsToNull middleware converts "" to null,
        // so we use empty string as the value when null is received (user cleared the field)
        if (array_key_exists('title', $data)) {
            $templateConfig['title'] = $data['title'] ?? '';
        }
        if (array_key_exists('subtitle', $data)) {
            $templateConfig['subtitle'] = $data['subtitle'] ?? '';
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
            // If it's base64, format for upload to S3
            if (str_starts_with($avatar, 'data:image/')) {
                // Extract mime type from data URI
                preg_match('/data:image\/([a-zA-Z]+);/', $avatar, $matches);
                $type = 'image/' . ($matches[1] ?? 'png');
                $result['logo'] = [
                    'base64_image' => $avatar,
                    'type' => $type,
                ];
            } else {
                // It's already a URL, keep as is
                $result['logo'] = ['image' => $avatar, 'thumb' => $avatar];
            }
        }

        // Handle backgroundImage - process base64 images for upload to S3
        if ($isBase64Background) {
            // Extract mime type from data URI
            preg_match('/data:image\/([a-zA-Z]+);/', $backgroundImage, $matches);
            $type = 'image/' . ($matches[1] ?? 'jpeg');
            $result['background_image'] = [
                'base64_image' => $backgroundImage,
                'type' => $type,
            ];
            // Note: backgroundImage is NOT added to template_config when it's base64
            // It will be added after S3 upload by LandingService
        }

        return $result;
    }
}
