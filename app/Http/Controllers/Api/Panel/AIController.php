<?php

namespace App\Http\Controllers\Api\Panel;

use App\Http\Controllers\Controller;
use App\Services\GroqService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AIController extends Controller
{
    private GroqService $groqService;

    public function __construct(GroqService $groqService)
    {
        $this->groqService = $groqService;
    }

    /**
     * Chat with AI assistant using SSE streaming
     *
     * POST /api/panel/ai/chat
     */
    public function chat(Request $request): StreamedResponse
    {
        $request->validate([
            'messages' => 'required|array',
            'messages.*.role' => 'required|in:user,assistant',
            'messages.*.content' => 'required|string',
            'currentBlocks' => 'array',
            'currentDesign' => 'array',
        ]);

        $messages = $request->input('messages');
        $currentBlocks = $request->input('currentBlocks', []);
        $currentDesign = $request->input('currentDesign', []);

        Log::info('=== AI CHAT ENDPOINT CALLED ===', [
            'messages_count' => count($messages),
            'blocks_count' => count($currentBlocks),
            'design' => $currentDesign,
        ]);

        return new StreamedResponse(function () use ($messages, $currentBlocks, $currentDesign) {
            // Disable output buffering
            if (ob_get_level()) {
                ob_end_clean();
            }

            try {
                // Use non-streaming for now (more reliable with tool calls)
                $response = $this->groqService->chat($messages, $currentBlocks, $currentDesign);

                // Send content if present
                if ($response['content']) {
                    $this->sendSSE([
                        'type' => 'content',
                        'content' => $response['content'],
                    ]);
                }

                // Send tool calls
                foreach ($response['toolCalls'] as $toolCall) {
                    $this->sendSSE([
                        'type' => 'tool_call',
                        'name' => $toolCall['name'],
                        'arguments' => $toolCall['arguments'],
                    ]);
                }

                $this->sendSSE(['type' => 'done']);
            } catch (\Exception $e) {
                Log::error('AI chat error: ' . $e->getMessage(), [
                    'trace' => $e->getTraceAsString(),
                ]);
                $this->sendSSE([
                    'type' => 'error',
                    'message' => 'Error: ' . $e->getMessage(),
                ]);
            }
        }, 200, [
            'Content-Type' => 'text/event-stream',
            'Cache-Control' => 'no-cache',
            'Connection' => 'keep-alive',
            'X-Accel-Buffering' => 'no', // Disable nginx buffering
        ]);
    }

    /**
     * Send SSE event
     */
    private function sendSSE(array $data): void
    {
        echo "data: " . json_encode($data) . "\n\n";

        if (connection_aborted()) {
            return;
        }

        flush();
    }

    /**
     * Non-streaming chat endpoint (fallback)
     *
     * POST /api/panel/ai/chat-sync
     */
    public function chatSync(Request $request)
    {
        $request->validate([
            'messages' => 'required|array',
            'messages.*.role' => 'required|in:user,assistant',
            'messages.*.content' => 'required|string',
            'currentBlocks' => 'array',
            'currentDesign' => 'array',
        ]);

        $messages = $request->input('messages');
        $currentBlocks = $request->input('currentBlocks', []);
        $currentDesign = $request->input('currentDesign', []);

        try {
            $response = $this->groqService->chat($messages, $currentBlocks, $currentDesign);

            return response()->json([
                'success' => true,
                'content' => $response['content'],
                'toolCalls' => $response['toolCalls'],
            ]);
        } catch (\Exception $e) {
            Log::error('AI chat error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Error en el asistente. Intenta de nuevo.',
            ], 500);
        }
    }
}
