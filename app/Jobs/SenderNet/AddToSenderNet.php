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
 * Job to add a new user to Sender.net as a subscriber.
 * Dispatched on user registration.
 */
class AddToSenderNet implements ShouldQueue
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
     * Optional group IDs to add the subscriber to.
     */
    protected array $groups;

    /**
     * Whether to trigger automations.
     */
    protected bool $triggerAutomation;

    /**
     * Create a new job instance.
     *
     * @param User $user The user to add
     * @param array $groups Optional group IDs
     * @param bool $triggerAutomation Whether to trigger automations
     */
    public function __construct(
        public User $user,
        array $groups = [],
        bool $triggerAutomation = true
    ) {
        $this->groups = $groups;
        $this->triggerAutomation = $triggerAutomation;
    }

    /**
     * Execute the job.
     */
    public function handle(SenderNetService $senderNetService): void
    {
        $senderNetService->addSubscriber(
            $this->user,
            $this->groups,
            $this->triggerAutomation
        );
    }
}
