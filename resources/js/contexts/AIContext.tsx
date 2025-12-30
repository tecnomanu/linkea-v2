/**
 * AI Context - Manages AI chat state and preview changes
 *
 * Uses Groq API via Laravel backend with SSE streaming.
 */

import { LinkBlock, UserProfile } from "@/types";
import {
    generateMessageFromTool,
    toolCallToAction,
    AIAction,
    ToolCall,
} from "@/services/aiBlocksPrompt";
import { createBlockDefaults } from "@/Components/Shared/blocks/blockConfig";
import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";

// Re-export AIAction for components
export type { AIAction };

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
    // Chat state
    messages: UIChatMessage[];
    isGenerating: boolean;
    error: string | null;

    // Preview state (changes made by AI, not yet saved)
    previewLinks: LinkBlock[];
    previewDesign: Partial<UserProfile["customDesign"]> | null;
    hasUnsavedChanges: boolean;

    // Actions
    sendMessage: (content: string) => Promise<void>;
    clearChat: () => void;
    applyChanges: () => void;
    discardChanges: () => void;
    setBaseState: (
        links: LinkBlock[],
        design: UserProfile["customDesign"]
    ) => void;
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
    // Chat state
    const [messages, setMessages] = useState<UIChatMessage[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
            setPreviewLinks(links);
            setPreviewDesign(null);
        },
        []
    );

    // Execute a tool call
    const executeToolCall = useCallback((toolCall: ToolCall): AIAction | null => {
        const { name, arguments: args } = toolCall;

        switch (name) {
            case "add_block": {
                const blockType = (args.type as string) || "link";
                const defaults = createBlockDefaults(blockType as any);
                
                // Build block with defaults first, then override with AI args
                const newBlock: LinkBlock = {
                    ...defaults,
                    id: Math.random().toString(36).substr(2, 9),
                    isEnabled: true,
                    clicks: 0,
                    sparklineData: Array(7)
                        .fill(0)
                        .map(() => ({ value: 0 })),
                    type: blockType as any,
                    title: (args.title as string) || defaults.title || "",
                    url: (args.url as string) || defaults.url || "",
                };

                // Override with AI-provided values
                if (args.phoneNumber)
                    newBlock.phoneNumber = args.phoneNumber as string;
                if (args.emailAddress)
                    newBlock.emailAddress = args.emailAddress as string;
                if (args.icon) {
                    newBlock.icon = { type: "brands", name: args.icon as string };
                }

                console.log("Adding block:", newBlock);
                setPreviewLinks((prev) => [newBlock, ...prev]);
                return toolCallToAction(toolCall);
            }

            case "update_design": {
                setPreviewDesign((prev) => ({
                    ...(prev || {}),
                    ...(args.backgroundColor && {
                        backgroundColor: args.backgroundColor as string,
                    }),
                    ...(args.buttonColor && {
                        buttonColor: args.buttonColor as string,
                    }),
                    ...(args.buttonTextColor && {
                        buttonTextColor: args.buttonTextColor as string,
                    }),
                }));
                return toolCallToAction(toolCall);
            }

            case "remove_block": {
                const titleToRemove = ((args.title as string) || "").toLowerCase();
                setPreviewLinks((prev) =>
                    prev.filter(
                        (link) => link.title.toLowerCase() !== titleToRemove
                    )
                );
                return toolCallToAction(toolCall);
            }

            default:
                return null;
        }
    }, []);

    // Send a message via SSE streaming
    const sendMessage = useCallback(
        async (content: string) => {
            if (isGenerating) return;

            setError(null);

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
                // Prepare current blocks for context
                const currentBlocks = previewLinks.map((link) => ({
                    type: link.type,
                    title: link.title,
                }));

                // Prepare chat history (last 6 messages)
                const chatHistory = messages.slice(-6).map((msg) => ({
                    role: msg.role,
                    content: msg.content,
                }));
                chatHistory.push({ role: "user", content });

                // Call API with SSE
                const response = await fetch("/api/panel/ai/chat", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "text/event-stream",
                        "X-CSRF-TOKEN":
                            document
                                .querySelector('meta[name="csrf-token"]')
                                ?.getAttribute("content") || "",
                    },
                    body: JSON.stringify({
                        messages: chatHistory,
                        currentBlocks,
                    }),
                });

                if (!response.ok) {
                    throw new Error("Error en la respuesta del servidor");
                }

                const reader = response.body?.getReader();
                const decoder = new TextDecoder();

                if (!reader) {
                    throw new Error("No se pudo leer la respuesta");
                }

                let fullContent = "";
                let executedAction: AIAction | null = null;
                const generatedMessages: string[] = [];

                // Read SSE stream
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const text = decoder.decode(value, { stream: true });
                    const lines = text.split("\n");

                    for (const line of lines) {
                        if (line.startsWith("data: ")) {
                            try {
                                const data = JSON.parse(line.slice(6));

                                if (data.type === "content" && data.content) {
                                    fullContent += data.content;
                                    setMessages((prev) =>
                                        prev.map((msg) =>
                                            msg.id === assistantId
                                                ? {
                                                      ...msg,
                                                      content: fullContent,
                                                      isLoading: false,
                                                  }
                                                : msg
                                        )
                                    );
                                }

                                if (data.type === "tool_call") {
                                    const toolCall: ToolCall = {
                                        name: data.name,
                                        arguments: data.arguments,
                                    };
                                    executedAction = executeToolCall(toolCall);
                                    generatedMessages.push(
                                        generateMessageFromTool(
                                            data.name,
                                            data.arguments
                                        )
                                    );
                                }

                                if (data.type === "error") {
                                    throw new Error(data.message);
                                }
                            } catch (e) {
                                // Ignore JSON parse errors for incomplete chunks
                            }
                        }
                    }
                }

                // If no content but we have tool calls, use generated messages
                if (!fullContent && generatedMessages.length > 0) {
                    fullContent = generatedMessages.join(". ");
                }
                if (!fullContent) {
                    fullContent = "Listo!";
                }

                // Update final message
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === assistantId
                            ? {
                                  ...msg,
                                  content: fullContent,
                                  isLoading: false,
                                  action: executedAction || undefined,
                              }
                            : msg
                    )
                );
            } catch (err) {
                console.error("AI chat error:", err);
                const errorMessage =
                    err instanceof Error
                        ? err.message
                        : "Error. Intenta de nuevo.";
                setError(errorMessage);
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === assistantId
                            ? {
                                  ...msg,
                                  content: errorMessage,
                                  isLoading: false,
                              }
                            : msg
                    )
                );
            } finally {
                setIsGenerating(false);
            }
        },
        [isGenerating, messages, previewLinks, executeToolCall]
    );

    // Clear chat history
    const clearChat = useCallback(() => {
        setMessages([]);
        setError(null);
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
        messages,
        isGenerating,
        error,
        previewLinks,
        previewDesign,
        hasUnsavedChanges,
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
