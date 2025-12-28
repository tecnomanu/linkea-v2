<?php

namespace App\Notifications;

use App\Models\Newsletter;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

/**
 * Notification for sending newsletter emails to users.
 * Includes tracking pixel for open rate analytics.
 */
class NewsletterMessage extends Notification implements ShouldQueue
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
        public Newsletter $newsletter,
        public ?string $testEmail = null
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
        // Build tracking pixel URL
        $pixelUrl = route('newsletter.pixel', [
            'newsletter' => $this->newsletter->id,
            'user' => $notifiable->id,
        ]);

        // Build the email with HTML content
        return (new MailMessage)
            ->subject($this->newsletter->subject . ' - ' . config('app.name'))
            ->view('emails.newsletter', [
                'newsletter' => $this->newsletter,
                'pixelUrl' => $pixelUrl
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
            'type' => 'newsletter',
            'newsletter_id' => $this->newsletter->id,
            'subject' => $this->newsletter->subject,
        ];
    }
}
