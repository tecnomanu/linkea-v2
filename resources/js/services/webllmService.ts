/**
 * WebLLM Service - Runs LLM models directly in the browser using WebGPU
 *
 * This service manages the WebLLM engine lifecycle and provides
 * chat completion functionality for the AI assistant.
 */

import * as webllm from "@mlc-ai/web-llm";

// Model configurations - sorted by size/capability
// Smaller models load faster but are less capable
export const AVAILABLE_MODELS = [
    {
        id: "Llama-3.2-1B-Instruct-q4f16_1-MLC",
        name: "Llama 3.2 1B (Rapido)",
        description: "Modelo pequeno, carga rapida (~700MB)",
        size: "~700MB",
        recommended: true,
    },
    {
        id: "Llama-3.2-3B-Instruct-q4f16_1-MLC",
        name: "Llama 3.2 3B (Balanceado)",
        description: "Buen balance entre velocidad y calidad (~1.8GB)",
        size: "~1.8GB",
        recommended: false,
    },
    {
        id: "Qwen2.5-1.5B-Instruct-q4f16_1-MLC",
        name: "Qwen 2.5 1.5B",
        description: "Alternativa rapida (~900MB)",
        size: "~900MB",
        recommended: false,
    },
    {
        id: "SmolLM2-1.7B-Instruct-q4f16_1-MLC",
        name: "SmolLM2 1.7B",
        description: "Modelo compacto y eficiente (~1GB)",
        size: "~1GB",
        recommended: false,
    },
] as const;

export type ModelId = (typeof AVAILABLE_MODELS)[number]["id"];

export interface ChatMessage {
    role: "system" | "user" | "assistant";
    content: string;
}

export interface InitProgress {
    progress: number;
    timeElapsed: number;
    text: string;
}

export type InitProgressCallback = (progress: InitProgress) => void;
export type StreamCallback = (chunk: string, fullText: string) => void;

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
     * Get the recommended model based on available memory
     */
    getRecommendedModel(): ModelId {
        // Default to smallest model for compatibility
        return "Llama-3.2-1B-Instruct-q4f16_1-MLC";
    }

    /**
     * Initialize the WebLLM engine with a specific model
     */
    async initialize(
        modelId: ModelId = "Llama-3.2-1B-Instruct-q4f16_1-MLC",
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
     * Send a chat completion request with streaming
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
            messages: messages,
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
            messages: messages,
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

