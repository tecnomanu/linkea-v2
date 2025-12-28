<?php

namespace App\Http\Controllers;

use App\Services\NewsletterService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

/**
 * Controller for handling newsletter tracking pixel requests.
 * Returns a 1x1 transparent PNG while recording the view.
 */
class NewsletterPixelController extends Controller
{
    public function __construct(
        protected NewsletterService $newsletterService
    ) {}

    /**
     * Handle the tracking pixel request.
     * Records the view and returns a transparent 1x1 PNG.
     */
    public function __invoke(Request $request, string $newsletter, string $user): Response
    {
        // Record the view
        $ip = $request->header('X-Forwarded-For') ?? $request->ip();
        $this->newsletterService->recordView($newsletter, $user, $ip);

        // Generate and return transparent 1x1 PNG
        return $this->transparentPixelResponse();
    }

    /**
     * Generate a transparent 1x1 PNG response with no-cache headers.
     */
    protected function transparentPixelResponse(): Response
    {
        // Create a 1x1 transparent PNG
        $image = imagecreatetruecolor(1, 1);
        imagesavealpha($image, true);
        $transparent = imagecolorallocatealpha($image, 0, 0, 0, 127);
        imagefill($image, 0, 0, $transparent);

        // Capture output
        ob_start();
        imagepng($image);
        $imageData = ob_get_clean();
        imagedestroy($image);

        return response($imageData, 200)
            ->header('Content-Type', 'image/png')
            ->header('Cache-Control', 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0')
            ->header('Pragma', 'no-cache')
            ->header('Expires', 'Mon, 26 Jul 1997 05:00:00 GMT')
            ->header('Last-Modified', gmdate('D, d M Y H:i:s') . ' GMT');
    }
}

