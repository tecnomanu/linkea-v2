/**
 * ModelSelector - UI for selecting and loading a WebLLM model
 *
 * Shows available models with their descriptions and handles
 * the initialization process with progress feedback.
 */

import { AVAILABLE_MODELS, ModelId, useAI } from "@/contexts/AIContext";
import { AlertCircle, CheckCircle2, Cpu, Download, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";

export function ModelSelector() {
    const {
        isEngineReady,
        isEngineLoading,
        engineProgress,
        engineError,
        currentModel,
        initializeEngine,
    } = useAI();

    const [selectedModel, setSelectedModel] = useState<ModelId>(
        "Llama-3.2-1B-Instruct-q4f16_1-MLC"
    );

    const handleLoadModel = () => {
        initializeEngine(selectedModel);
    };

    // If already loaded, show success state
    if (isEngineReady) {
        const loadedModelInfo = AVAILABLE_MODELS.find(
            (m) => m.id === currentModel
        );
        return (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                        <CheckCircle2 size={20} className="text-white" />
                    </div>
                    <div>
                        <p className="font-bold text-green-800 dark:text-green-200">
                            Modelo cargado
                        </p>
                        <p className="text-sm text-green-600 dark:text-green-400">
                            {loadedModelInfo?.name || currentModel}
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
            <div className="p-6 bg-gradient-to-br from-brand-50 to-pink-50 dark:from-brand-900/20 dark:to-pink-900/20 rounded-2xl border border-brand-200 dark:border-brand-800">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-500 to-pink-500 flex items-center justify-center">
                        <Loader2 size={24} className="text-white animate-spin" />
                    </div>
                    <div>
                        <p className="font-bold text-neutral-900 dark:text-white">
                            Cargando modelo...
                        </p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
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
                <p className="text-xs text-neutral-400 mt-2 text-center">
                    {progressPercent}% completado
                </p>

                <p className="text-xs text-neutral-400 mt-4 text-center">
                    El modelo se descarga una vez y queda en cache del navegador
                </p>
            </div>
        );
    }

    // Error state
    if (engineError) {
        return (
            <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-800">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center shrink-0">
                        <AlertCircle size={20} className="text-white" />
                    </div>
                    <div>
                        <p className="font-bold text-red-800 dark:text-red-200">
                            Error al cargar el modelo
                        </p>
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                            {engineError}
                        </p>
                        <button
                            onClick={handleLoadModel}
                            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium text-sm transition-colors"
                        >
                            Reintentar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Initial state - model selection
    return (
        <div className="p-6">
            {/* Header */}
            <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
                    <Sparkles size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                    Asistente IA
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Usa inteligencia artificial para crear tu landing. El modelo
                    corre 100% en tu navegador - gratis y privado.
                </p>
            </div>

            {/* Model selection */}
            <div className="space-y-3 mb-6">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Selecciona un modelo:
                </label>
                {AVAILABLE_MODELS.map((model) => (
                    <button
                        key={model.id}
                        onClick={() => setSelectedModel(model.id)}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                            selectedModel === model.id
                                ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                                : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                        selectedModel === model.id
                                            ? "bg-brand-500"
                                            : "bg-neutral-200 dark:bg-neutral-700"
                                    }`}
                                >
                                    <Cpu
                                        size={16}
                                        className={
                                            selectedModel === model.id
                                                ? "text-white"
                                                : "text-neutral-500 dark:text-neutral-400"
                                        }
                                    />
                                </div>
                                <div>
                                    <p
                                        className={`font-semibold ${
                                            selectedModel === model.id
                                                ? "text-brand-700 dark:text-brand-300"
                                                : "text-neutral-900 dark:text-white"
                                        }`}
                                    >
                                        {model.name}
                                        {model.recommended && (
                                            <span className="ml-2 text-xs bg-brand-500 text-white px-2 py-0.5 rounded-full">
                                                Recomendado
                                            </span>
                                        )}
                                    </p>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                        {model.description}
                                    </p>
                                </div>
                            </div>
                            <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500">
                                {model.size}
                            </span>
                        </div>
                    </button>
                ))}
            </div>

            {/* Load button */}
            <button
                onClick={handleLoadModel}
                className="w-full py-4 bg-gradient-to-r from-brand-500 to-pink-500 hover:from-brand-600 hover:to-pink-600 text-white rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-xl shadow-brand-500/20"
            >
                <Download size={20} />
                <span>Cargar Modelo</span>
            </button>

            <p className="text-xs text-neutral-400 mt-4 text-center">
                Requiere WebGPU (Chrome 113+, Edge 113+). La primera carga puede
                tardar unos minutos.
            </p>
        </div>
    );
}

