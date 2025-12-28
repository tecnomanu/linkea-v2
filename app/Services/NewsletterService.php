<?php

namespace App\Services;

use App\Jobs\SendNewsletterEmail;
use App\Models\Newsletter;
use App\Models\User;
use App\Notifications\NewsletterMessage;
use Carbon\Carbon;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Log;

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
     * Dispatches jobs for async email sending.
     */
    public function sendToAllUsers(Newsletter $newsletter): Newsletter
    {
        $users = User::all();

        if ($users->isEmpty()) {
            Log::warning('No users found to send newsletter', [
                'newsletter_id' => $newsletter->id,
            ]);
            return $newsletter;
        }

        // Attach users to newsletter pivot table
        $pivotData = $users->mapWithKeys(fn($user) => [
            $user->id => [
                'date' => Carbon::now(),
                'sent' => true,
                'viewed_count' => 0,
                'ip' => null,
            ]
        ])->toArray();

        $newsletter->users()->sync($pivotData);

        // Dispatch email jobs for each user
        foreach ($users as $user) {
            SendNewsletterEmail::dispatch($newsletter, $user);
        }

        // Mark newsletter as sent
        $newsletter->update([
            'sent' => true,
            'status' => 'sent',
        ]);

        Log::info('Newsletter queued for sending', [
            'newsletter_id' => $newsletter->id,
            'recipients_count' => $users->count(),
        ]);

        return $newsletter->fresh();
    }

    /**
     * Send newsletter to root users only (test mode).
     */
    public function sendToRootUsers(Newsletter $newsletter, ?string $testEmail = null): Newsletter
    {
        $users = User::whereHas('roles', function ($query) {
            $query->where('type', 'root');
        })->get();

        if ($users->isEmpty()) {
            Log::warning('No root users found to send test newsletter', [
                'newsletter_id' => $newsletter->id,
            ]);
            return $newsletter;
        }

        // Dispatch email jobs for each root user
        foreach ($users as $user) {
            SendNewsletterEmail::dispatch($newsletter, $user, $testEmail);
        }

        Log::info('Newsletter test queued for sending', [
            'newsletter_id' => $newsletter->id,
            'recipients_count' => $users->count(),
            'test_email' => $testEmail,
        ]);

        return $newsletter;
    }

    /**
     * Send test email to a specific address.
     */
    public function sendTestToEmail(Newsletter $newsletter, string $email): void
    {
        // Find any root user to send as (for template purposes)
        $user = User::whereHas('roles', function ($query) {
            $query->where('type', 'root');
        })->first();

        if (!$user) {
            $user = User::first();
        }

        if (!$user) {
            Log::error('No users available to send test newsletter');
            return;
        }

        // Send directly without queuing for immediate feedback
        $user->notify(new NewsletterMessage($newsletter, $email));

        Log::info('Newsletter test sent directly', [
            'newsletter_id' => $newsletter->id,
            'test_email' => $email,
        ]);
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

            Log::debug('Newsletter view recorded', [
                'newsletter_id' => $newsletterId,
                'user_id' => $userId,
                'view_count' => $currentCount + 1,
            ]);
        } else {
            // If user wasn't in pivot (e.g., root user test), create entry
            if ($user->hasRole('root')) {
                $newsletter->users()->attach($userId, [
                    'date' => Carbon::now(),
                    'sent' => true,
                    'viewed_count' => 1,
                    'ip' => $ip,
                ]);
            }
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

            if ($saved && isset($saved['image'])) {
                $url = asset('storage/' . $saved['image']);
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
