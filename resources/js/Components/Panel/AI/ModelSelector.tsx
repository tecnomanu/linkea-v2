/**
 * ModelSelector - UI for loading the WebLLM model
 *
 * Shows WiFi confirmation before downloading (if not cached),
 * then handles the initialization process with progress feedback.
 */

import { useAI } from "@/contexts/AIContext";
import { ModelId } from "@/services/webllmService";
import { AlertCircle, Loader2, Sparkles, Wifi } from "lucide-react";
import { useEffect, useState } from "react";

// Single model - Qwen 2.5 1.5B is a good balance of size and capability
const MODEL_ID: ModelId = "Qwen2.5-1.5B-Instruct-q4f16_1-MLC";
const MODEL_SIZE = "900MB";
const CACHE_KEY = `webllm_cached_${MODEL_ID}`;

export function ModelSelector() {
    const {
        isEngineReady,
        isEngineLoading,
        engineProgress,
        engineError,
        initializeEngine,
    } = useAI();

    const [isModelCached, setIsModelCached] = useState<boolean | null>(null);
    const [showPrompt, setShowPrompt] = useState(true);

    // Check if model is cached on mount
    useEffect(() => {
        const checkCache = async () => {
            const cachedFlag = localStorage.getItem(CACHE_KEY);
            if (cachedFlag === "true") {
                setIsModelCached(true);
                return;
            }

            try {
                if ("caches" in window) {
                    const cacheNames = await caches.keys();
                    const hasCache = cacheNames.some(
                        (name) =>
                            name.includes("webllm") || name.includes("mlc")
                    );
                    if (
                        hasCache &&
                        localStorage.getItem(CACHE_KEY) === "true"
                    ) {
                        setIsModelCached(true);
                        return;
                    }
                }
            } catch {
                // Ignore cache API errors
            }

            setIsModelCached(false);
        };

        checkCache();
    }, []);

    // Mark model as cached after successful load
    useEffect(() => {
        if (isEngineReady) {
            localStorage.setItem(CACHE_KEY, "true");
            setIsModelCached(true);
        }
    }, [isEngineReady]);

    const handleLoadModel = () => {
        setShowPrompt(false);
        initializeEngine(MODEL_ID);
    };

    // If already loaded, show nothing (chat will be shown)
    if (isEngineReady) {
        return null;
    }

    // Loading state
    if (isEngineLoading) {
        const progressPercent = Math.round(
            (engineProgress?.progress || 0) * 100
        );

        return (
            <div className="max-w-sm mx-auto p-5">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-pink-500 flex items-center justify-center shrink-0">
                        <Loader2
                            size={20}
                            className="text-white animate-spin"
                        />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="font-bold text-sm text-neutral-900 dark:text-white">
                            {isModelCached
                                ? "Cargando IA..."
                                : "Descargando IA..."}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                            {engineProgress?.text || "Preparando..."}
                        </p>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-brand-500 to-pink-500 transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
                <p className="text-xs text-neutral-400 text-center mt-2">
                    {progressPercent}%
                </p>
            </div>
        );
    }

    // Error state
    if (engineError) {
        return (
            <div className="max-w-sm mx-auto p-5">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center shrink-0">
                        <AlertCircle size={20} className="text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="font-bold text-sm text-red-800 dark:text-red-200">
                            Error
                        </p>
                        <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                            {engineError}
                        </p>
                        <button
                            onClick={handleLoadModel}
                            className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium text-xs transition-colors"
                        >
                            Reintentar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Initial state - Simple prompt
    if (showPrompt) {
        // Still checking cache
        if (isModelCached === null) {
            return (
                <div className="max-w-sm mx-auto p-6 text-center">
                    <Loader2
                        size={24}
                        className="animate-spin text-brand-500 mx-auto mb-2"
                    />
                </div>
            );
        }

        return (
            <div className="max-w-sm mx-auto p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
                    <Sparkles size={32} className="text-white" />
                </div>

                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
                    Asistente de Linkea
                </h3>

                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                    Crea y edita tu landing con IA.
                    <br />
                    Funciona en tu navegador, gratis y privado.
                </p>

                {/* Status indicator - simple inline text */}
                {isModelCached ? (
                    <p className="text-sm text-green-600 dark:text-green-400 mb-5">
                        Modelo precargado
                    </p>
                ) : (
                    <p className="flex items-center justify-center gap-2 text-sm text-amber-600 dark:text-amber-400 mb-5">
                        <Wifi size={16} />
                        Requiere WiFi - se descargaran {MODEL_SIZE}
                    </p>
                )}

                <button
                    onClick={handleLoadModel}
                    className="w-full py-3 bg-gradient-to-r from-brand-500 to-pink-500 hover:from-brand-600 hover:to-pink-600 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                >
                    <Sparkles size={18} />
                    <span>
                        {isModelCached ? "Iniciar chat" : "Descargar e iniciar"}
                    </span>
                </button>

                <p className="text-[10px] text-neutral-400 mt-3">
                    Requiere Chrome/Edge 113+ con WebGPU
                </p>
            </div>
        );
    }

    return null;
}
