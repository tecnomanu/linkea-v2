/**
 * AIChat - Chat interface component for AI assistant
 *
 * Renders the chat history and input field.
 * Messages from the AI may contain actions that update the preview.
 */

import { useAI, UIChatMessage } from "@/contexts/AIContext";
import { Loader2, Send, Sparkles, User } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";

interface ChatMessageProps {
    message: UIChatMessage;
}

function ChatMessageBubble({ message }: ChatMessageProps) {
    const isUser = message.role === "user";

    // Clean content: remove JSON blocks from display but keep the explanation
    const displayContent = message.content
        .replace(/```json[\s\S]*?```/g, "")
        .trim();

    return (
        <div
            className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
        >
            {/* Avatar */}
            <div
                className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    isUser
                        ? "bg-neutral-900 dark:bg-white"
                        : "bg-gradient-to-br from-brand-500 to-pink-500"
                }`}
            >
                {isUser ? (
                    <User size={16} className="text-white dark:text-neutral-900" />
                ) : (
                    <Sparkles size={16} className="text-white" />
                )}
            </div>

            {/* Message bubble */}
            <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                    isUser
                        ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-tr-md"
                        : "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-tl-md shadow-sm border border-neutral-100 dark:border-neutral-700"
                }`}
            >
                {/* Message content */}
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {displayContent || (message.isStreaming ? "" : "...")}
                </p>

                {/* Streaming indicator */}
                {message.isStreaming && (
                    <span className="inline-flex items-center gap-1 text-brand-500 mt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse delay-75" />
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse delay-150" />
                    </span>
                )}

                {/* Action indicator */}
                {message.action && !message.isStreaming && (
                    <div className="mt-2 pt-2 border-t border-neutral-200 dark:border-neutral-600">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-600 dark:text-brand-400">
                            <Sparkles size={12} />
                            {message.action.action === "add_blocks" &&
                                `Agregando ${message.action.blocks?.length || 0} bloque(s)`}
                            {message.action.action === "update_design" &&
                                "Actualizando diseno"}
                            {message.action.action === "remove_blocks" &&
                                `Eliminando ${message.action.titles?.length || 0} bloque(s)`}
                            {message.action.action === "reorder_blocks" &&
                                "Reordenando bloques"}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

export function AIChat() {
    const { messages, isGenerating, sendMessage, isEngineReady } = useAI();
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Focus input when engine becomes ready
    useEffect(() => {
        if (isEngineReady) {
            inputRef.current?.focus();
        }
    }, [isEngineReady]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const trimmedInput = input.trim();
        if (!trimmedInput || isGenerating || !isEngineReady) return;

        setInput("");
        await sendMessage(trimmedInput);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 overlay-scrollbar">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-500 to-pink-500 flex items-center justify-center mb-4">
                            <Sparkles size={32} className="text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
                            Asistente de Linkea
                        </h3>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-xs">
                            Decime que queres hacer con tu landing y te ayudo a
                            crearlo. Podes pedirme que agregue links, cambie colores,
                            organice tus bloques y mas.
                        </p>
                        <div className="mt-6 space-y-2">
                            <p className="text-xs text-neutral-400 dark:text-neutral-500">
                                Ejemplos:
                            </p>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {[
                                    "Agregar link a Instagram",
                                    "Fondo amarillo",
                                    "Agregar WhatsApp",
                                ].map((example) => (
                                    <button
                                        key={example}
                                        onClick={() => setInput(example)}
                                        className="px-3 py-1.5 text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                                    >
                                        {example}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    messages.map((message) => (
                        <ChatMessageBubble key={message.id} message={message} />
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="shrink-0 p-4 border-t border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
                <form onSubmit={handleSubmit} className="relative">
                    <textarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={
                            isEngineReady
                                ? "Escribi tu mensaje..."
                                : "Esperando que cargue el modelo..."
                        }
                        disabled={!isEngineReady || isGenerating}
                        rows={1}
                        className="w-full pr-12 pl-4 py-3 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ minHeight: "48px", maxHeight: "120px" }}
                    />
                    <button
                        type="submit"
                        disabled={!isEngineReady || isGenerating || !input.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isGenerating ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <Send size={18} />
                        )}
                    </button>
                </form>
                {isGenerating && (
                    <p className="text-xs text-neutral-400 mt-2 text-center">
                        Generando respuesta...
                    </p>
                )}
            </div>
        </div>
    );
}

