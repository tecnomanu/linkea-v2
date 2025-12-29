/**
 * WebLLM Service - Runs LLM models directly in the browser using WebGPU
 *
 * Uses Hermes-3-Llama-3.2-3B - smallest model with native function calling.
 * Only Hermes models support tools in WebLLM.
 *
 * @see https://github.com/mlc-ai/web-llm/tree/main/examples/function-calling
 */

import * as webllm from "@mlc-ai/web-llm";

// Hermes-3-Llama-3.2-3B is the smallest model with function calling support
export const MODEL_ID = "Hermes-3-Llama-3.2-3B-q4f16_1-MLC";
export const MODEL_SIZE = "2GB";
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
                "Add a new block (link, header, whatsapp, youtube, spotify, email) to the landing page",
            parameters: {
                type: "object",
                properties: {
                    type: {
                        type: "string",
                        enum: ["link", "header", "whatsapp", "youtube", "spotify", "email"],
                        description: "Type of block to add",
                    },
                    title: {
                        type: "string",
                        description: "Display title/text for the block",
                    },
                    url: {
                        type: "string",
                        description: "URL for link/youtube/spotify blocks. Build it yourself from username.",
                    },
                    phoneNumber: {
                        type: "string",
                        description: "Phone number with country code for WhatsApp (e.g. +5491155667788)",
                    },
                    emailAddress: {
                        type: "string",
                        description: "Email address for email blocks",
                    },
                    icon: {
                        type: "string",
                        description: "Icon name: instagram, facebook, twitter, tiktok, youtube, linkedin, github, discord, twitch, spotify",
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
                        description: "Background color hex (yellow=#FFEB3B, red=#F44336, blue=#2196F3, green=#4CAF50, dark=#1a1a1a, pink=#E91E63)",
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
                const supported = await this.isWebGPUSupported();
                if (!supported) {
                    throw new Error(
                        "WebGPU no esta soportado en este navegador. Usa Chrome 113+ o Edge 113+."
                    );
                }

                if (!this.engine) {
                    this.engine = new webllm.MLCEngine();
                }

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

                await this.engine.reload(modelId);
                this.currentModel = modelId;
            } finally {
                this.isInitializing = false;
                this.initPromise = null;
            }
        })();

        await this.initPromise;
    }

    isReady(): boolean {
        return this.engine !== null && this.currentModel !== null;
    }

    isLoading(): boolean {
        return this.isInitializing;
    }

    getCurrentModel(): string | null {
        return this.currentModel;
    }

    /**
     * Chat with function calling - returns text response and tool calls
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
                        console.error("Failed to parse tool call arguments:", e);
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
     * Simple chat without tools (for conversation)
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
            max_tokens: options?.maxTokens ?? 512,
        });

        return response.choices[0]?.message?.content || "";
    }

    async resetChat(): Promise<void> {
        if (this.engine) {
            await this.engine.resetChat();
        }
    }

    async unload(): Promise<void> {
        if (this.engine) {
            await this.engine.unload();
            this.currentModel = null;
        }
    }
}

// Export singleton instance
export const webllmService = new WebLLMService();
export default webllmService;
