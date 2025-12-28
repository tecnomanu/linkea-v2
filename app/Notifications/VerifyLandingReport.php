<?php

namespace App\Notifications;

use App\Models\Landing;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

/**
 * Notification sent when a landing page is verified (official badge).
 */
class VerifyLandingReport extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 3;

    /**
     * The number of seconds to wait before retrying the job.
     */
    public int $backoff = 30;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public ?Landing $landing = null
    ) {
        $this->onQueue('notifications');
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $appUrl = config('app.url');

        $landingUrl = $this->landing
            ? $appUrl . '/' . ($this->landing->slug ?? $this->landing->domain_name)
            : $appUrl . '/panel';

        return (new MailMessage)
            ->subject('Tu Linkea ahora está verificado - ' . config('app.name'))
            ->view('emails.verify-landing', [
                'landingUrl' => $landingUrl,
            ]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'verify_landing',
            'landing_id' => $this->landing?->id,
        ];
    }
}
