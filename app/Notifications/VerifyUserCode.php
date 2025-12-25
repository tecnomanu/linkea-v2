<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\HtmlString;

class VerifyUserCode extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct()
    {
        //
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
        $code = $notifiable->verification_code;
        $firstName = $notifiable->first_name ?? 'Usuario';

        // Format the code with spaces for better readability
        $formattedCode = implode(' ', str_split($code));

        // Styled verification code box (inline styles for email compatibility)
        $codeBox = <<<HTML
<div style="background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%); border: 2px solid #fed7aa; border-radius: 12px; padding: 24px 32px; text-align: center; margin: 24px 0;">
    <p style="margin: 0 0 8px 0; font-size: 13px; color: #9a3412; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Tu codigo de verificacion</p>
    <p style="margin: 0; font-family: 'SF Mono', Monaco, 'Courier New', monospace; font-size: 36px; font-weight: 700; color: #c2410c; letter-spacing: 8px;">{$formattedCode}</p>
</div>
HTML;

        return (new MailMessage)
            ->subject('Verifica tu cuenta - Linkea')
            ->greeting('Hola ' . $firstName . '!')
            ->line('Gracias por registrarte en **Linkea**. Estamos emocionados de tenerte con nosotros.')
            ->line('Para completar tu registro, ingresa el siguiente codigo de verificacion:')
            ->line(new HtmlString($codeBox))
            ->line('Este codigo es valido por **24 horas**. Si no solicitaste esta cuenta, puedes ignorar este email.')
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
            'type' => 'verify_user_code',
            'code' => $notifiable->verification_code,
        ];
    }
}
