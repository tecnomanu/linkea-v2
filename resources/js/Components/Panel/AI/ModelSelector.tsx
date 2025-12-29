/**
 * ModelSelector - UI for loading the WebLLM model
 *
 * Shows a WiFi confirmation before downloading, then handles
 * the initialization process with progress feedback.
 */

import { useAI } from "@/contexts/AIContext";
import {
    AlertCircle,
    CheckCircle2,
    Loader2,
    Sparkles,
    Wifi,
} from "lucide-react";
import { useState } from "react";

// Example prompts to show during loading
const LOADING_TIPS = [
    "Agregar link a mi Instagram",
    "Cambiar el fondo a amarillo",
    "Agregar boton de WhatsApp",
    "Poner mis redes sociales",
    "Cambiar el estilo de botones",
    "Agregar un encabezado",
];

export function ModelSelector() {
    const {
        isEngineReady,
        isEngineLoading,
        engineProgress,
        engineError,
        initializeEngine,
    } = useAI();

    const [showWifiPrompt, setShowWifiPrompt] = useState(true);
    const [currentTipIndex, setCurrentTipIndex] = useState(0);

    // Rotate tips every 3 seconds during loading
    useState(() => {
        if (isEngineLoading) {
            const interval = setInterval(() => {
                setCurrentTipIndex((prev) => (prev + 1) % LOADING_TIPS.length);
            }, 3000);
            return () => clearInterval(interval);
        }
    });

    const handleConfirmWifi = () => {
        setShowWifiPrompt(false);
        initializeEngine("Llama-3.2-1B-Instruct-q4f16_1-MLC");
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
        const progressPercent = Math.round((engineProgress?.progress || 0) * 100);
        return (
            <div className="max-w-sm mx-auto p-5 bg-gradient-to-br from-brand-50 to-pink-50 dark:from-brand-900/20 dark:to-pink-900/20 rounded-2xl border border-brand-200 dark:border-brand-800">
                <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-pink-500 flex items-center justify-center shrink-0">
                        <Loader2 size={20} className="text-white animate-spin" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="font-bold text-sm text-neutral-900 dark:text-white">
                            Cargando modelo...
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

                {/* Tip during loading */}
                <div className="bg-white/50 dark:bg-neutral-800/50 rounded-xl p-3">
                    <p className="text-[10px] text-neutral-400 uppercase tracking-wider mb-1">
                        Cuando termine, podras decir:
                    </p>
                    <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200 italic">
                        "{LOADING_TIPS[currentTipIndex]}"
                    </p>
                </div>

                <p className="text-[10px] text-neutral-400 mt-3 text-center">
                    El modelo se descarga una vez y queda en cache del navegador
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
                            onClick={handleConfirmWifi}
                            className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium text-xs transition-colors"
                        >
                            Reintentar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Initial state - WiFi confirmation
    if (showWifiPrompt) {
        return (
            <div className="max-w-sm mx-auto p-6">
                {/* Header */}
                <div className="text-center mb-6">
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

                {/* WiFi warning */}
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-5">
                    <div className="flex items-start gap-3">
                        <Wifi
                            size={18}
                            className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5"
                        />
                        <div>
                            <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                                Estas conectado a WiFi?
                            </p>
                            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                                El modelo de IA pesa ~700MB y se descarga una sola
                                vez. Recomendamos usar WiFi para evitar consumo de
                                datos moviles.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Confirm button */}
                <button
                    onClick={handleConfirmWifi}
                    className="w-full py-3.5 bg-gradient-to-r from-brand-500 to-pink-500 hover:from-brand-600 hover:to-pink-600 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20"
                >
                    <Sparkles size={18} />
                    <span>Si, cargar asistente</span>
                </button>

                <p className="text-[10px] text-neutral-400 mt-3 text-center">
                    Requiere Chrome 113+ o Edge 113+ con WebGPU
                </p>
            </div>
        );
    }

    return null;
}

