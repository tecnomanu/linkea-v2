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
 * Job to add a user to specific groups in Sender.net.
 * Useful for adding users to marketing segments based on actions.
 */
class AddToGroupsSenderNet implements ShouldQueue
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
     * Group IDs to add the user to.
     *
     * @var array<string>
     */
    protected array $groupIds;

    /**
     * Create a new job instance.
     *
     * @param User $user The user
     * @param array<string> $groupIds Group IDs to add the user to
     */
    public function __construct(
        public User $user,
        array $groupIds
    ) {
        $this->groupIds = $groupIds;
    }

    /**
     * Execute the job.
     */
    public function handle(SenderNetService $senderNetService): void
    {
        $senderNetService->addToGroups($this->user, $this->groupIds);
    }
}
