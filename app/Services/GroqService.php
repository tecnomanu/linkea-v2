<?php

namespace App\Services;

use OpenAI;
use Illuminate\Support\Facades\Log;

/**
 * Groq AI Service - Compatible with OpenAI API
 *
 * Provides chat completions with function calling for the AI assistant.
 */
class GroqService
{
    private $client;
    // Model optimized for tool/function calling
    private string $model = 'llama-3.3-70b-versatile';

    // Tools for Linkea block management
    private array $tools = [
        [
            'type' => 'function',
            'function' => [
                'name' => 'add_block',
                'description' => 'Add a new block (link, header, whatsapp, youtube, spotify, email) to the landing page',
                'parameters' => [
                    'type' => 'object',
                    'properties' => [
                        'type' => [
                            'type' => 'string',
                            'enum' => ['link', 'header', 'whatsapp', 'youtube', 'spotify', 'email'],
                            'description' => 'Type of block to add',
                        ],
                        'title' => [
                            'type' => 'string',
                            'description' => 'Display title/text for the block',
                        ],
                        'url' => [
                            'type' => 'string',
                            'description' => 'URL for link/youtube/spotify blocks. Build it yourself from username.',
                        ],
                        'phoneNumber' => [
                            'type' => 'string',
                            'description' => 'Phone number with country code for WhatsApp (e.g. +5491155667788)',
                        ],
                        'emailAddress' => [
                            'type' => 'string',
                            'description' => 'Email address for email blocks',
                        ],
                        'icon' => [
                            'type' => 'string',
                            'description' => 'Icon name: instagram, facebook, twitter, tiktok, youtube, linkedin, github, discord, twitch, spotify',
                        ],
                    ],
                    'required' => ['type', 'title'],
                ],
            ],
        ],
        [
            'type' => 'function',
            'function' => [
                'name' => 'update_design',
                'description' => 'Change the visual design/colors of the landing page',
                'parameters' => [
                    'type' => 'object',
                    'properties' => [
                        'backgroundColor' => [
                            'type' => 'string',
                            'description' => 'Background color hex (yellow=#FFEB3B, red=#F44336, blue=#2196F3, green=#4CAF50, dark=#1a1a1a, pink=#E91E63)',
                        ],
                        'buttonColor' => [
                            'type' => 'string',
                            'description' => 'Button background color in hex format',
                        ],
                        'buttonTextColor' => [
                            'type' => 'string',
                            'description' => 'Button text color in hex format',
                        ],
                    ],
                    'required' => [],
                ],
            ],
        ],
        [
            'type' => 'function',
            'function' => [
                'name' => 'remove_block',
                'description' => 'Remove a block from the landing page by its title',
                'parameters' => [
                    'type' => 'object',
                    'properties' => [
                        'title' => [
                            'type' => 'string',
                            'description' => 'Title of the block to remove',
                        ],
                    ],
                    'required' => ['title'],
                ],
            ],
        ],
    ];

    public function __construct()
    {
        $apiKey = config('services.groq.api_key');
        
        Log::info('GroqService initialized', [
            'api_key_set' => !empty($apiKey),
            'api_key_prefix' => $apiKey ? substr($apiKey, 0, 10) . '...' : 'NOT SET',
        ]);

        $this->client = OpenAI::factory()
            ->withApiKey($apiKey)
            ->withBaseUri('https://api.groq.com/openai/v1')
            ->make();
    }

    /**
     * Generate system prompt with current blocks context
     */
    public function getSystemPrompt(array $currentBlocks = []): string
    {
        $blocksSummary = empty($currentBlocks)
            ? 'empty'
            : collect($currentBlocks)->map(fn($b) => "\"{$b['title']}\" ({$b['type']})")->implode(', ');

        return <<<PROMPT
You are Linkea's assistant. Help users create their "link in bio" page.
Respond in the user's language. Be friendly and brief.

Current blocks on page: {$blocksSummary}

You have tools to:
- add_block: Add links, headers, WhatsApp, YouTube, Spotify, email
- update_design: Change colors (background, buttons)
- remove_block: Delete blocks by title

IMPORTANT RULES:
1. If user gives a username like @john or john, BUILD THE FULL URL:
   - Instagram: https://instagram.com/john
   - TikTok: https://tiktok.com/@john
   - Twitter: https://twitter.com/john
   - YouTube: https://youtube.com/@john
   - Facebook: https://facebook.com/john
   - LinkedIn: https://linkedin.com/in/john
   - GitHub: https://github.com/john

2. If required info is MISSING (no username, no phone), ask before calling tools.

3. For WhatsApp, phone must include country code (+5491155667788).

4. For social links, use icon name: instagram, tiktok, twitter, youtube, etc.

5. Common colors: yellow=#FFEB3B, red=#F44336, blue=#2196F3, green=#4CAF50, 
   dark=#1a1a1a, white=#FFFFFF, pink=#E91E63, purple=#9C27B0

6. Always respond with a brief friendly message after executing tools.
PROMPT;
    }

    /**
     * Chat with function calling (non-streaming)
     */
    public function chat(array $messages, array $currentBlocks = []): array
    {
        $systemPrompt = $this->getSystemPrompt($currentBlocks);

        $allMessages = array_merge(
            [['role' => 'system', 'content' => $systemPrompt]],
            $messages
        );

        // Log the request
        Log::info('=== GROQ CHAT REQUEST ===');
        Log::info('System Prompt:', ['prompt' => $systemPrompt]);
        Log::info('Messages:', ['messages' => $messages]);
        Log::info('Current Blocks:', ['blocks' => $currentBlocks]);

        try {
            $response = $this->client->chat()->create([
                'model' => $this->model,
                'messages' => $allMessages,
                'tools' => $this->tools,
                'tool_choice' => 'auto',
                'temperature' => 0.6,
                'max_tokens' => 512,
            ]);

            $message = $response->choices[0]->message;
            $toolCalls = [];

            if ($message->toolCalls) {
                foreach ($message->toolCalls as $call) {
                    $toolCalls[] = [
                        'name' => $call->function->name,
                        'arguments' => json_decode($call->function->arguments, true),
                    ];
                }
            }

            // Log the response
            Log::info('=== GROQ CHAT RESPONSE ===');
            Log::info('Content:', ['content' => $message->content]);
            Log::info('Tool Calls:', ['toolCalls' => $toolCalls]);

            return [
                'content' => $message->content,
                'toolCalls' => $toolCalls,
            ];
        } catch (\Exception $e) {
            Log::error('Groq API error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            throw $e;
        }
    }

    /**
     * Stream chat response with function calling
     * Returns a generator for SSE streaming
     */
    public function streamChat(array $messages, array $currentBlocks = []): \Generator
    {
        $systemPrompt = $this->getSystemPrompt($currentBlocks);

        $allMessages = array_merge(
            [['role' => 'system', 'content' => $systemPrompt]],
            $messages
        );

        // Log the request
        Log::info('=== GROQ STREAM REQUEST ===');
        Log::info('System Prompt:', ['prompt' => $systemPrompt]);
        Log::info('Messages:', ['messages' => $messages]);
        Log::info('Current Blocks:', ['blocks' => $currentBlocks]);

        try {
            $stream = $this->client->chat()->createStreamed([
                'model' => $this->model,
                'messages' => $allMessages,
                'tools' => $this->tools,
                'tool_choice' => 'auto',
                'temperature' => 0.6,
                'max_tokens' => 512,
            ]);

            $toolCalls = [];
            $currentToolCall = null;

            foreach ($stream as $response) {
                $delta = $response->choices[0]->delta;

                // Handle content streaming
                if ($delta->content) {
                    yield [
                        'type' => 'content',
                        'content' => $delta->content,
                    ];
                }

                // Handle tool calls
                if ($delta->toolCalls) {
                    foreach ($delta->toolCalls as $toolCallDelta) {
                        $index = $toolCallDelta->index;

                        if (!isset($toolCalls[$index])) {
                            $toolCalls[$index] = [
                                'name' => '',
                                'arguments' => '',
                            ];
                        }

                        if ($toolCallDelta->function->name) {
                            $toolCalls[$index]['name'] = $toolCallDelta->function->name;
                        }

                        if ($toolCallDelta->function->arguments) {
                            $toolCalls[$index]['arguments'] .= $toolCallDelta->function->arguments;
                        }
                    }
                }

                // Check for finish reason
                if ($response->choices[0]->finishReason) {
                    break;
                }
            }

            // Log and yield tool calls at the end
            Log::info('=== GROQ STREAM RESPONSE ===');
            Log::info('Tool Calls:', ['toolCalls' => $toolCalls]);

            foreach ($toolCalls as $call) {
                if ($call['name'] && $call['arguments']) {
                    $parsedArgs = json_decode($call['arguments'], true);
                    Log::info('Executing tool:', [
                        'name' => $call['name'],
                        'arguments' => $parsedArgs,
                    ]);
                    yield [
                        'type' => 'tool_call',
                        'name' => $call['name'],
                        'arguments' => $parsedArgs,
                    ];
                }
            }

            yield ['type' => 'done'];
        } catch (\Exception $e) {
            Log::error('Groq streaming error: ' . $e->getMessage(), [
                'exception' => $e->getTraceAsString(),
            ]);
            yield [
                'type' => 'error',
                'message' => 'Error en la conexion con el asistente',
            ];
        }
    }
}
