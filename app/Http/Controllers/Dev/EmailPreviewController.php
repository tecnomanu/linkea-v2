<?php

namespace App\Http\Controllers\Dev;

use App\Http\Controllers\Controller;
use App\Models\Newsletter;
use App\Notifications\NewsletterMessage;
use App\Notifications\ResetPasswordNotification;
use App\Notifications\ResetPasswordSuccess;
use App\Notifications\VerifyLandingReport;
use App\Notifications\VerifyUserCode;
use App\Notifications\WeeklyStatsReport;
use App\Notifications\WelcomeMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Str;

/**
 * Controller for previewing email templates during development.
 * Only available in local/development environment.
 */
class EmailPreviewController extends Controller
{
    /**
     * Show list of available email templates.
     */
    public function index()
    {
        $this->checkEnvironment();

        $templates = [
            // Authentication Emails
            [
                'category' => 'Autenticacion',
                'name' => 'Verificacion de Email',
                'slug' => 'verify-email',
                'description' => 'Email enviado al registrarse para verificar la cuenta',
            ],
            [
                'category' => 'Autenticacion',
                'name' => 'Bienvenida',
                'slug' => 'welcome',
                'description' => 'Email de bienvenida despues de verificar la cuenta',
            ],
            [
                'category' => 'Autenticacion',
                'name' => 'Reseteo de Password',
                'slug' => 'reset-password',
                'description' => 'Email con link para resetear la contrasena',
            ],
            [
                'category' => 'Autenticacion',
                'name' => 'Password Cambiado',
                'slug' => 'reset-password-success',
                'description' => 'Confirmacion de que la contrasena fue cambiada',
            ],

            // Notifications
            [
                'category' => 'Notificaciones',
                'name' => 'Landing Verificado',
                'slug' => 'verify-landing',
                'description' => 'Notificacion cuando una landing recibe la insignia de verificacion',
            ],
            [
                'category' => 'Notificaciones',
                'name' => 'Resumen Semanal',
                'slug' => 'weekly-stats',
                'description' => 'Resumen semanal de estadisticas del landing',
            ],

            // Marketing / Newsletters
            [
                'category' => 'Marketing',
                'name' => 'Newsletter',
                'slug' => 'newsletter',
                'description' => 'Email de newsletter enviado a todos los usuarios',
            ],
        ];

        return view('dev.email-templates', compact('templates'));
    }

    /**
     * Preview a specific email template.
     */
    public function show(string $template)
    {
        $this->checkEnvironment();

        $mockUser = $this->createMockUser();

        $notification = match ($template) {
            'verify-email' => new VerifyUserCode(),
            'welcome' => new WelcomeMessage(),
            'reset-password' => new ResetPasswordNotification('sample-token-for-preview'),
            'reset-password-success' => new ResetPasswordSuccess(),
            'verify-landing' => new VerifyLandingReport($this->createMockLanding()),
            'weekly-stats' => new WeeklyStatsReport($this->createMockStats()),
            'newsletter' => new NewsletterMessage($this->createMockNewsletter()),
            default => null,
        };

        if (!$notification) {
            abort(404, 'Template not found');
        }

        $mailMessage = $notification->toMail($mockUser);

        return $mailMessage->render();
    }

    /**
     * Send a test email to a specific address.
     */
    public function sendTest(Request $request, string $template)
    {
        $this->checkEnvironment();

        $request->validate([
            'email' => 'required|email',
        ]);

        $email = $request->input('email');

        // Create a mock user with the test email
        $mockUser = new \App\Models\User();
        $mockUser->id = Str::uuid()->toString();
        $mockUser->first_name = 'Test';
        $mockUser->last_name = 'User';
        $mockUser->name = 'Test User';
        $mockUser->email = $email;
        $mockUser->username = 'testuser';
        $mockUser->verification_code = rand(100000, 999999);

        $notification = match ($template) {
            'verify-email' => new VerifyUserCode(),
            'welcome' => new WelcomeMessage(),
            'reset-password' => new ResetPasswordNotification(Str::random(64)),
            'reset-password-success' => new ResetPasswordSuccess(),
            'verify-landing' => new VerifyLandingReport($this->createMockLanding()),
            'weekly-stats' => new WeeklyStatsReport($this->createMockStats()),
            'newsletter' => new NewsletterMessage($this->createMockNewsletter()),
            default => null,
        };

        if (!$notification) {
            return back()->with('error', 'Template no soportado para envio de prueba.');
        }

        $mockUser->notify($notification);

        return back()->with('success', "Email de prueba enviado a {$email}");
    }

    /**
     * Check if we're in development environment.
     * Returns 404 to hide the existence of these routes in production.
     */
    private function checkEnvironment(): void
    {
        if (!App::environment('local', 'development', 'testing') && !config('app.debug')) {
            abort(404);
        }
    }

    /**
     * Create a mock user for preview.
     */
    private function createMockUser(): object
    {
        return new class {
            public $id = 'preview-user-id';
            public $first_name = 'Juan';
            public $last_name = 'Perez';
            public $name = 'Juan Perez';
            public $email = 'juan@example.com';
            public $username = 'juanperez';
            public $verification_code = '123456';

            public function getEmailForPasswordReset(): string
            {
                return $this->email;
            }
        };
    }

    /**
     * Create a mock landing for preview.
     */
    private function createMockLanding(): \App\Models\Landing
    {
        $landing = new \App\Models\Landing();
        $landing->id = 'preview-landing-id';
        $landing->name = 'Mi Linkea';
        $landing->slug = 'juanperez';
        $landing->domain_name = null;

        return $landing;
    }

    /**
     * Create mock newsletter for preview.
     */
    private function createMockNewsletter(): \App\Models\Newsletter
    {
        $newsletter = new \App\Models\Newsletter();
        $newsletter->id = 'preview-newsletter-id';
        $newsletter->subject = 'Novedades de Linkea - Enero 2025';
        $newsletter->message = '<h2>Nuevas funcionalidades</h2>
            <p>Hola! Queremos contarte las ultimas novedades de la plataforma:</p>
            <ul>
                <li><strong>Nuevos temas</strong>: Agregamos 10 nuevos fondos para personalizar tu landing.</li>
                <li><strong>Estadisticas mejoradas</strong>: Ahora podes ver graficos de tus visitas por dia.</li>
                <li><strong>Integracion con WhatsApp</strong>: Agrega un boton de WhatsApp con mensaje predefinido.</li>
            </ul>
            <p>Esperamos que disfrutes estas mejoras. Como siempre, estamos atentos a tus sugerencias!</p>';

        return $newsletter;
    }

    /**
     * Create mock stats for preview.
     */
    private function createMockStats(): array
    {
        return [
            'total_views' => 1247,
            'total_clicks' => 342,
            'views_change' => 23,
            'clicks_change' => 15,
            'top_links' => [
                ['title' => 'Instagram', 'clicks' => 89],
                ['title' => 'YouTube - Mi ultimo video', 'clicks' => 67],
                ['title' => 'Mi tienda online', 'clicks' => 54],
                ['title' => 'WhatsApp', 'clicks' => 48],
                ['title' => 'Portfolio', 'clicks' => 34],
            ],
            'week_start' => '20/01',
            'week_end' => '27/01',
        ];
    }

    /**
     * Render a placeholder for unimplemented templates.
     */
    private function renderPlaceholder(string $name, string $message): string
    {
        return <<<HTML
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{$name} - Preview</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background: #f5f5f5;
        }
        .placeholder {
            text-align: center;
            padding: 40px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 { color: #333; margin-bottom: 10px; }
        p { color: #666; }
    </style>
</head>
<body>
    <div class="placeholder">
        <h1>{$name}</h1>
        <p>{$message}</p>
    </div>
</body>
</html>
HTML;
    }
}
