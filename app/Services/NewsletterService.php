<?php

namespace App\Services;

use App\Models\Newsletter;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;

/**
 * Service for handling newsletter operations.
 */
class NewsletterService
{
    public function __construct(
        protected ImageService $imageService
    ) {}

    /**
     * Create a new newsletter.
     */
    public function create(array $data): Newsletter
    {
        // Process message images if needed
        if (isset($data['message'])) {
            $data['message'] = $this->processMessageImages($data['message']);
        }

        return Newsletter::create([
            'subject' => $data['subject'],
            'message' => $data['message'],
            'status' => $data['status'] ?? 'draft',
            'sent' => false,
        ]);
    }

    /**
     * Update a newsletter.
     */
    public function update(Newsletter $newsletter, array $data): Newsletter
    {
        if (isset($data['message'])) {
            $data['message'] = $this->processMessageImages($data['message']);
        }

        $newsletter->update($data);

        return $newsletter->fresh();
    }

    /**
     * Send newsletter to all users.
     */
    public function sendToAllUsers(Newsletter $newsletter): Newsletter
    {
        $users = User::all();

        $pivotData = $users->mapWithKeys(fn($user) => [
            $user->id => [
                'date' => Carbon::now(),
                'sent' => true,
                'viewed_count' => 0,
                'ip' => null,
            ]
        ])->toArray();

        $newsletter->users()->sync($pivotData);
        $newsletter->update(['sent' => true, 'status' => 'sent']);

        // TODO: Dispatch email jobs here
        // foreach ($users as $user) {
        //     dispatch(new SendNewsletterEmail($newsletter, $user));
        // }

        return $newsletter->fresh();
    }

    /**
     * Record newsletter view (pixel tracking).
     */
    public function recordView(string $newsletterId, string $userId, ?string $ip = null): void
    {
        $newsletter = Newsletter::find($newsletterId);
        $user = User::find($userId);

        if (!$newsletter || !$user) {
            return;
        }

        $pivot = $newsletter->users()->where('user_id', $userId)->first();

        if ($pivot) {
            $currentCount = $pivot->pivot->viewed_count ?? 0;
            $newsletter->users()->updateExistingPivot($userId, [
                'viewed_count' => $currentCount + 1,
                'ip' => $ip,
            ]);
        }
    }

    /**
     * Get all newsletters paginated.
     */
    public function getPaginated(int $perPage = 10): LengthAwarePaginator
    {
        return Newsletter::orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Get newsletter with user stats.
     */
    public function getWithStats(string $newsletterId): ?Newsletter
    {
        return Newsletter::with('users')->find($newsletterId);
    }

    /**
     * Process and store inline images in newsletter message.
     */
    protected function processMessageImages(string $message): string
    {
        // Match base64 images in message
        $pattern = '/src="(data:image\/(png|jpeg|jpg|gif);base64,[^"]+)"/';

        return preg_replace_callback($pattern, function ($matches) {
            $base64 = $matches[1];
            $type = $matches[2];

            // Save image and get URL
            $imageData = [
                'base64_image' => $base64,
                'type' => "image/{$type}",
            ];

            $saved = $this->imageService->saveImage($imageData, 'newsletters', 'image_' . time());

            if ($saved) {
                $url = Storage::disk('public')->url($saved['image']);
                return 'src="' . $url . '"';
            }

            return $matches[0];
        }, $message);
    }

    /**
     * Delete a newsletter.
     */
    public function delete(string $newsletterId): bool
    {
        $newsletter = Newsletter::find($newsletterId);

        if (!$newsletter) {
            return false;
        }

        $newsletter->users()->detach();
        $newsletter->delete();

        return true;
    }
}

