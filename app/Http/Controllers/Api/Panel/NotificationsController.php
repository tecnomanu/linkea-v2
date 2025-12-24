<?php

namespace App\Http\Controllers\Api\Panel;

use App\Http\Controllers\Controller;
use App\Http\Resources\NotificationResource;
use App\Models\Notification;
use App\Models\User;
use App\Services\NotificationService;
use App\Traits\HasApiResponse;
use App\Traits\RESTActions;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationsController extends Controller
{
    use RESTActions, HasApiResponse;

    const MODEL = Notification::class;

    public function __construct(
        protected NotificationService $notificationService
    ) {}

    /**
     * Get paginated notifications for current user.
     */
    public function all(Request $request): JsonResponse
    {
        /** @var User|null $user */
        $user = Auth::user();

        if (!$user) {
            return $this->unauthorized();
        }

        $perPage = (int) $request->get('per_page', 10);
        $notifications = $this->notificationService->getForUser($user, $perPage);

        return $this->success([
            'data' => NotificationResource::collection($notifications),
            'meta' => [
                'current_page' => $notifications->currentPage(),
                'last_page' => $notifications->lastPage(),
                'per_page' => $notifications->perPage(),
                'total' => $notifications->total(),
                'unread_count' => $this->notificationService->getUnreadCount($user),
            ],
        ]);
    }

    /**
     * Mark all notifications as viewed.
     */
    public function checkViewed(): JsonResponse
    {
        /** @var User|null $user */
        $user = Auth::user();

        if (!$user) {
            return $this->unauthorized();
        }

        $this->notificationService->markAllViewed($user);

        return $this->success(['status' => 'success']);
    }

    /**
     * Mark specific notification as read.
     */
    public function checkRead(string $id): JsonResponse
    {
        /** @var User|null $user */
        $user = Auth::user();

        if (!$user) {
            return $this->unauthorized();
        }

        $this->notificationService->markAsRead($user, $id);

        return $this->success(['status' => 'success']);
    }

    /**
     * Mark all notifications as read.
     */
    public function checkReadAll(): JsonResponse
    {
        /** @var User|null $user */
        $user = Auth::user();

        if (!$user) {
            return $this->unauthorized();
        }

        $this->notificationService->markAllRead($user);

        return $this->success(['status' => 'success']);
    }
}

