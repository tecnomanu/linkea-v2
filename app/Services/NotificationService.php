<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

/**
 * Service for handling notification operations.
 */
class NotificationService
{
    /**
     * Create a new notification and attach to all users.
     */
    public function createForAllUsers(array $data): Notification
    {
        $notification = Notification::create($data);

        $users = User::all();
        $pivotData = $users->mapWithKeys(fn($user) => [
            $user->id => ['read' => false, 'viewed' => false]
        ])->toArray();

        $notification->users()->attach($pivotData);

        return $notification;
    }

    /**
     * Create a notification for specific users.
     */
    public function createForUsers(array $data, array $userIds): Notification
    {
        $notification = Notification::create($data);

        $pivotData = collect($userIds)->mapWithKeys(fn($userId) => [
            $userId => ['read' => false, 'viewed' => false]
        ])->toArray();

        $notification->users()->attach($pivotData);

        return $notification;
    }

    /**
     * Get paginated notifications for a user.
     */
    public function getForUser(User $user, int $perPage = 10): LengthAwarePaginator
    {
        return $user->notifications()
            ->withPivot(['read', 'viewed'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Get unread count for a user.
     */
    public function getUnreadCount(User $user): int
    {
        return $user->notifications()
            ->wherePivot('read', false)
            ->count();
    }

    /**
     * Get unviewed count for a user.
     */
    public function getUnviewedCount(User $user): int
    {
        return $user->notifications()
            ->wherePivot('viewed', false)
            ->count();
    }

    /**
     * Mark all notifications as viewed for a user.
     */
    public function markAllViewed(User $user): void
    {
        $notificationIds = $user->notifications()->pluck('notifications.id');

        foreach ($notificationIds as $id) {
            $user->notifications()->updateExistingPivot($id, ['viewed' => true]);
        }
    }

    /**
     * Mark a specific notification as read for a user.
     */
    public function markAsRead(User $user, string $notificationId): void
    {
        $user->notifications()->updateExistingPivot($notificationId, ['read' => true]);
    }

    /**
     * Mark all notifications as read for a user.
     */
    public function markAllRead(User $user): void
    {
        $notificationIds = $user->notifications()->pluck('notifications.id');

        foreach ($notificationIds as $id) {
            $user->notifications()->updateExistingPivot($id, ['read' => true]);
        }
    }

    /**
     * Delete a notification.
     */
    public function delete(string $notificationId): bool
    {
        $notification = Notification::find($notificationId);

        if (!$notification) {
            return false;
        }

        $notification->users()->detach();
        $notification->delete();

        return true;
    }
}

