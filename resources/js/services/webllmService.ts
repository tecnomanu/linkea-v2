/**
 * WebLLM Service - Runs LLM models directly in the browser using WebGPU
 *
 * Uses Qwen 2.5 1.5B (~900MB) - good balance of size and function calling capability.
 *
 * @see https://github.com/mlc-ai/web-llm/tree/main/examples/function-calling
 */

import * as webllm from "@mlc-ai/web-llm";

// Single model - Qwen 2.5 1.5B with function calling support
export const MODEL_ID = "Qwen2.5-1.5B-Instruct-q4f16_1-MLC";
export type ModelId = typeof MODEL_ID;

export interface ChatMessage {
    role: "system" | "user" | "assistant" | "tool";
    content: string;
    tool_call_id?: string;
}

export interface InitProgress {
    progress: number;
    timeElapsed: number;
    text: string;
}

// Tool definitions for Linkea
export interface ToolCall {
    id: string;
    type: "function";
    function: {
        name: string;
        arguments: string; // JSON string
    };
}

export interface ToolResult {
    name: string;
    arguments: Record<string, unknown>;
}

export type InitProgressCallback = (progress: InitProgress) => void;
export type StreamCallback = (chunk: string, fullText: string) => void;

// Define the tools for Linkea - OpenAI-compatible format
export const LINKEA_TOOLS: webllm.ChatCompletionTool[] = [
    {
        type: "function",
        function: {
            name: "add_block",
            description:
                "Add a new block (link, header, whatsapp, etc) to the landing page",
            parameters: {
                type: "object",
                properties: {
                    type: {
                        type: "string",
                        enum: [
                            "link",
                            "header",
                            "whatsapp",
                            "youtube",
                            "spotify",
                            "email",
                        ],
                        description: "Type of block to add",
                    },
                    title: {
                        type: "string",
                        description: "Display title/text for the block",
                    },
                    url: {
                        type: "string",
                        description: "URL for link/youtube/spotify blocks",
                    },
                    phoneNumber: {
                        type: "string",
                        description:
                            "Phone number with country code for WhatsApp (e.g. +5491155667788)",
                    },
                    emailAddress: {
                        type: "string",
                        description: "Email address for email blocks",
                    },
                    icon: {
                        type: "string",
                        description:
                            "Icon name for social links (instagram, facebook, twitter, tiktok, youtube, linkedin, github, discord, twitch, spotify)",
                    },
                },
                required: ["type", "title"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "update_design",
            description: "Change the visual design/colors of the landing page",
            parameters: {
                type: "object",
                properties: {
                    backgroundColor: {
                        type: "string",
                        description:
                            "Background color in hex format (e.g. #FFEB3B for yellow, #1a1a1a for dark)",
                    },
                    buttonColor: {
                        type: "string",
                        description: "Button background color in hex format",
                    },
                    buttonTextColor: {
                        type: "string",
                        description: "Button text color in hex format",
                    },
                },
                required: [],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "remove_block",
            description: "Remove a block from the landing page by its title",
            parameters: {
                type: "object",
                properties: {
                    title: {
                        type: "string",
                        description: "Title of the block to remove",
                    },
                },
                required: ["title"],
            },
        },
    },
];

class WebLLMService {
    private engine: webllm.MLCEngine | null = null;
    private currentModel: string | null = null;
    private isInitializing = false;
    private initPromise: Promise<void> | null = null;

    /**
     * Check if WebGPU is supported in the current browser
     */
    async isWebGPUSupported(): Promise<boolean> {
        if (!navigator.gpu) {
            return false;
        }
        try {
            const adapter = await navigator.gpu.requestAdapter();
            return adapter !== null;
        } catch {
            return false;
        }
    }

    /**
     * Initialize the WebLLM engine
     */
    async initialize(
        modelId: string = MODEL_ID,
        onProgress?: InitProgressCallback
    ): Promise<void> {
        // If already initializing, wait for that to complete
        if (this.initPromise) {
            await this.initPromise;
            // If same model, we're done
            if (this.currentModel === modelId) {
                return;
            }
        }

        // If already loaded with same model, skip
        if (this.engine && this.currentModel === modelId) {
            return;
        }

        this.isInitializing = true;

        this.initPromise = (async () => {
            try {
                // Check WebGPU support first
                const supported = await this.isWebGPUSupported();
                if (!supported) {
                    throw new Error(
                        "WebGPU no esta soportado en este navegador. Usa Chrome 113+ o Edge 113+."
                    );
                }

                // Create engine if not exists
                if (!this.engine) {
                    this.engine = new webllm.MLCEngine();
                }

                // Set progress callback
                if (onProgress) {
                    this.engine.setInitProgressCallback(
                        (report: webllm.InitProgressReport) => {
                            onProgress({
                                progress: report.progress,
                                timeElapsed: report.timeElapsed,
                                text: report.text,
                            });
                        }
                    );
                }

                // Load the model
                await this.engine.reload(modelId);
                this.currentModel = modelId;
            } finally {
                this.isInitializing = false;
                this.initPromise = null;
            }
        })();

        await this.initPromise;
    }

    /**
     * Check if the engine is ready for chat
     */
    isReady(): boolean {
        return this.engine !== null && this.currentModel !== null;
    }

    /**
     * Check if currently initializing
     */
    isLoading(): boolean {
        return this.isInitializing;
    }

    /**
     * Get the current loaded model
     */
    getCurrentModel(): string | null {
        return this.currentModel;
    }

    /**
     * Send a chat completion request with function calling
     * Returns both the text response and any tool calls
     */
    async chatWithTools(
        messages: ChatMessage[],
        options?: {
            temperature?: number;
            maxTokens?: number;
        }
    ): Promise<{
        content: string | null;
        toolCalls: ToolResult[];
    }> {
        if (!this.engine) {
            throw new Error("Engine not initialized. Call initialize() first.");
        }

        const response = await this.engine.chat.completions.create({
            messages: messages as webllm.ChatCompletionMessageParam[],
            temperature: options?.temperature ?? 0.6,
            max_tokens: options?.maxTokens ?? 512,
            tools: LINKEA_TOOLS,
            tool_choice: "auto",
        });

        const message = response.choices[0]?.message;
        const toolCalls: ToolResult[] = [];

        // Parse tool calls if present
        if (message?.tool_calls) {
            for (const call of message.tool_calls) {
                if (call.type === "function") {
                    try {
                        const args = JSON.parse(call.function.arguments);
                        toolCalls.push({
                            name: call.function.name,
                            arguments: args,
                        });
                    } catch (e) {
                        console.error(
                            "Failed to parse tool call arguments:",
                            e
                        );
                    }
                }
            }
        }

        return {
            content: message?.content || null,
            toolCalls,
        };
    }

    /**
     * Send a chat completion request with streaming (no tools)
     */
    async chatStream(
        messages: ChatMessage[],
        onStream: StreamCallback,
        options?: {
            temperature?: number;
            maxTokens?: number;
        }
    ): Promise<string> {
        if (!this.engine) {
            throw new Error("Engine not initialized. Call initialize() first.");
        }

        let fullResponse = "";

        const asyncChunkGenerator = await this.engine.chat.completions.create({
            messages: messages as webllm.ChatCompletionMessageParam[],
            temperature: options?.temperature ?? 0.7,
            max_tokens: options?.maxTokens ?? 2048,
            stream: true,
            stream_options: { include_usage: true },
        });

        for await (const chunk of asyncChunkGenerator) {
            const delta = chunk.choices[0]?.delta?.content || "";
            if (delta) {
                fullResponse += delta;
                onStream(delta, fullResponse);
            }
        }

        return fullResponse;
    }

    /**
     * Send a chat completion request without streaming
     */
    async chat(
        messages: ChatMessage[],
        options?: {
            temperature?: number;
            maxTokens?: number;
        }
    ): Promise<string> {
        if (!this.engine) {
            throw new Error("Engine not initialized. Call initialize() first.");
        }

        const response = await this.engine.chat.completions.create({
            messages: messages as webllm.ChatCompletionMessageParam[],
            temperature: options?.temperature ?? 0.7,
            max_tokens: options?.maxTokens ?? 2048,
        });

        return response.choices[0]?.message?.content || "";
    }

    /**
     * Reset the chat context (clear conversation history in the model)
     */
    async resetChat(): Promise<void> {
        if (this.engine) {
            await this.engine.resetChat();
        }
    }

    /**
     * Unload the model and free resources
     */
    async unload(): Promise<void> {
        if (this.engine) {
            await this.engine.unload();
            this.currentModel = null;
        }
    }

    /**
     * Get GPU memory usage (if available)
     */
    async getMemoryUsage(): Promise<{ used: number; total: number } | null> {
        try {
            // @ts-ignore - experimental API
            if (navigator.gpu && navigator.gpu.requestAdapter) {
                // @ts-ignore
                const adapter = await navigator.gpu.requestAdapter();
                if (adapter) {
                    // Memory info not always available
                    return null;
                }
            }
        } catch {
            // Ignore errors
        }
        return null;
    }
}

// Export singleton instance
export const webllmService = new WebLLMService();
export default webllmService;
