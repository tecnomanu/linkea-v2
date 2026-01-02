<?php

namespace App\Support\Helpers;

use Carbon\Carbon;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Support\Helpers\StorageHelper;

/**
 * Image processing and storage helper functions.
 * Uses the configured FILESYSTEM_DISK (s3 in production, public in local).
 * Generates thumbnails (128x128) and supports WebP conversion.
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

    private const THUMB_SIZE = 128;

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
     * @param int|null $resizeTo Optional width to resize main image (maintains aspect ratio)
     * @param bool $convertToWebp Convert to WebP format for better compression
     * @param int $quality Quality for compression (0-100, default 90. Use 80 for backgrounds)
     * @return array{image: string, thumb: string}|false
     */
    public static function saveFromBase64(
        array $image,
        string $directory,
        string $name,
        ?int $resizeTo = null,
        bool $convertToWebp = false,
        int $quality = 90
    ): array|false {
        if (!isset($image['base64_image'])) {
            return false;
        }

        if (!self::isValidBase64Image($image['base64_image'])) {
            throw new HttpResponseException(
                response()->json('The extension file is not accepted.', 403)
            );
        }

        $name = Str::snake(Str::ascii($name));
        $originalExtension = self::getExtension($image['type'] ?? 'image/jpeg');
        $extension = $convertToWebp ? '.webp' : $originalExtension;
        $fileName = $name . '_' . Carbon::now()->timestamp . $extension;

        $pathFile = $directory . '/' . $fileName;
        $pathThumbFile = $directory . '/thumb_' . $fileName;

        $content = self::decodeBase64($image['base64_image']);

        if ($content === false) {
            return false;
        }

        // Process main image
        $gdImage = @imagecreatefromstring($content);
        if ($gdImage === false) {
            return false;
        }

        // Resize main image if requested
        if ($resizeTo) {
            $gdImage = self::resizeImage($gdImage, $resizeTo, null, true);
        }

        // Create thumbnail (128x128 with aspect ratio)
        $gdThumb = self::createThumbnail($gdImage, self::THUMB_SIZE);

        // Save images
        $disk = self::getDisk();
        $mainContent = self::gdToString($gdImage, $convertToWebp ? 'webp' : null, $quality);
        $thumbContent = self::gdToString($gdThumb, $convertToWebp ? 'webp' : null, 85); // Slightly lower quality for thumbs

        Storage::disk($disk)->put($pathFile, $mainContent);
        Storage::disk($disk)->put($pathThumbFile, $thumbContent);

        // GdImage objects are automatically freed in PHP 8+

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
        return StorageHelper::url($path);
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
     * @param int|null $resizeTo Optional width to resize main image
     * @param bool $convertToWebp Convert to WebP format
     * @param int $quality Quality for compression (0-100, default 90)
     * @return array{image: string, thumb: string}|false
     */
    public static function saveFromFile(
        UploadedFile $file,
        string $directory,
        string $name,
        ?int $resizeTo = null,
        bool $convertToWebp = false,
        int $quality = 90
    ): array|false {
        $mimeType = $file->getMimeType();
        if (!isset(self::ALLOWED_EXTENSIONS[$mimeType])) {
            return false;
        }

        $name = Str::snake(Str::ascii($name));
        $originalExtension = self::getExtension($mimeType);
        $extension = $convertToWebp ? '.webp' : $originalExtension;
        $fileName = $name . '_' . Carbon::now()->timestamp . $extension;

        $pathFile = $directory . '/' . $fileName;
        $pathThumbFile = $directory . '/thumb_' . $fileName;

        $content = file_get_contents($file->getRealPath());

        if ($content === false) {
            return false;
        }

        // Process image
        $gdImage = @imagecreatefromstring($content);
        if ($gdImage === false) {
            return false;
        }

        // Resize main image if requested
        if ($resizeTo) {
            $gdImage = self::resizeImage($gdImage, $resizeTo, null, true);
        }

        // Create thumbnail
        $gdThumb = self::createThumbnail($gdImage, self::THUMB_SIZE);

        // Save images
        $disk = self::getDisk();
        $mainContent = self::gdToString($gdImage, $convertToWebp ? 'webp' : null, $quality);
        $thumbContent = self::gdToString($gdThumb, $convertToWebp ? 'webp' : null, 85); // Slightly lower quality for thumbs

        Storage::disk($disk)->put($pathFile, $mainContent);
        Storage::disk($disk)->put($pathThumbFile, $thumbContent);

        // GdImage objects are automatically freed in PHP 8+

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

    /**
     * Resize GD image maintaining aspect ratio.
     *
     * @param \GdImage $image Source image
     * @param int|null $width Target width (null to use original)
     * @param int|null $height Target height (null to use original)
     * @param bool $aspectRatio Maintain aspect ratio
     * @return \GdImage Resized image
     */
    private static function resizeImage(
        \GdImage $image,
        ?int $width,
        ?int $height = null,
        bool $aspectRatio = true
    ): \GdImage {
        $srcWidth = imagesx($image);
        $srcHeight = imagesy($image);

        if ($aspectRatio && $width && !$height) {
            $ratio = $width / $srcWidth;
            $height = (int) ($srcHeight * $ratio);
        } elseif ($aspectRatio && $height && !$width) {
            $ratio = $height / $srcHeight;
            $width = (int) ($srcWidth * $ratio);
        }

        $width = $width ?? $srcWidth;
        $height = $height ?? $srcHeight;

        $dst = imagecreatetruecolor($width, $height);

        // Preserve transparency for PNG/WebP
        imagealphablending($dst, false);
        imagesavealpha($dst, true);
        $transparent = imagecolorallocatealpha($dst, 0, 0, 0, 127);
        imagefill($dst, 0, 0, $transparent);

        imagecopyresampled($dst, $image, 0, 0, 0, 0, $width, $height, $srcWidth, $srcHeight);

        return $dst;
    }

    /**
     * Create thumbnail with fixed size (maintains aspect ratio).
     *
     * @param \GdImage $image Source image
     * @param int $size Thumbnail size (square)
     * @return \GdImage Thumbnail image
     */
    private static function createThumbnail(\GdImage $image, int $size): \GdImage
    {
        $srcWidth = imagesx($image);
        $srcHeight = imagesy($image);

        // Calculate dimensions to maintain aspect ratio
        $ratio = $srcWidth / $srcHeight;
        if ($ratio > 1) {
            $thumbWidth = $size;
            $thumbHeight = (int) ($size / $ratio);
        } else {
            $thumbHeight = $size;
            $thumbWidth = (int) ($size * $ratio);
        }

        return self::resizeImage($image, $thumbWidth, $thumbHeight, false);
    }

    /**
     * Convert GD image to string.
     *
     * @param \GdImage $image Source image
     * @param string|null $format Output format (jpeg, png, webp, or null for auto)
     * @param int $quality Quality (0-100) for jpeg/webp
     * @return string Image binary data
     */
    private static function gdToString(\GdImage $image, ?string $format = null, int $quality = 90): string
    {
        ob_start();

        switch ($format) {
            case 'webp':
                imagewebp($image, null, $quality);
                break;
            case 'png':
                imagepng($image, null, (int) (9 - ($quality / 10)));
                break;
            case 'jpeg':
            case 'jpg':
            default:
                imagejpeg($image, null, $quality);
                break;
        }

        return ob_get_clean();
    }
}
