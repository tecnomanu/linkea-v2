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
     * Save logo image from base64 data.
     *
     * @return array{image: string, thumb: string}|null
     */
    public function saveLogo(array $imageData, string $entityId): ?array
    {
        if (!isset($imageData['base64_image'])) {
            return null;
        }

        return ImageHelper::saveFromBase64($imageData, 'logos', $entityId);
    }

    /**
     * Save avatar image from base64 data.
     *
     * @return array{image: string, thumb: string}|null
     */
    public function saveAvatar(array $imageData, string $userId): ?array
    {
        if (!isset($imageData['base64_image'])) {
            return null;
        }

        return ImageHelper::saveFromBase64($imageData, 'avatars', $userId);
    }

    /**
     * Save avatar image from uploaded file.
     *
     * @return array{image: string, thumb: string}|null
     */
    public function saveAvatarFile(UploadedFile $file, string $userId): ?array
    {
        $result = ImageHelper::saveFromFile($file, 'avatars', $userId);

        return $result ?: null;
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
        $disk = config('filesystems.default') === 's3' ? 's3' : 'public';
        return Storage::disk($disk)->url($path);
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
