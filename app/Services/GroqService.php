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
    private string $model = 'llama-3.3-70b-versatile';

    /**
     * All available block types with their properties
     * Maps to resources/js/Components/Shared/blocks/blockConfig.ts
     */
    private const BLOCK_TYPES = [
        'link' => [
            'description' => 'Standard link to any website. Use icon param for social networks.',
            'requiresUrl' => true,
        ],
        'header' => [
            'description' => 'Section divider/title to organize blocks',
            'requiresUrl' => false,
        ],
        'whatsapp' => [
            'description' => 'WhatsApp button with direct chat. Requires phoneNumber with country code.',
            'requiresUrl' => false,
        ],
        'youtube' => [
            'description' => 'YouTube video with embedded player',
            'requiresUrl' => true,
        ],
        'spotify' => [
            'description' => 'Spotify song/album with embedded player',
            'requiresUrl' => true,
        ],
        'twitch' => [
            'description' => 'Twitch channel with live stream embed',
            'requiresUrl' => true,
        ],
        'tiktok' => [
            'description' => 'TikTok video embed',
            'requiresUrl' => true,
        ],
        'vimeo' => [
            'description' => 'Vimeo video embed',
            'requiresUrl' => true,
        ],
        'soundcloud' => [
            'description' => 'SoundCloud track embed',
            'requiresUrl' => true,
        ],
        'calendar' => [
            'description' => 'Booking calendar (Calendly/Cal.com)',
            'requiresUrl' => true,
        ],
        'email' => [
            'description' => 'Email contact button. Requires emailAddress.',
            'requiresUrl' => false,
        ],
        'map' => [
            'description' => 'Google Maps location. Requires mapAddress.',
            'requiresUrl' => false,
        ],
        'mastodon' => [
            'description' => 'Mastodon profile verification',
            'requiresUrl' => true,
        ],
    ];

    /**
     * Button style options
     */
    private const BUTTON_STYLES = ['solid', 'outline', 'soft', 'hard'];
    private const BUTTON_SHAPES = ['sharp', 'rounded', 'pill'];
    private const FONT_PAIRS = ['modern', 'elegant', 'mono'];

    /**
     * Function tools for the AI
     */
    private array $tools;

    public function __construct()
    {
        $apiKey = config('services.groq.api_key');

        Log::info('GroqService initialized', [
            'api_key_set' => !empty($apiKey),
        ]);

        $this->client = OpenAI::factory()
            ->withApiKey($apiKey)
            ->withBaseUri('https://api.groq.com/openai/v1')
            ->make();

        $this->tools = $this->buildTools();
    }

    /**
     * Build the tools array with all block types and functions
     */
    private function buildTools(): array
    {
        $blockTypes = array_keys(self::BLOCK_TYPES);

        return [
            // Add block
            [
                'type' => 'function',
                'function' => [
                    'name' => 'add_block',
                    'description' => 'Add a new block to the landing page',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'type' => [
                                'type' => 'string',
                                'enum' => $blockTypes,
                                'description' => 'Block type: ' . implode(', ', array_map(
                                    fn($t, $d) => "$t ({$d['description']})",
                                    $blockTypes,
                                    array_values(self::BLOCK_TYPES)
                                )),
                            ],
                            'title' => [
                                'type' => 'string',
                                'description' => 'Display title for the block',
                            ],
                            'url' => [
                                'type' => 'string',
                                'description' => 'URL for link/media blocks. Build full URLs from usernames.',
                            ],
                            'phoneNumber' => [
                                'type' => 'string',
                                'description' => 'WhatsApp phone with country code (e.g. +5491155667788)',
                            ],
                            'emailAddress' => [
                                'type' => 'string',
                                'description' => 'Email address for email blocks',
                            ],
                            'mapAddress' => [
                                'type' => 'string',
                                'description' => 'Physical address for map blocks',
                            ],
                            'icon' => [
                                'type' => 'string',
                                'description' => 'Icon for link type: instagram, facebook, twitter, tiktok, youtube, linkedin, github, discord, twitch, spotify, threads, telegram, pinterest, snapchat',
                            ],
                            'showInlinePlayer' => [
                                'type' => 'boolean',
                                'description' => 'Show embedded player for youtube/spotify/twitch/vimeo/soundcloud. Default true for these types.',
                            ],
                        ],
                        'required' => ['type', 'title'],
                    ],
                ],
            ],
            // Edit block
            [
                'type' => 'function',
                'function' => [
                    'name' => 'edit_block',
                    'description' => 'Edit an existing block by its title',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'currentTitle' => [
                                'type' => 'string',
                                'description' => 'Current title of the block to edit',
                            ],
                            'newTitle' => [
                                'type' => 'string',
                                'description' => 'New title (optional)',
                            ],
                            'newUrl' => [
                                'type' => 'string',
                                'description' => 'New URL (optional)',
                            ],
                            'newIcon' => [
                                'type' => 'string',
                                'description' => 'New icon (optional)',
                            ],
                        ],
                        'required' => ['currentTitle'],
                    ],
                ],
            ],
            // Remove block
            [
                'type' => 'function',
                'function' => [
                    'name' => 'remove_block',
                    'description' => 'Remove a block from the landing page',
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
            // Update design
            [
                'type' => 'function',
                'function' => [
                    'name' => 'update_design',
                    'description' => 'Change the visual design of the landing page',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'backgroundColor' => [
                                'type' => 'string',
                                'description' => 'Background color in hex format (#RRGGBB)',
                            ],
                            'buttonColor' => [
                                'type' => 'string',
                                'description' => 'Button background color in hex',
                            ],
                            'buttonTextColor' => [
                                'type' => 'string',
                                'description' => 'Button text color in hex',
                            ],
                            'buttonStyle' => [
                                'type' => 'string',
                                'enum' => self::BUTTON_STYLES,
                                'description' => 'Button style: solid (filled), outline (border only), soft (semi-transparent), hard (brutalist/shadow)',
                            ],
                            'buttonShape' => [
                                'type' => 'string',
                                'enum' => self::BUTTON_SHAPES,
                                'description' => 'Button shape: sharp (square corners), rounded (soft corners), pill (fully rounded)',
                            ],
                            'fontPair' => [
                                'type' => 'string',
                                'enum' => self::FONT_PAIRS,
                                'description' => 'Font style: modern (sans-serif), elegant (serif), mono (monospace)',
                            ],
                            'roundedAvatar' => [
                                'type' => 'boolean',
                                'description' => 'Whether avatar should be circular',
                            ],
                        ],
                        'required' => [],
                    ],
                ],
            ],
        ];
    }

    /**
     * Generate system prompt with current context
     */
    public function getSystemPrompt(array $currentBlocks = [], array $currentDesign = []): string
    {
        // Format blocks
        $blocksSummary = empty($currentBlocks)
            ? 'ninguno'
            : collect($currentBlocks)->map(fn($b) => "- \"{$b['title']}\" (tipo: {$b['type']})")->implode("\n");

        // Format design
        $designSummary = '';
        if (!empty($currentDesign)) {
            $parts = [];
            if (!empty($currentDesign['backgroundColor'])) $parts[] = "Fondo: {$currentDesign['backgroundColor']}";
            if (!empty($currentDesign['buttonColor'])) $parts[] = "Color botones: {$currentDesign['buttonColor']}";
            if (!empty($currentDesign['buttonTextColor'])) $parts[] = "Texto botones: {$currentDesign['buttonTextColor']}";
            if (!empty($currentDesign['buttonStyle'])) $parts[] = "Estilo: {$currentDesign['buttonStyle']}";
            if (!empty($currentDesign['buttonShape'])) $parts[] = "Forma: {$currentDesign['buttonShape']}";
            if (!empty($currentDesign['fontPair'])) $parts[] = "Fuente: {$currentDesign['fontPair']}";
            $designSummary = implode(', ', $parts);
        }

        return <<<PROMPT
Sos el asistente de Linkea, una plataforma de "link in bio".
Responde siempre en el idioma del usuario. Se amigable, breve y con buena onda.

=== ESTADO ACTUAL ===
Bloques en la pagina:
{$blocksSummary}

Diseño actual: {$designSummary}

=== TIPOS DE BLOQUES ===
- link: Enlace estandar. Usa "icon" para redes sociales (instagram, twitter, tiktok, youtube, linkedin, github, facebook, discord, twitch, threads, telegram, pinterest)
- header: Titulo/separador de seccion
- whatsapp: Boton de WhatsApp (requiere phoneNumber con codigo de pais)
- youtube: Video de YouTube con reproductor
- spotify: Cancion/album de Spotify con reproductor
- twitch: Canal de Twitch con stream en vivo
- tiktok, vimeo, soundcloud: Videos/audio con reproductor
- calendar: Agenda de citas (Calendly, Cal.com)
- email: Boton de email (requiere emailAddress)
- map: Ubicacion en mapa (requiere mapAddress)

=== REGLAS IMPORTANTES ===

1. DUPLICADOS: Antes de agregar, verifica si ya existe un bloque similar en la lista.
   Si ya existe, NO lo agregues. Responde amablemente: "Ya tenes un enlace a [red social/servicio]! No hace falta agregarlo de nuevo."

2. CONSTRUYE URLs completas desde usernames:
   - Instagram: https://instagram.com/USERNAME
   - TikTok: https://tiktok.com/@USERNAME
   - Twitter/X: https://twitter.com/USERNAME
   - YouTube: https://youtube.com/@USERNAME
   - Twitch: https://twitch.tv/USERNAME
   - GitHub: https://github.com/USERNAME
   - LinkedIn: https://linkedin.com/in/USERNAME
   - Facebook: https://facebook.com/USERNAME

3. Si falta info necesaria (username, telefono, email), PREGUNTA antes de ejecutar.

4. Usa el TIPO CORRECTO:
   - Twitch: type="twitch" (NO type="link")
   - YouTube: type="youtube" (NO type="link")
   - Redes sin embed (Instagram, Twitter): type="link" con icon

5. ESTILO DE RESPUESTA - Se amigable y usa frases variadas:
   - Al agregar: "Dale, lo agrego!" / "Perfecto, ahi va!" / "Listo, ya lo puse!"
   - Al modificar: "Hecho! Ya lo cambie." / "Listo, modificado!"
   - Al eliminar: "Ya lo saque!" / "Eliminado!"
   - Siempre responde con un mensaje corto y amigable ADEMAS de ejecutar la accion.
PROMPT;
    }

    /**
     * Chat with function calling (non-streaming)
     */
    public function chat(array $messages, array $currentBlocks = [], array $currentDesign = []): array
    {
        $systemPrompt = $this->getSystemPrompt($currentBlocks, $currentDesign);

        $allMessages = array_merge(
            [['role' => 'system', 'content' => $systemPrompt]],
            $messages
        );

        Log::info('=== GROQ CHAT REQUEST ===');
        Log::info('System Prompt:', ['prompt' => $systemPrompt]);
        Log::info('Messages:', ['messages' => $messages]);

        try {
            $response = $this->client->chat()->create([
                'model' => $this->model,
                'messages' => $allMessages,
                'tools' => $this->tools,
                'tool_choice' => 'auto',
                'temperature' => 0.5,
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
     */
    public function streamChat(array $messages, array $currentBlocks = [], array $currentDesign = []): \Generator
    {
        $systemPrompt = $this->getSystemPrompt($currentBlocks, $currentDesign);

        $allMessages = array_merge(
            [['role' => 'system', 'content' => $systemPrompt]],
            $messages
        );

        Log::info('=== GROQ STREAM REQUEST ===');
        Log::info('Messages:', ['messages' => $messages]);

        try {
            $stream = $this->client->chat()->createStreamed([
                'model' => $this->model,
                'messages' => $allMessages,
                'tools' => $this->tools,
                'tool_choice' => 'auto',
                'temperature' => 0.5,
                'max_tokens' => 512,
            ]);

            $toolCalls = [];
            $fullContent = '';

            foreach ($stream as $response) {
                $delta = $response->choices[0]->delta;

                if ($delta->content) {
                    $fullContent .= $delta->content;
                    yield [
                        'type' => 'content',
                        'content' => $delta->content,
                    ];
                }

                if ($delta->toolCalls) {
                    foreach ($delta->toolCalls as $toolCallDelta) {
                        $index = $toolCallDelta->index;

                        if (!isset($toolCalls[$index])) {
                            $toolCalls[$index] = ['name' => '', 'arguments' => ''];
                        }

                        if ($toolCallDelta->function->name) {
                            $toolCalls[$index]['name'] = $toolCallDelta->function->name;
                        }

                        if ($toolCallDelta->function->arguments) {
                            $toolCalls[$index]['arguments'] .= $toolCallDelta->function->arguments;
                        }
                    }
                }

                if ($response->choices[0]->finishReason) {
                    break;
                }
            }

            Log::info('=== GROQ STREAM RESPONSE ===');
            Log::info('Content:', ['content' => $fullContent]);
            Log::info('Tool Calls:', ['toolCalls' => $toolCalls]);

            foreach ($toolCalls as $call) {
                if ($call['name'] && $call['arguments']) {
                    $parsedArgs = json_decode($call['arguments'], true);
                    yield [
                        'type' => 'tool_call',
                        'name' => $call['name'],
                        'arguments' => $parsedArgs,
                    ];
                }
            }

            yield ['type' => 'done'];
        } catch (\Exception $e) {
            Log::error('Groq streaming error: ' . $e->getMessage());
            yield [
                'type' => 'error',
                'message' => 'Error en la conexion con el asistente',
            ];
        }
    }
}
