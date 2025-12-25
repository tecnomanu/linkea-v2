<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\HtmlString;

/**
 * Custom reset password notification with Spanish translations.
 */
class ResetPasswordNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * The password reset token.
     */
    public string $token;

    /**
     * Create a new notification instance.
     */
    public function __construct(string $token)
    {
        $this->token = $token;
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
        $url = url(route('password.reset', [
            'token' => $this->token,
            'email' => $notifiable->getEmailForPasswordReset(),
        ], false));

        $firstName = $notifiable->first_name ?? 'Usuario';
        $expireMinutes = config('auth.passwords.users.expire', 60);

        return (new MailMessage)
            ->subject('Restablecer contrasena - Linkea')
            ->greeting('Hola ' . $firstName . '!')
            ->line('Recibimos una solicitud para restablecer la contrasena de tu cuenta de Linkea.')
            ->line('Haz clic en el boton de abajo para crear una nueva contrasena:')
            ->action('Restablecer Contrasena', $url)
            ->line('Este enlace expirara en ' . $expireMinutes . ' minutos.')
            ->line('Si no solicitaste restablecer tu contrasena, puedes ignorar este email. Tu cuenta permanecera segura.')
            ->salutation(new HtmlString('Saludos,<br><strong>Equipo de Linkea</strong>'));
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'reset_password',
        ];
    }
}

