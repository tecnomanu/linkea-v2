<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Str;

/**
 * Welcome notification sent after user verifies their account.
 */
class WelcomeMessage extends Notification implements ShouldQueue
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
    public function __construct()
    {
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
        $firstName = $notifiable->first_name ?? $notifiable->name ?? 'Usuario';
        $appName = config('app.name');
        $appUrl = config('app.url');

        return (new MailMessage)
            ->subject('Bienvenido a ' . $appName . ', ' . Str::ucfirst($firstName) . '!')
            ->view('emails.welcome', [
                'firstName' => $firstName,
                'actionUrl' => $appUrl . '/panel',
                'fullWidthHeaderBg' => 'images/emails/welcome_header.png',
                'headerTitle' => 'BIENVENIDO',
                'headerHeight' => '500px',
                'headerBgPosition' => 'top center',
                'headerTextAlign' => 'top',
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
            'type' => 'welcome',
        ];
    }
}
