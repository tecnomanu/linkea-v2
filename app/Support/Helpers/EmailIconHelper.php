<?php

namespace App\Support\Helpers;

/**
 * Helper to generate PNG icon images for emails.
 * PNG images are required because Gmail and other email clients don't support SVG.
 */
class EmailIconHelper
{
    /**
     * Available icons (mapped to their PNG files).
     */
    private static array $icons = [
        'chart',
        'rocket',
        'eye',
        'link',
        'trending-up',
        'trending-down',
        'fire',
        'lightbulb',
        'minus',
    ];

    /**
     * Get an img tag for an icon.
     * 
     * @param string $name Icon name
     * @param int $size Size in pixels
     * @param string $color Not used for PNG (kept for compatibility)
     * @return string IMG tag markup
     */
    public static function get(string $name, int $size = 20, string $color = '#64748b'): string
    {
        if (!in_array($name, self::$icons)) {
            return '';
        }

        $url = asset("images/emails/icons/stats/{$name}.png");

        return '<img src="' . $url . '" alt="' . $name . '" width="' . $size . '" height="' . $size . '" style="display: inline-block; vertical-align: middle;" />';
    }

    /**
     * Get icon wrapped in a circle badge (for metrics).
     * 
     * @param string $name Icon name
     * @param string $bgColor Background color (hex)
     * @param string $iconColor Not used for PNG
     * @param int $size Total size in pixels
     * @return string HTML markup
     */
    public static function badge(string $name, string $bgColor = '#f97316', string $iconColor = '#ffffff', int $size = 32): string
    {
        $iconSize = (int)($size * 0.6);
        $icon = self::get($name, $iconSize, $iconColor);

        return <<<HTML
<div style="display: inline-flex; align-items: center; justify-content: center; width: {$size}px; height: {$size}px; background: {$bgColor}; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.15);">
    {$icon}
</div>
HTML;
    }

    /**
     * Get icon inline (for text).
     * 
     * @param string $name Icon name
     * @param int $size Size in pixels
     * @param string $color Not used for PNG
     * @return string HTML markup
     */
    public static function inline(string $name, int $size = 16, string $color = '#64748b'): string
    {
        return self::get($name, $size, $color);
    }
}
