<?php

namespace App\Constants;

/**
 * Default theme configuration (Atardecer/Sunset).
 * 
 * Single source of truth for default landing appearance.
 * Used by:
 * - LandingService::createDefault() - new landings
 * - BaseLandingResource - fallback values for existing landings
 * 
 * Frontend reads this via Inertia, no need for duplicate constants.
 */
class ThemeDefaults
{
    // Theme identifier
    public const THEME_NAME = 'sunset';

    // Background
    public const BACKGROUND_COLOR = '#fed7aa';
    public const BACKGROUND_GRADIENT = 'linear-gradient(to bottom right, #fed7aa, #fecdd3)';

    // Text
    public const TEXT_COLOR = '#1f2937';

    // Buttons
    public const BUTTON_STYLE = 'soft';
    public const BUTTON_SHAPE = 'pill';
    public const BUTTON_SIZE = 'compact';
    public const BUTTON_COLOR = '#ea580c';
    public const BUTTON_HOVER_COLOR = '#c2410c';
    public const BUTTON_TEXT_COLOR = '#ffffff';
    public const BUTTON_ICON_ALIGNMENT = 'left';
    public const SHOW_BUTTON_ICONS = true;
    public const SHOW_LINK_SUBTEXT = true;

    // Typography
    public const FONT_PAIR = 'modern';

    // Avatar/Header
    public const AVATAR_ROUNDED = true;
    public const AVATAR_FLOATING = true;

    /**
     * Get full background config array.
     */
    public static function background(): array
    {
        return [
            'backDropState' => false,
            'backDropColor' => 'rgba(255,255,255,0)',
            'backgroundColor' => self::BACKGROUND_COLOR,
            'background' => self::BACKGROUND_GRADIENT,
            'bgName' => self::THEME_NAME,
        ];
    }

    /**
     * Get full buttons config array.
     */
    public static function buttons(): array
    {
        return [
            'style' => self::BUTTON_STYLE,
            'shape' => self::BUTTON_SHAPE,
            'size' => self::BUTTON_SIZE,
            'backgroundColor' => self::BUTTON_COLOR,
            'backgroundHoverColor' => self::BUTTON_HOVER_COLOR,
            'textColor' => self::BUTTON_TEXT_COLOR,
            'textHoverColor' => self::BUTTON_TEXT_COLOR,
            'showIcons' => self::SHOW_BUTTON_ICONS,
            'iconAlignment' => self::BUTTON_ICON_ALIGNMENT,
        ];
    }

    /**
     * Get full template_config for new landing.
     */
    public static function templateConfig(string $username): array
    {
        return [
            'image_rounded' => self::AVATAR_ROUNDED,
            'image_floating' => self::AVATAR_FLOATING,
            'title' => '@' . $username,
            'subtitle' => '',
            'background' => self::background(),
            'textColor' => self::TEXT_COLOR,
            'buttons' => self::buttons(),
            'fontPair' => self::FONT_PAIR,
            'showLinkSubtext' => self::SHOW_LINK_SUBTEXT,
            'icons' => [
                'show' => true,
                'position' => 'left',
                'size' => 10,
            ],
            'socials' => [
                'show' => true,
                'position' => 'top',
            ],
        ];
    }
}
