/**
 * ModelSelector - UI for loading the WebLLM model
 *
 * Offers choice between fast (1B) and smart (3B) models,
 * shows WiFi confirmation before downloading (if not cached),
 * then handles the initialization process with progress feedback.
 */

import { useAI } from "@/contexts/AIContext";
import { ModelId } from "@/services/webllmService";
import {
    AlertCircle,
    Brain,
    CheckCircle2,
    HardDrive,
    Loader2,
    Sparkles,
    Wifi,
    Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

// Example prompts to show during loading - many options
const LOADING_TIPS = [
    "Agregar link a mi Instagram",
    "Cambiar el fondo a amarillo",
    "Agregar boton de WhatsApp",
    "Poner mis redes sociales",
    "Cambiar el estilo de botones",
    "Agregar un encabezado",
    "Quiero botones redondeados",
    "Agregar mi canal de YouTube",
    "Poner fondo oscuro",
    "Agregar link a mi TikTok",
    "Cambiar la fuente a elegante",
    "Agregar mi Spotify",
    "Quiero botones con borde",
    "Agregar mi email de contacto",
    "Poner mi ubicacion en el mapa",
    "Agregar link a mi LinkedIn",
];

// Model options
const MODELS = {
    smart: {
        id: "Llama-3.2-3B-Instruct-q4f16_1-MLC" as ModelId,
        name: "Inteligente",
        description: "Mejor comprension, pregunta lo que necesita",
        size: "1.8GB",
        icon: Brain,
    },
    fast: {
        id: "Llama-3.2-1B-Instruct-q4f16_1-MLC" as ModelId,
        name: "Rapido",
        description: "Carga mas rapido, menos preciso",
        size: "700MB",
        icon: Zap,
    },
};

type ModelType = keyof typeof MODELS;

export function ModelSelector() {
    const {
        isEngineReady,
        isEngineLoading,
        engineProgress,
        engineError,
        initializeEngine,
    } = useAI();

    const [selectedModel, setSelectedModel] = useState<ModelType>("smart");
    const [cachedModels, setCachedModels] = useState<Record<string, boolean>>({});
    const [showWifiPrompt, setShowWifiPrompt] = useState(true);
    const [currentTipIndex, setCurrentTipIndex] = useState(0);
    const [tipVisible, setTipVisible] = useState(true);

    const currentModelConfig = MODELS[selectedModel];
    const isCurrentModelCached = cachedModels[currentModelConfig.id] ?? false;

    // Check which models are cached on mount
    useEffect(() => {
        const checkCache = async () => {
            const cached: Record<string, boolean> = {};

            for (const model of Object.values(MODELS)) {
                const cacheKey = `webllm_cached_${model.id}`;
                const cachedFlag = localStorage.getItem(cacheKey);
                if (cachedFlag === "true") {
                    cached[model.id] = true;
                }
            }

            // Also check Cache API
            try {
                if ("caches" in window) {
                    const cacheNames = await caches.keys();
                    const hasWebLLMCache = cacheNames.some(
                        (name) => name.includes("webllm") || name.includes("mlc")
                    );
                    if (hasWebLLMCache) {
                        // If we have any cache, check each model
                        for (const model of Object.values(MODELS)) {
                            const cacheKey = `webllm_cached_${model.id}`;
                            if (localStorage.getItem(cacheKey) === "true") {
                                cached[model.id] = true;
                            }
                        }
                    }
                }
            } catch (e) {
                // Cache API not available or error
            }

            setCachedModels(cached);
        };

        checkCache();
    }, []);

    // Rotate tips every 2.5 seconds during loading with fade animation
    useEffect(() => {
        if (!isEngineLoading) return;

        const interval = setInterval(() => {
            setTipVisible(false);
            setTimeout(() => {
                setCurrentTipIndex((prev) => (prev + 1) % LOADING_TIPS.length);
                setTipVisible(true);
            }, 200);
        }, 2500);

        return () => clearInterval(interval);
    }, [isEngineLoading]);

    // Mark model as cached after successful load
    useEffect(() => {
        if (isEngineReady) {
            const cacheKey = `webllm_cached_${currentModelConfig.id}`;
            localStorage.setItem(cacheKey, "true");
            setCachedModels((prev) => ({ ...prev, [currentModelConfig.id]: true }));
        }
    }, [isEngineReady, currentModelConfig.id]);

    const handleLoadModel = () => {
        setShowWifiPrompt(false);
        initializeEngine(currentModelConfig.id);
    };

    // If already loaded, show success state
    if (isEngineReady) {
        return (
            <div className="max-w-sm mx-auto p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                        <CheckCircle2 size={20} className="text-white" />
                    </div>
                    <div className="min-w-0">
                        <p className="font-bold text-green-800 dark:text-green-200">
                            Listo para ayudarte
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400">
                            Escribi tu primera consulta
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Loading state
    if (isEngineLoading) {
        const progressPercent = Math.round(
            (engineProgress?.progress || 0) * 100
        );

        return (
            <div className="max-w-sm mx-auto p-5 bg-gradient-to-br from-brand-50 to-pink-50 dark:from-brand-900/20 dark:to-pink-900/20 rounded-2xl border border-brand-200 dark:border-brand-800">
                <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-pink-500 flex items-center justify-center shrink-0">
                        <Loader2
                            size={20}
                            className="text-white animate-spin"
                        />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="font-bold text-sm text-neutral-900 dark:text-white">
                            {isCurrentModelCached
                                ? "Cargando desde cache..."
                                : `Descargando ${currentModelConfig.name}...`}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                            {engineProgress?.text || "Preparando..."}
                        </p>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden mb-2">
                    <div
                        className="h-full bg-gradient-to-r from-brand-500 to-pink-500 transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
                <p className="text-[10px] text-neutral-400 text-right mb-4">
                    {progressPercent}% completado
                </p>

                {/* Tip during loading with fade animation */}
                <div className="bg-white/50 dark:bg-neutral-800/50 rounded-xl p-3 min-h-[60px]">
                    <p className="text-[10px] text-neutral-400 uppercase tracking-wider mb-1">
                        Cuando termine, podras decir:
                    </p>
                    <p
                        className={`text-sm font-medium text-neutral-700 dark:text-neutral-200 italic transition-opacity duration-200 ${
                            tipVisible ? "opacity-100" : "opacity-0"
                        }`}
                    >
                        "{LOADING_TIPS[currentTipIndex]}"
                    </p>
                </div>

                <p className="text-[10px] text-neutral-400 mt-3 text-center">
                    {isCurrentModelCached
                        ? "Cargando desde cache local"
                        : "El modelo se descarga una vez y queda en cache"}
                </p>
            </div>
        );
    }

    // Error state
    if (engineError) {
        return (
            <div className="max-w-sm mx-auto p-5 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-800">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center shrink-0">
                        <AlertCircle size={20} className="text-white" />
                    </div>
                    <div className="min-w-0">
                        <p className="font-bold text-sm text-red-800 dark:text-red-200">
                            Error al cargar
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

    // Initial state - Model selection
    if (showWifiPrompt) {
        return (
            <div className="max-w-sm mx-auto p-6">
                {/* Header */}
                <div className="text-center mb-5">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-500 to-pink-500 flex items-center justify-center mx-auto mb-3">
                        <Sparkles size={28} className="text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">
                        Asistente IA
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Crea tu landing hablando con la IA. Funciona 100% en tu
                        navegador, gratis y privado.
                    </p>
                </div>

                {/* Model selection */}
                <div className="space-y-2 mb-5">
                    <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                        Elegir modelo:
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                        {(Object.entries(MODELS) as [ModelType, typeof MODELS.smart][]).map(
                            ([key, model]) => {
                                const Icon = model.icon;
                                const isCached = cachedModels[model.id];
                                const isSelected = selectedModel === key;

                                return (
                                    <button
                                        key={key}
                                        onClick={() => setSelectedModel(key)}
                                        className={`p-3 rounded-xl border-2 transition-all text-left ${
                                            isSelected
                                                ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                                                : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <Icon
                                                size={16}
                                                className={
                                                    isSelected
                                                        ? "text-brand-500"
                                                        : "text-neutral-500"
                                                }
                                            />
                                            <span
                                                className={`text-sm font-bold ${
                                                    isSelected
                                                        ? "text-brand-700 dark:text-brand-300"
                                                        : "text-neutral-700 dark:text-neutral-300"
                                                }`}
                                            >
                                                {model.name}
                                            </span>
                                            {isCached && (
                                                <HardDrive
                                                    size={12}
                                                    className="text-green-500"
                                                />
                                            )}
                                        </div>
                                        <p className="text-[10px] text-neutral-500 dark:text-neutral-400">
                                            {model.description}
                                        </p>
                                        <p className="text-[10px] text-neutral-400 mt-1">
                                            {model.size}
                                            {isCached && " (en cache)"}
                                        </p>
                                    </button>
                                );
                            }
                        )}
                    </div>
                </div>

                {/* WiFi/Cache indicator */}
                {isCurrentModelCached ? (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-3 mb-4">
                        <div className="flex items-center gap-2">
                            <HardDrive
                                size={16}
                                className="text-green-600 dark:text-green-400"
                            />
                            <p className="text-xs text-green-700 dark:text-green-300">
                                Este modelo ya esta en cache, no usa datos.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 mb-4">
                        <div className="flex items-center gap-2">
                            <Wifi
                                size={16}
                                className="text-amber-600 dark:text-amber-400"
                            />
                            <p className="text-xs text-amber-700 dark:text-amber-300">
                                Descarga de {currentModelConfig.size}. Recomendamos WiFi.
                            </p>
                        </div>
                    </div>
                )}

                {/* Load button */}
                <button
                    onClick={handleLoadModel}
                    className="w-full py-3.5 bg-gradient-to-r from-brand-500 to-pink-500 hover:from-brand-600 hover:to-pink-600 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20"
                >
                    <Sparkles size={18} />
                    <span>
                        {isCurrentModelCached ? "Cargar" : "Descargar"} asistente{" "}
                        {currentModelConfig.name.toLowerCase()}
                    </span>
                </button>

                <p className="text-[10px] text-neutral-400 mt-3 text-center">
                    Requiere Chrome 113+ o Edge 113+ con WebGPU
                </p>
            </div>
        );
    }

    return null;
}
