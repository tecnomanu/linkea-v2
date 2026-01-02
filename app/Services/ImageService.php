<?php

namespace App\Services;

use App\Support\Helpers\ImageHelper;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

/**
 * Service for handling image processing and storage.
 */
class ImageService
{
    /**
     * Save logo image from base64 data (for landing pages).
     * Uses WebP format for better compression (smaller files for web).
     *
     * @return array{image: string, thumb: string}|null
     */
    public function saveLogo(array $imageData, string $entityId): ?array
    {
        if (!isset($imageData['base64_image'])) {
            return null;
        }

        // Resize to 400px width, convert to WebP for landing logos
        return ImageHelper::saveFromBase64($imageData, 'logos', $entityId, 400, true);
    }

    /**
     * Save avatar image from base64 data (for user profiles).
     * Uses original format (PNG/JPG) to preserve transparency for emails.
     *
     * @return array{image: string, thumb: string}|null
     */
    public function saveAvatar(array $imageData, string $userId): ?array
    {
        if (!isset($imageData['base64_image'])) {
            return null;
        }

        // Resize to 400px width, keep original format for transparency
        return ImageHelper::saveFromBase64($imageData, 'avatars', $userId, 400, false);
    }

    /**
     * Save avatar image from uploaded file.
     *
     * @return array{image: string, thumb: string}|null
     */
    public function saveAvatarFile(UploadedFile $file, string $userId): ?array
    {
        // Resize to 400px, keep original format
        $result = ImageHelper::saveFromFile($file, 'avatars', $userId, 400, false);

        return $result ?: null;
    }

    /**
     * Save background image from base64 data (for landing pages).
     * Uses WebP format with high compression for large images.
     *
     * @return array{image: string, thumb: string}|null
     */
    public function saveBackground(array $imageData, string $entityId): ?array
    {
        if (!isset($imageData['base64_image'])) {
            return null;
        }

        // Resize to 1920px width, convert to WebP, quality 80 for backgrounds (reduces size significantly)
        return ImageHelper::saveFromBase64($imageData, 'backgrounds', $entityId, 1920, true, 80);
    }

    /**
     * Save generic image from base64 data.
     *
     * @return array{image: string, thumb: string}|null
     */
    public function saveImage(array $imageData, string $directory, string $name): ?array
    {
        if (!isset($imageData['base64_image'])) {
            return null;
        }

        return ImageHelper::saveFromBase64($imageData, $directory, $name);
    }

    /**
     * Get public URL for stored image.
     */
    public function getUrl(string $path): string
    {
        return ImageHelper::getUrl($path);
    }

    /**
     * Delete image from storage.
     */
    public function delete(string $path): bool
    {
        $disk = config('filesystems.default') === 's3' ? 's3' : 'public';
        return Storage::disk($disk)->delete($path);
    }

    /**
     * Check if path is a stored image (not external URL).
     */
    public function isStoredImage(string $path): bool
    {
        return !str_starts_with($path, 'http://')
            && !str_starts_with($path, 'https://');
    }
}
