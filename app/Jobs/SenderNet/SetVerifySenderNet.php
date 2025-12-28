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
 * Job to mark a user as verified in Sender.net.
 * Dispatched on email verification.
 */
class SetVerifySenderNet implements ShouldQueue
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
     * Create a new job instance.
     */
    public function __construct(
        public User $user
    ) {}

    /**
     * Execute the job.
     */
    public function handle(SenderNetService $senderNetService): void
    {
        $senderNetService->setVerified($this->user);
    }
}
