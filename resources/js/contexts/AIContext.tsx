/**
 * AI Context - Manages AI chat state and preview changes
 *
 * Uses WebLLM function calling to execute actions directly.
 * @see https://github.com/mlc-ai/web-llm/tree/main/examples/function-calling
 */

import { LinkBlock, UserProfile } from "@/types";
import { getSystemPrompt } from "@/services/aiBlocksPrompt";
import webllmService, {
    ChatMessage,
    InitProgress,
    ModelId,
    ToolResult,
} from "@/services/webllmService";
import { createBlockDefaults } from "@/Components/Shared/blocks/blockConfig";
import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";

// Chat message for UI display
export interface UIChatMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
    isLoading?: boolean;
    toolCalls?: ToolResult[];
}

interface AIContextValue {
    // Engine state
    isEngineReady: boolean;
    isEngineLoading: boolean;
    engineProgress: InitProgress | null;
    engineError: string | null;
    currentModel: string | null;

    // Chat state
    messages: UIChatMessage[];
    isGenerating: boolean;

    // Preview state (changes made by AI, not yet saved)
    previewLinks: LinkBlock[];
    previewDesign: Partial<UserProfile["customDesign"]> | null;
    hasUnsavedChanges: boolean;

    // Actions
    initializeEngine: (modelId?: ModelId) => Promise<void>;
    sendMessage: (content: string) => Promise<void>;
    clearChat: () => void;
    applyChanges: () => void;
    discardChanges: () => void;
    setBaseState: (links: LinkBlock[], design: UserProfile["customDesign"]) => void;
}

const AIContext = createContext<AIContextValue | null>(null);

interface AIProviderProps {
    children: ReactNode;
    // Base state from parent (the saved/current state)
    initialLinks: LinkBlock[];
    initialDesign: UserProfile["customDesign"];
    // Callbacks to apply changes to the real state
    onApplyLinks: (links: LinkBlock[]) => void;
    onApplyDesign: (design: Partial<UserProfile["customDesign"]>) => void;
}

export function AIProvider({
    children,
    initialLinks,
    initialDesign,
    onApplyLinks,
    onApplyDesign,
}: AIProviderProps) {
    // Engine state
    const [isEngineReady, setIsEngineReady] = useState(false);
    const [isEngineLoading, setIsEngineLoading] = useState(false);
    const [engineProgress, setEngineProgress] = useState<InitProgress | null>(
        null
    );
    const [engineError, setEngineError] = useState<string | null>(null);
    const [currentModel, setCurrentModel] = useState<string | null>(null);

    // Chat state
    const [messages, setMessages] = useState<UIChatMessage[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    // Base state (what's currently saved)
    const [baseLinks, setBaseLinks] = useState<LinkBlock[]>(initialLinks);
    const [baseDesign, setBaseDesign] =
        useState<UserProfile["customDesign"]>(initialDesign);

    // Preview state (AI modifications on top of base)
    const [previewLinks, setPreviewLinks] = useState<LinkBlock[]>(initialLinks);
    const [previewDesign, setPreviewDesign] = useState<Partial<
        UserProfile["customDesign"]
    > | null>(null);

    // Track if there are unsaved changes
    const hasUnsavedChanges = useMemo(() => {
        if (previewDesign !== null) return true;
        if (JSON.stringify(previewLinks) !== JSON.stringify(baseLinks))
            return true;
        return false;
    }, [previewLinks, previewDesign, baseLinks]);

    // Update base state when parent state changes
    const setBaseState = useCallback(
        (links: LinkBlock[], design: UserProfile["customDesign"]) => {
            setBaseLinks(links);
            setBaseDesign(design);
            // Reset preview to match base
            setPreviewLinks(links);
            setPreviewDesign(null);
        },
        []
    );

    // Initialize the WebLLM engine
    const initializeEngine = useCallback(async (modelId?: ModelId) => {
        setIsEngineLoading(true);
        setEngineError(null);
        setEngineProgress(null);

        try {
            await webllmService.initialize(
                modelId || "Llama-3.2-1B-Instruct-q4f16_1-MLC",
                (progress) => {
                    setEngineProgress(progress);
                }
            );
            setIsEngineReady(true);
            setCurrentModel(webllmService.getCurrentModel());
        } catch (error) {
            console.error("Failed to initialize WebLLM:", error);
            setEngineError(
                error instanceof Error
                    ? error.message
                    : "Error al inicializar el modelo"
            );
            setIsEngineReady(false);
        } finally {
            setIsEngineLoading(false);
        }
    }, []);

    // Execute a tool call from the AI
    const executeToolCall = useCallback((tool: ToolResult) => {
        const { name, arguments: args } = tool;

        switch (name) {
            case "add_block": {
                const blockType = args.type as string;
                const defaults = createBlockDefaults(blockType as any);
                const newBlock: LinkBlock = {
                    id: Math.random().toString(36).substr(2, 9),
                    isEnabled: true,
                    clicks: 0,
                    sparklineData: Array(7).fill(0).map(() => ({ value: 0 })),
                    type: blockType as any,
                    title: (args.title as string) || "",
                    url: (args.url as string) || "",
                    ...defaults,
                };

                // Add type-specific fields
                if (args.phoneNumber) newBlock.phoneNumber = args.phoneNumber as string;
                if (args.emailAddress) newBlock.emailAddress = args.emailAddress as string;
                if (args.icon) {
                    newBlock.icon = { type: "brands", name: args.icon as string };
                }

                setPreviewLinks((prev) => [newBlock, ...prev]);
                break;
            }

            case "update_design": {
                setPreviewDesign((prev) => ({
                    ...(prev || {}),
                    ...(args.backgroundColor && { backgroundColor: args.backgroundColor }),
                    ...(args.buttonColor && { buttonColor: args.buttonColor }),
                    ...(args.buttonTextColor && { buttonTextColor: args.buttonTextColor }),
                }));
                break;
            }

            case "remove_block": {
                const titleToRemove = (args.title as string).toLowerCase();
                setPreviewLinks((prev) =>
                    prev.filter((link) => link.title.toLowerCase() !== titleToRemove)
                );
                break;
            }
        }
    }, []);

    // Send a message to the AI using function calling
    const sendMessage = useCallback(
        async (content: string) => {
            if (!isEngineReady || isGenerating) return;

            // Add user message
            const userMessage: UIChatMessage = {
                id: Math.random().toString(36).substr(2, 9),
                role: "user",
                content,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, userMessage]);

            // Create assistant message placeholder
            const assistantId = Math.random().toString(36).substr(2, 9);
            setMessages((prev) => [
                ...prev,
                {
                    id: assistantId,
                    role: "assistant",
                    content: "",
                    timestamp: new Date(),
                    isLoading: true,
                },
            ]);

            setIsGenerating(true);

            try {
                // Build conversation history
                const currentBlocksSummary = previewLinks.map((link) => ({
                    type: link.type,
                    title: link.title,
                }));

                const systemPrompt = getSystemPrompt(currentBlocksSummary);

                const chatHistory: ChatMessage[] = [
                    { role: "system", content: systemPrompt },
                    ...messages.map((msg) => ({
                        role: msg.role as "user" | "assistant",
                        content: msg.content,
                    })),
                    { role: "user", content },
                ];

                // Call with function calling
                const response = await webllmService.chatWithTools(chatHistory, {
                    temperature: 0.6,
                    maxTokens: 512,
                });

                // Execute tool calls
                for (const tool of response.toolCalls) {
                    executeToolCall(tool);
                }

                // Update assistant message
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === assistantId
                            ? {
                                  ...msg,
                                  content: response.content || "",
                                  isLoading: false,
                                  toolCalls: response.toolCalls,
                              }
                            : msg
                    )
                );
            } catch (error) {
                console.error("AI chat error:", error);
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === assistantId
                            ? {
                                  ...msg,
                                  content: "Error. Please try again.",
                                  isLoading: false,
                              }
                            : msg
                    )
                );
            } finally {
                setIsGenerating(false);
            }
        },
        [isEngineReady, isGenerating, messages, previewLinks, executeToolCall]
    );

    // Clear chat history
    const clearChat = useCallback(() => {
        setMessages([]);
        webllmService.resetChat();
    }, []);

    // Apply preview changes to the real state
    const applyChanges = useCallback(() => {
        onApplyLinks(previewLinks);
        if (previewDesign) {
            onApplyDesign(previewDesign);
        }
        // Update base to match
        setBaseLinks(previewLinks);
        if (previewDesign) {
            setBaseDesign((prev) => ({ ...prev, ...previewDesign }));
        }
        setPreviewDesign(null);
    }, [previewLinks, previewDesign, onApplyLinks, onApplyDesign]);

    // Discard preview changes
    const discardChanges = useCallback(() => {
        setPreviewLinks(baseLinks);
        setPreviewDesign(null);
    }, [baseLinks]);

    const value: AIContextValue = {
        // Engine state
        isEngineReady,
        isEngineLoading,
        engineProgress,
        engineError,
        currentModel,

        // Chat state
        messages,
        isGenerating,

        // Preview state
        previewLinks,
        previewDesign,
        hasUnsavedChanges,

        // Actions
        initializeEngine,
        sendMessage,
        clearChat,
        applyChanges,
        discardChanges,
        setBaseState,
    };

    return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
}

export function useAI(): AIContextValue {
    const context = useContext(AIContext);
    if (!context) {
        throw new Error("useAI must be used within an AIProvider");
    }
    return context;
}

export type { ModelId };

