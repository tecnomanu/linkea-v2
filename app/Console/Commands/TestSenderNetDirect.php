<?php

namespace App\Console\Commands;

use App\Services\SenderNetService;
use Illuminate\Console\Command;

/**
 * Test sending email directly via SenderNetService API.
 */
class TestSenderNetDirect extends Command
{
    protected $signature = 'test:sendernet-direct {email}';
    protected $description = 'Test sending email directly via SenderNetService API';

    public function handle(SenderNetService $senderService): int
    {
        $email = $this->argument('email');

        $this->info("🧪 Testing SenderNetService Direct API");
        $this->info("📬 Sending to: {$email}");

        // Debug config
        $this->newLine();
        $this->info("🔍 DEBUG:");
        $senderApiKey = env('SENDER_API_KEY');
        $this->line("  SENDER_API_KEY: " . substr($senderApiKey, 0, 30) . "..." . substr($senderApiKey, -20));
        $this->line("  Length: " . strlen($senderApiKey));
        $this->line("  Enabled: " . (config('services.sendernet.enabled') ? 'true' : 'false'));
        $this->newLine();

        // Force enable for test
        $senderService->forceEnable();

        $html = <<<HTML
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
</head>
<body style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
    <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px;">
        <h1 style="color: #f97316;">🧪 Test Email</h1>
        <p>Este es un email de prueba enviado directamente desde <strong>SenderNetService</strong>.</p>
        <p>Si recibes este email, significa que el token de Sender.net está funcionando correctamente! ✅</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #64748b; font-size: 14px;">Enviado desde Linkea v2</p>
    </div>
</body>
</html>
HTML;

        $text = "🧪 Test Email\n\nEste es un email de prueba enviado desde SenderNetService.\nSi recibes este email, el token funciona! ✅";

        try {
            $this->info("📤 Sending email via SenderNetService API...");

            $response = $senderService->sendTransactionalEmail(
                toEmail: $email,
                toName: 'Test User',
                fromEmail: config('mail.from.address'),
                fromName: config('mail.from.name'),
                subject: '🧪 Test Email - SenderNet API',
                html: $html,
                text: $text
            );

            if ($response && isset($response['success']) && $response['success']) {
                $this->info("\n✅ EMAIL SENT SUCCESSFULLY!");
                if (isset($response['emailId'])) {
                    $this->line("   Email ID: {$response['emailId']}");
                }
                if (isset($response['message'])) {
                    $this->line("   Message: {$response['message']}");
                }
                return self::SUCCESS;
            } else {
                $this->error("\n❌ Failed to send. Response:");
                $this->line(json_encode($response, JSON_PRETTY_PRINT));
                return self::FAILURE;
            }
        } catch (\Exception $e) {
            $this->error("\n❌ EXCEPTION: {$e->getMessage()}");
            return self::FAILURE;
        }
    }
}
