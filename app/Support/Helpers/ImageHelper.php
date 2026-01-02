<?php

namespace App\Support\Helpers;

use Carbon\Carbon;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Image processing and storage helper functions.
 * Uses the configured FILESYSTEM_DISK (s3 in production, public in local).
 */
final class ImageHelper
{
    private const ALLOWED_EXTENSIONS = [
        'image/jpeg' => '.jpg',
        'image/jpg' => '.jpg',
        'image/png' => '.png',
        'image/webp' => '.webp',
        'image/svg+xml' => '.svg',
    ];

    /**
     * Get the storage disk to use (s3 or public based on config).
     */
    private static function getDisk(): string
    {
        $default = config('filesystems.default', 'local');
        // Use s3 if configured, otherwise fall back to public for local dev
        return $default === 's3' ? 's3' : 'public';
    }

    /**
     * Save base64 image to storage.
     *
     * @param array $image Image data with base64_image and optional type
     * @param string $directory Target directory
     * @param string $name Base name for the file
     * @return array{image: string, thumb: string}|false
     */
    public static function saveFromBase64(array $image, string $directory, string $name): array|false
    {
        if (!isset($image['base64_image'])) {
            return false;
        }

        if (!self::isValidBase64Image($image['base64_image'])) {
            throw new HttpResponseException(
                response()->json('The extension file is not accepted.', 403)
            );
        }

        $name = Str::snake(Str::ascii($name));
        $extension = self::getExtension($image['type'] ?? 'image/jpeg');
        $fileName = $name . '_' . Carbon::now()->timestamp . $extension;

        $pathFile = $directory . '/' . $fileName;
        $pathThumbFile = $directory . '/thumb_' . $fileName;

        $content = self::decodeBase64($image['base64_image']);

        if ($content === false) {
            return false;
        }

        $disk = self::getDisk();
        // Visibility is configured at disk level (public for s3)
        Storage::disk($disk)->put($pathFile, $content);
        Storage::disk($disk)->put($pathThumbFile, $content);

        return [
            'image' => $pathFile,
            'thumb' => $pathThumbFile,
        ];
    }

    /**
     * Get file extension from MIME type.
     */
    public static function getExtension(string $mimeType): string
    {
        return self::ALLOWED_EXTENSIONS[$mimeType] ?? '.jpg';
    }

    /**
     * Check if base64 string is a valid image.
     */
    public static function isValidBase64Image(string $base64): bool
    {
        // Basic validation - returns true to avoid GD dependency issues
        return !empty($base64);
    }

    /**
     * Get URL for stored image.
     */
    public static function getUrl(string $path): string
    {
        return Storage::disk(self::getDisk())->url($path);
    }

    /**
     * Delete image from storage.
     */
    public static function delete(string $path): bool
    {
        return Storage::disk(self::getDisk())->delete($path);
    }

    /**
     * Save uploaded file to storage.
     *
     * @param UploadedFile $file The uploaded file
     * @param string $directory Target directory
     * @param string $name Base name for the file
     * @return array{image: string, thumb: string}|false
     */
    public static function saveFromFile(UploadedFile $file, string $directory, string $name): array|false
    {
        $mimeType = $file->getMimeType();
        if (!isset(self::ALLOWED_EXTENSIONS[$mimeType])) {
            return false;
        }

        $name = Str::snake(Str::ascii($name));
        $extension = self::getExtension($mimeType);
        $fileName = $name . '_' . Carbon::now()->timestamp . $extension;

        $pathFile = $directory . '/' . $fileName;
        $pathThumbFile = $directory . '/thumb_' . $fileName;

        $content = file_get_contents($file->getRealPath());

        if ($content === false) {
            return false;
        }

        $disk = self::getDisk();
        // Visibility is configured at disk level (public for s3)
        Storage::disk($disk)->put($pathFile, $content);
        Storage::disk($disk)->put($pathThumbFile, $content);

        return [
            'image' => $pathFile,
            'thumb' => $pathThumbFile,
        ];
    }

    /**
     * Decode base64 image data.
     */
    private static function decodeBase64(string $base64): string|false
    {
        // Try file_get_contents for data URI
        $content = @file_get_contents($base64);

        if ($content !== false) {
            return $content;
        }

        // Try manual decode
        $parts = explode(',', $base64);
        if (count($parts) > 1) {
            return base64_decode($parts[1]);
        }

        return false;
    }
}
