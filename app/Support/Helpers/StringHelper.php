<?php

namespace App\Support\Helpers;

use Illuminate\Support\Str;

/**
 * String manipulation helper functions.
 */
final class StringHelper
{
    /**
     * Allowed characters for handles: a-z, 0-9, underscore, hyphen, dot.
     * - Cannot start or end with dot/hyphen
     * - No consecutive dots or special chars
     */
    public const HANDLE_PATTERN = '/^[a-z0-9_]([a-z0-9._-]*[a-z0-9_])?$/';
    public const HANDLE_MIN_LENGTH = 3;
    public const HANDLE_MAX_LENGTH = 30;

    /**
     * Normalize username/handle (lowercase, remove @).
     */
    public static function normalizeHandle(string $handle): string
    {
        return strtolower(ltrim($handle, '@'));
    }

    /**
     * Sanitize handle input - removes invalid characters.
     * Allowed: a-z, 0-9, _, -, .
     */
    public static function sanitizeHandle(string $handle): string
    {
        $normalized = self::normalizeHandle($handle);

        // Remove invalid chars (allow a-z, 0-9, _, -, .)
        $sanitized = preg_replace('/[^a-z0-9_.-]/', '', $normalized);

        // Remove consecutive special chars
        $sanitized = preg_replace('/-{2,}/', '-', $sanitized);
        $sanitized = preg_replace('/_{2,}/', '_', $sanitized);
        $sanitized = preg_replace('/\.{2,}/', '.', $sanitized);

        // Trim special chars from start/end and limit length
        return substr(trim($sanitized, '-_.'), 0, self::HANDLE_MAX_LENGTH);
    }

    /**
     * Validate handle format.
     * Returns array with 'valid' and 'message' keys.
     */
    public static function validateHandle(string $handle): array
    {
        $normalized = self::normalizeHandle($handle);

        if (empty($normalized)) {
            return ['valid' => false, 'message' => 'El nombre es requerido'];
        }

        if (strlen($normalized) < self::HANDLE_MIN_LENGTH) {
            return ['valid' => false, 'message' => 'Minimo ' . self::HANDLE_MIN_LENGTH . ' caracteres'];
        }

        if (strlen($normalized) > self::HANDLE_MAX_LENGTH) {
            return ['valid' => false, 'message' => 'Maximo ' . self::HANDLE_MAX_LENGTH . ' caracteres'];
        }

        if (!preg_match(self::HANDLE_PATTERN, $normalized)) {
            return ['valid' => false, 'message' => 'Solo letras, numeros, guion (-), guion bajo (_) y punto (.)'];
        }

        // No consecutive special chars
        if (preg_match('/[._-]{2,}/', $normalized)) {
            return ['valid' => false, 'message' => 'No se permiten caracteres especiales consecutivos'];
        }

        return ['valid' => true, 'message' => 'Formato valido'];
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
