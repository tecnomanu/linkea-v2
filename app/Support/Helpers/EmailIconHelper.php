<?php

namespace App\Support\Helpers;

/**
 * Helper to generate inline SVG icons for emails.
 * SVG icons are more reliable than external images in emails.
 */
class EmailIconHelper
{
    /**
     * Get an inline SVG icon by name.
     * 
     * @param string $name Icon name
     * @param int $size Size in pixels
     * @param string $color Icon color (hex)
     * @return string SVG markup
     */
    public static function get(string $name, int $size = 20, string $color = '#64748b'): string
    {
        $icons = [
            'chart' => '<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
            
            'rocket' => '<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>',
            
            'eye' => '<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
            
            'link' => '<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
            
            'trending-up' => '<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
            
            'trending-down' => '<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>',
            
            'fire' => '<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',
            
            'lightbulb' => '<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>',
            
            'minus' => '<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>',
        ];

        if (!isset($icons[$name])) {
            return '';
        }

        $svg = $icons[$name];
        $svg = str_replace('{size}', $size, $svg);
        $svg = str_replace('{color}', $color, $svg);

        return $svg;
    }

    /**
     * Get icon wrapped in a circle badge (for metrics).
     * 
     * @param string $name Icon name
     * @param string $bgColor Background color (hex)
     * @param string $iconColor Icon color (hex)
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
     * @param string $color Icon color (hex)
     * @return string HTML markup
     */
    public static function inline(string $name, int $size = 16, string $color = '#64748b'): string
    {
        $icon = self::get($name, $size, $color);
        return '<span style="display: inline-block; vertical-align: middle; margin-right: 4px;">' . $icon . '</span>';
    }
}

