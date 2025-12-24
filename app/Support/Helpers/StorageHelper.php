<?php

namespace App\Support\Helpers;

use Illuminate\Support\Facades\Storage;

class StorageHelper
{
    /**
     * Get the full URL for a storage path.
     * Handles both local and S3 storage transparently.
     */
    public static function url(?string $path): ?string
    {
        if (empty($path)) {
            return null;
        }

        // Already a full URL (http/https or data URI)
        if (str_starts_with($path, 'http://') || 
            str_starts_with($path, 'https://') || 
            str_starts_with($path, 'data:')) {
            return $path;
        }

        // Get URL from configured disk (local or s3)
        $disk = config('filesystems.default');
        
        return Storage::disk($disk)->url($path);
    }

    /**
     * Transform a logo array with image/thumb paths to full URLs.
     */
    public static function logoUrls(?array $logo): ?array
    {
        if (empty($logo)) {
            return null;
        }

        return [
            'image' => self::url($logo['image'] ?? null),
            'thumb' => self::url($logo['thumb'] ?? null),
        ];
    }

    /**
     * Get the base URL for the storage disk.
     * Used by frontend to construct full URLs from relative paths.
     */
    public static function baseUrl(): string
    {
        $disk = config('filesystems.default');
        
        if ($disk === 's3') {
            $bucket = config('filesystems.disks.s3.bucket');
            $region = config('filesystems.disks.s3.region');
            $url = config('filesystems.disks.s3.url');
            
            // If custom URL is set (CloudFront, custom domain), use it
            if ($url) {
                return rtrim($url, '/') . '/';
            }
            
            // Default S3 URL format
            return "https://{$bucket}.s3.{$region}.amazonaws.com/";
        }
        
        // For local disk, return app URL + storage path
        return rtrim(config('app.url'), '/') . '/storage/';
    }
}

