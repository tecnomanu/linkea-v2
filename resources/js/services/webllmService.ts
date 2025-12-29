/**
 * WebLLM Service - Runs LLM models directly in the browser using WebGPU
 *
 * Uses Qwen 2.5 1.5B - small and efficient model.
 * Note: Function calling is done via JSON parsing (not native tools).
 * Only Hermes models (4GB+) support native tools, which is too heavy.
 *
 * @see https://github.com/mlc-ai/web-llm
 */

import * as webllm from "@mlc-ai/web-llm";

// Single model - Qwen 2.5 1.5B is small and capable
// Note: For native function calling you'd need Hermes-2-Pro-Mistral-7B (~4GB)
export const MODEL_ID = "Qwen2.5-1.5B-Instruct-q4f16_1-MLC";
export const MODEL_SIZE = "900MB";
export type ModelId = typeof MODEL_ID;

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
