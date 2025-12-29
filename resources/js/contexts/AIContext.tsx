/**
 * AI Context - Manages AI chat state and preview changes
 *
 * Uses WebLLM with Hermes-3-Llama-3.2-3B (~2GB) for local AI with native function calling.
 */

import { LinkBlock, UserProfile } from "@/types";
import { getSystemPrompt, generateMessageFromTool } from "@/services/aiBlocksPrompt";
import webllmService, {
    ChatMessage,
    InitProgress,
    MODEL_ID,
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

// Action type for UI display
export interface AIAction {
    action: "add_block" | "update_design" | "remove_block";
    type?: string;
    title?: string;
    icon?: string;
    backgroundColor?: string;
    buttonColor?: string;
    buttonTextColor?: string;
}

// Chat message for UI display
export interface UIChatMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
    isLoading?: boolean;
    action?: AIAction;
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
    initializeEngine: (modelId?: string) => Promise<void>;
    sendMessage: (content: string) => Promise<void>;
    clearChat: () => void;
    applyChanges: () => void;
    discardChanges: () => void;
    setBaseState: (links: LinkBlock[], design: UserProfile["customDesign"]) => void;
}

const AIContext = createContext<AIContextValue | null>(null);

interface AIProviderProps {
    children: ReactNode;
    initialLinks: LinkBlock[];
    initialDesign: UserProfile["customDesign"];
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
    const [engineProgress, setEngineProgress] = useState<InitProgress | null>(null);
    const [engineError, setEngineError] = useState<string | null>(null);
    const [currentModel, setCurrentModel] = useState<string | null>(null);

    // Chat state
    const [messages, setMessages] = useState<UIChatMessage[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    // Base state (what's currently saved)
    const [baseLinks, setBaseLinks] = useState<LinkBlock[]>(initialLinks);
    const [baseDesign, setBaseDesign] = useState<UserProfile["customDesign"]>(initialDesign);

    // Preview state (AI modifications on top of base)
    const [previewLinks, setPreviewLinks] = useState<LinkBlock[]>(initialLinks);
    const [previewDesign, setPreviewDesign] = useState<Partial<UserProfile["customDesign"]> | null>(null);

    // Track if there are unsaved changes
    const hasUnsavedChanges = useMemo(() => {
        if (previewDesign !== null) return true;
        if (JSON.stringify(previewLinks) !== JSON.stringify(baseLinks)) return true;
        return false;
    }, [previewLinks, previewDesign, baseLinks]);

    // Update base state when parent state changes
    const setBaseState = useCallback(
        (links: LinkBlock[], design: UserProfile["customDesign"]) => {
            setBaseLinks(links);
            setBaseDesign(design);
            setPreviewLinks(links);
            setPreviewDesign(null);
        },
        []
    );

    // Initialize the WebLLM engine
    const initializeEngine = useCallback(async (modelId?: string) => {
        setIsEngineLoading(true);
        setEngineError(null);
        setEngineProgress(null);

        try {
            await webllmService.initialize(modelId || MODEL_ID, (progress) => {
                setEngineProgress(progress);
            });
            setIsEngineReady(true);
            setCurrentModel(webllmService.getCurrentModel());
        } catch (error) {
            console.error("Failed to initialize WebLLM:", error);
            setEngineError(
                error instanceof Error ? error.message : "Error al inicializar el modelo"
            );
            setIsEngineReady(false);
        } finally {
            setIsEngineLoading(false);
        }
    }, []);

    // Execute a tool call from the AI
    const executeToolCall = useCallback((tool: ToolResult): AIAction | null => {
        const { name, arguments: args } = tool;

        switch (name) {
            case "add_block": {
                const blockType = (args.type as string) || "link";
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

                if (args.phoneNumber) newBlock.phoneNumber = args.phoneNumber as string;
                if (args.emailAddress) newBlock.emailAddress = args.emailAddress as string;
                if (args.icon) {
                    newBlock.icon = { type: "brands", name: args.icon as string };
                }

                setPreviewLinks((prev) => [newBlock, ...prev]);
                return {
                    action: "add_block",
                    type: blockType,
                    title: args.title as string,
                    icon: args.icon as string,
                };
            }

            case "update_design": {
                setPreviewDesign((prev) => ({
                    ...(prev || {}),
                    ...(args.backgroundColor && { backgroundColor: args.backgroundColor as string }),
                    ...(args.buttonColor && { buttonColor: args.buttonColor as string }),
                    ...(args.buttonTextColor && { buttonTextColor: args.buttonTextColor as string }),
                }));
                return {
                    action: "update_design",
                    backgroundColor: args.backgroundColor as string,
                    buttonColor: args.buttonColor as string,
                    buttonTextColor: args.buttonTextColor as string,
                };
            }

            case "remove_block": {
                const titleToRemove = ((args.title as string) || "").toLowerCase();
                setPreviewLinks((prev) =>
                    prev.filter((link) => link.title.toLowerCase() !== titleToRemove)
                );
                return {
                    action: "remove_block",
                    title: args.title as string,
                };
            }

            default:
                return null;
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
                    ...messages.slice(-6).map((msg) => ({
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

                // Execute tool calls and collect actions
                let executedAction: AIAction | null = null;
                const generatedMessages: string[] = [];

                for (const tool of response.toolCalls) {
                    executedAction = executeToolCall(tool);
                    generatedMessages.push(generateMessageFromTool(tool.name, tool.arguments));
                }

                // Determine the message to show
                let finalMessage = response.content || "";
                if (!finalMessage && generatedMessages.length > 0) {
                    finalMessage = generatedMessages.join(". ");
                }
                if (!finalMessage) {
                    finalMessage = "Listo!";
                }

                // Update assistant message
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === assistantId
                            ? {
                                  ...msg,
                                  content: finalMessage,
                                  isLoading: false,
                                  action: executedAction || undefined,
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
                                  content: "Error. Intenta de nuevo.",
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
        isEngineReady,
        isEngineLoading,
        engineProgress,
        engineError,
        currentModel,
        messages,
        isGenerating,
        previewLinks,
        previewDesign,
        hasUnsavedChanges,
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
