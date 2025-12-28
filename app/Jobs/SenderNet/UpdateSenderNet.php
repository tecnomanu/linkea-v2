<?php

namespace App\Jobs\SenderNet;

use App\Models\User;
use App\Services\SenderNetService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

/**
 * Job to update a user's information in Sender.net.
 * Can be dispatched when user data changes.
 */
class UpdateSenderNet implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 3;

    /**
     * The number of seconds to wait before retrying the job.
     */
    public int $backoff = 60;

    /**
     * Additional data to update.
     */
    protected array $data;

    /**
     * Create a new job instance.
     *
     * @param User $user The user to update
     * @param array $data Additional data to update
     */
    public function __construct(
        public User $user,
        array $data = []
    ) {
        $this->data = $data;
    }

    /**
     * Execute the job.
     */
    public function handle(SenderNetService $senderNetService): void
    {
        $senderNetService->updateSubscriber($this->user, $this->data);
    }
}
