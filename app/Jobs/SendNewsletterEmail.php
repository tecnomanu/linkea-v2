<?php

namespace App\Jobs;

use App\Models\Newsletter;
use App\Models\User;
use App\Notifications\NewsletterMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

/**
 * Job to send newsletter email to a user.
 * Dispatched for each user when sending a newsletter.
 */
class SendNewsletterEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 3;

    /**
     * The number of seconds to wait before retrying the job.
     * Uses exponential backoff: 30s, 60s, 120s
     *
     * @var array<int, int>
     */
    public array $backoff = [30, 60, 120];

    /**
     * The maximum number of unhandled exceptions to allow before failing.
     */
    public int $maxExceptions = 2;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public Newsletter $newsletter,
        public User $user,
        public ?string $testEmail = null
    ) {
        $this->onQueue('notifications');
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            $notification = new NewsletterMessage(
                $this->newsletter,
                $this->testEmail
            );

            $this->user->notify($notification);

            Log::info('Newsletter email sent', [
                'newsletter_id' => $this->newsletter->id,
                'user_id' => $this->user->id,
                'email' => $this->testEmail ?? $this->user->email,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to send newsletter email', [
                'newsletter_id' => $this->newsletter->id,
                'user_id' => $this->user->id,
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('Newsletter email job failed permanently', [
            'newsletter_id' => $this->newsletter->id,
            'user_id' => $this->user->id,
            'error' => $exception->getMessage(),
        ]);
    }
}

