<?php

namespace App\Support\Helpers;

use Illuminate\Support\Str;

/**
 * String manipulation helper functions.
 */
final class StringHelper
{
    /**
     * Normalize username/handle (lowercase, remove @).
     */
    public static function normalizeHandle(string $handle): string
    {
        return strtolower(ltrim($handle, '@'));
    }

    /**
     * Format handle with @ prefix.
     */
    public static function formatHandle(string $handle): string
    {
        $normalized = self::normalizeHandle($handle);
        return '@' . $normalized;
    }

    /**
     * Generate a slug from text.
     */
    public static function slugify(string $text): string
    {
        return Str::slug($text);
    }

    /**
     * Generate a safe filename.
     */
    public static function safeFilename(string $name): string
    {
        return Str::snake(Str::ascii($name));
    }

    /**
     * Truncate text with ellipsis.
     */
    public static function truncate(string $text, int $length = 100, string $end = '...'): string
    {
        return Str::limit($text, $length, $end);
    }
}
