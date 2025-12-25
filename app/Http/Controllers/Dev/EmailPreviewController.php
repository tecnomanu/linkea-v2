<?php

namespace App\Http\Controllers\Dev;

use App\Http\Controllers\Controller;
use App\Notifications\ResetPasswordNotification;
use App\Notifications\VerifyUserCode;
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
            [
                'name' => 'Verificacion de Email',
                'slug' => 'verify-email',
                'description' => 'Email enviado al registrarse para verificar la cuenta',
            ],
            [
                'name' => 'Bienvenida',
                'slug' => 'welcome',
                'description' => 'Email de bienvenida despues de verificar la cuenta',
            ],
            [
                'name' => 'Reseteo de Password',
                'slug' => 'reset-password',
                'description' => 'Email para resetear la contrasena',
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

        // Create a mock user for preview
        $mockUser = new class {
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

        switch ($template) {
            case 'verify-email':
                $notification = new VerifyUserCode();
                $mailMessage = $notification->toMail($mockUser);
                break;

            case 'welcome':
                // Placeholder for welcome email
                return $this->renderPlaceholder('Bienvenida', 'Este template aun no esta implementado.');

            case 'reset-password':
                $notification = new ResetPasswordNotification('sample-token-for-preview');
                $mailMessage = $notification->toMail($mockUser);
                break;

            default:
                abort(404, 'Template not found');
        }

        // Render the mail message
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

        // Create a mock user
        $mockUser = new \App\Models\User();
        $mockUser->id = 'test-user-id';
        $mockUser->first_name = 'Test';
        $mockUser->last_name = 'User';
        $mockUser->name = 'Test User';
        $mockUser->email = $email;
        $mockUser->username = 'testuser';
        $mockUser->verification_code = rand(100000, 999999);

        switch ($template) {
            case 'verify-email':
                $mockUser->notify(new VerifyUserCode());
                break;

            case 'reset-password':
                $mockUser->notify(new ResetPasswordNotification(Str::random(64)));
                break;

            default:
                return back()->with('error', 'Template no soportado para envio de prueba.');
        }

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

