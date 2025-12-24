<?php

namespace App\Http\Controllers\Api\Admin;

use App\Constants\ResponseMessages;
use App\Http\Controllers\Controller;
use App\Http\Resources\NewsletterResource;
use App\Models\Newsletter;
use App\Services\NewsletterService;
use App\Traits\HasApiResponse;
use App\Traits\RESTActions;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class NewslettersController extends Controller
{
    use RESTActions, HasApiResponse;

    const MODEL = Newsletter::class;

    public function __construct(
        protected NewsletterService $newsletterService
    ) {}

    /**
     * Get all newsletters paginated.
     */
    public function all(Request $request): JsonResponse
    {
        $perPage = (int) $request->get('per_page', 10);
        $newsletters = $this->newsletterService->getPaginated($perPage);

        return $this->success([
            'data' => NewsletterResource::collection($newsletters),
            'meta' => [
                'current_page' => $newsletters->currentPage(),
                'last_page' => $newsletters->lastPage(),
                'per_page' => $newsletters->perPage(),
                'total' => $newsletters->total(),
            ],
        ]);
    }

    /**
     * Get single newsletter with stats.
     */
    public function get(string $id): JsonResponse
    {
        $newsletter = $this->newsletterService->getWithStats($id);

        if (!$newsletter) {
            return $this->notFound();
        }

        return $this->success(new NewsletterResource($newsletter));
    }

    /**
     * Create new newsletter.
     */
    public function add(Request $request): JsonResponse
    {
        $data = $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'status' => 'nullable|string|in:draft,pending',
        ]);

        $newsletter = $this->newsletterService->create($data);

        return $this->created(new NewsletterResource($newsletter));
    }

    /**
     * Update newsletter.
     */
    public function put(Request $request, string $id): JsonResponse
    {
        $newsletter = Newsletter::find($id);

        if (!$newsletter) {
            return $this->notFound();
        }

        $data = $request->validate([
            'subject' => 'nullable|string|max:255',
            'message' => 'nullable|string',
            'status' => 'nullable|string|in:draft,pending,sent',
        ]);

        $updated = $this->newsletterService->update($newsletter, $data);

        return $this->success(
            new NewsletterResource($updated),
            ResponseMessages::UPDATED
        );
    }

    /**
     * Send newsletter to all users.
     */
    public function sendSystemMessage(Request $request, string $id): JsonResponse
    {
        $newsletter = Newsletter::find($id);

        if (!$newsletter) {
            return $this->notFound();
        }

        if ($newsletter->sent) {
            return $this->error('Newsletter ya fue enviado', Response::HTTP_BAD_REQUEST);
        }

        $this->newsletterService->sendToAllUsers($newsletter);

        return $this->success(['status' => 'success'], 'Newsletter enviado exitosamente');
    }

    /**
     * Tracking pixel for email opens.
     */
    public function setPixel(Request $request, string $id, string $userId): Response
    {
        $this->newsletterService->recordView($id, $userId, $request->ip());

        // Return 1x1 transparent PNG
        $pixel = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');

        return response($pixel)
            ->header('Content-Type', 'image/png')
            ->header('Cache-Control', 'no-cache, no-store, must-revalidate');
    }

    /**
     * Delete newsletter (soft delete).
     */
    public function remove(string $id): JsonResponse
    {
        $deleted = $this->newsletterService->delete($id);

        if (!$deleted) {
            return $this->notFound();
        }

        return $this->success(null, ResponseMessages::DELETED);
    }
}
