<?php

namespace App\Support\Helpers;

/**
 * Array manipulation helper functions.
 */
final class ArrayHelper
{
    /**
     * Deep merge two arrays recursively.
     * New values override original, but nested arrays are merged.
     */
    public static function mergeDeep(array $original, array $new): array
    {
        foreach ($new as $key => $value) {
            if (is_array($value) && isset($original[$key]) && is_array($original[$key])) {
                $original[$key] = self::mergeDeep($original[$key], $value);
            } elseif ($value !== null) {
                $original[$key] = $value;
            }
        }

        return $original;
    }

    /**
     * Filter null values from array (single level).
     */
    public static function filterNull(array $array): array
    {
        return array_filter($array, fn($value) => $value !== null);
    }

    /**
     * Get value from nested array using dot notation.
     */
    public static function get(array $array, string $key, mixed $default = null): mixed
    {
        $keys = explode('.', $key);

        foreach ($keys as $segment) {
            if (!is_array($array) || !array_key_exists($segment, $array)) {
                return $default;
            }
            $array = $array[$segment];
        }

        return $array;
    }

    /**
     * Set value in nested array using dot notation.
     */
    public static function set(array &$array, string $key, mixed $value): void
    {
        $keys = explode('.', $key);
        $current = &$array;

        foreach ($keys as $i => $segment) {
            if (count($keys) === 1) {
                break;
            }

            unset($keys[$i]);

            if (!isset($current[$segment]) || !is_array($current[$segment])) {
                $current[$segment] = [];
            }

            $current = &$current[$segment];
        }

        $current[array_shift($keys)] = $value;
    }
}
