/**
 * ThemesSection - Theme presets grid and save custom theme dialog.
 */

import { Input } from "@/Components/ui/Input";
import { MAX_SAVED_THEMES } from "@/constants/designOptions";
import { getThemePreset, THEME_PRESETS } from "@/constants/themePresets";
import { SavedCustomTheme, LandingProfile } from "@/types/index";
import { Grid, Save, Sparkles, Trash2, X } from "lucide-react";
import React, { useCallback, useMemo, useState } from "react";

interface ThemesSectionProps {
    landing: LandingProfile;
    onUpdateLanding: (updates: Partial<LandingProfile>) => void;
    hasBackgroundImage: boolean;
}

export const ThemesSection: React.FC<ThemesSectionProps> = ({
    landing,
    onUpdateLanding,
    hasBackgroundImage,
}) => {
    const [saveThemeName, setSaveThemeName] = useState("");
    const [showSaveDialog, setShowSaveDialog] = useState(false);

    // Check if current theme is a saved custom theme
    const currentSavedTheme = useMemo(() => {
        return landing.savedCustomThemes?.find((t) => t.id === landing.theme);
    }, [landing.savedCustomThemes, landing.theme]);

    // Check if current design has meaningful customizations
    const hasCustomChanges = useMemo(() => {
        const cd = landing.customDesign;
        return (
            cd.backgroundColor !== "#ffffff" ||
            hasBackgroundImage ||
            cd.buttonStyle !== "solid" ||
            cd.buttonShape !== "rounded" ||
            cd.buttonColor !== "#000000" ||
            cd.buttonTextColor !== "#ffffff" ||
            cd.fontPair !== "modern" ||
            cd.textColor !== undefined
        );
    }, [landing.customDesign, hasBackgroundImage]);

    // Handle theme selection
    const handleThemeSelect = useCallback(
        (themeId: string) => {
            const savedTheme = landing.savedCustomThemes?.find(
                (t) => t.id === themeId
            );
            if (savedTheme) {
                onUpdateLanding({
                    theme: themeId,
                    customDesign: {
                        ...savedTheme.customDesign,
                        backgroundImage: landing.customDesign.backgroundImage,
                        backgroundEnabled:
                            savedTheme.customDesign.backgroundEnabled ?? false,
                    },
                });
                return;
            }

            const preset = getThemePreset(themeId);
            if (preset) {
                if (landing.theme === "custom") {
                    onUpdateLanding({
                        lastCustomDesign: { ...landing.customDesign },
                    });
                }

                onUpdateLanding({
                    theme: themeId as any,
                    customDesign: {
                        ...landing.customDesign,
                        backgroundColor: preset.backgroundColor,
                        backgroundImage: landing.customDesign.backgroundImage,
                        backgroundEnabled: false,
                        buttonStyle: preset.buttonStyle,
                        buttonShape: preset.buttonShape,
                        buttonColor: preset.buttonColor,
                        buttonTextColor: preset.buttonTextColor,
                        fontPair: preset.fontPair,
                    },
                });
            }
        },
        [landing.customDesign, landing.theme, landing.savedCustomThemes, onUpdateLanding]
    );

    // Handle selecting "custom" theme
    const handleSelectCustom = useCallback(() => {
        if (landing.lastCustomDesign) {
            onUpdateLanding({
                theme: "custom",
                customDesign: {
                    ...landing.lastCustomDesign,
                    backgroundImage: landing.customDesign.backgroundImage,
                    backgroundEnabled:
                        landing.lastCustomDesign.backgroundEnabled ??
                        hasBackgroundImage,
                },
            });
        } else {
            onUpdateLanding({ theme: "custom" });
        }
    }, [
        landing.lastCustomDesign,
        landing.customDesign.backgroundImage,
        hasBackgroundImage,
        onUpdateLanding,
    ]);

    // Handle saving current theme as custom
    const handleSaveCustomTheme = useCallback(() => {
        if (!saveThemeName.trim()) return;

        const currentThemes = landing.savedCustomThemes || [];

        if (currentThemes.length >= MAX_SAVED_THEMES) {
            const newTheme: SavedCustomTheme = {
                id: `saved_${Date.now()}`,
                name: saveThemeName.trim(),
                customDesign: { ...landing.customDesign },
                createdAt: new Date().toISOString(),
            };

            const updatedThemes = [newTheme, currentThemes[0]];
            onUpdateLanding({
                savedCustomThemes: updatedThemes,
                theme: newTheme.id,
            });
        } else {
            const newTheme: SavedCustomTheme = {
                id: `saved_${Date.now()}`,
                name: saveThemeName.trim(),
                customDesign: { ...landing.customDesign },
                createdAt: new Date().toISOString(),
            };

            onUpdateLanding({
                savedCustomThemes: [...currentThemes, newTheme],
                theme: newTheme.id,
            });
        }

        setSaveThemeName("");
        setShowSaveDialog(false);
    }, [
        saveThemeName,
        landing.customDesign,
        landing.savedCustomThemes,
        onUpdateLanding,
    ]);

    // Handle deleting a saved theme
    const handleDeleteSavedTheme = useCallback(
        (themeId: string) => {
            const updatedThemes =
                landing.savedCustomThemes?.filter((t) => t.id !== themeId) || [];

            if (landing.theme === themeId) {
                onUpdateLanding({
                    savedCustomThemes: updatedThemes,
                    theme: "custom",
                });
            } else {
                onUpdateLanding({ savedCustomThemes: updatedThemes });
            }
        },
        [landing.savedCustomThemes, landing.theme, onUpdateLanding]
    );

    return (
        <section className="bg-white dark:bg-neutral-900 rounded-[32px] p-6 md:p-8 border border-neutral-100 dark:border-neutral-800 shadow-soft-xl">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
                        <Grid size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                            Temas
                        </h2>
                        <p className="text-sm text-neutral-400 dark:text-neutral-500">
                            Estilos predefinidos. Tu imagen de fondo se conserva
                            al cambiar de tema.
                        </p>
                    </div>
                </div>

                {/* Save Theme Button */}
                {(landing.theme === "custom" || currentSavedTheme) &&
                    hasCustomChanges && (
                        <button
                            onClick={() => setShowSaveDialog(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold text-sm transition-all"
                        >
                            <Save size={16} />
                            <span className="hidden sm:inline">
                                Guardar tema
                            </span>
                        </button>
                    )}
            </div>

            {/* Save Theme Dialog */}
            {showSaveDialog && (
                <div className="mb-6 p-4 bg-brand-50 dark:bg-brand-900/20 rounded-2xl border border-brand-200 dark:border-brand-800">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-neutral-800 dark:text-white">
                            Guardar tema personalizado
                        </h4>
                        <button
                            onClick={() => setShowSaveDialog(false)}
                            className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg"
                        >
                            <X size={18} />
                        </button>
                    </div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
                        Podes guardar hasta {MAX_SAVED_THEMES} temas
                        personalizados.
                        {(landing.savedCustomThemes?.length || 0) >=
                            MAX_SAVED_THEMES && (
                            <span className="text-amber-600">
                                {" "}
                                Se reemplazara el mas antiguo.
                            </span>
                        )}
                    </p>
                    <div className="flex gap-2">
                        <Input
                            id="save-theme-name"
                            value={saveThemeName}
                            onChange={(e) => setSaveThemeName(e.target.value)}
                            placeholder="Nombre del tema..."
                            className="flex-1"
                        />
                        <button
                            onClick={handleSaveCustomTheme}
                            disabled={!saveThemeName.trim()}
                            className="px-4 py-2 bg-brand-500 hover:bg-brand-600 disabled:bg-neutral-300 text-white rounded-xl font-semibold text-sm transition-all"
                        >
                            Guardar
                        </button>
                    </div>
                </div>
            )}

            {/* Theme Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                {/* Preset Themes */}
                {THEME_PRESETS.map((theme) => (
                    <button
                        key={theme.id}
                        onClick={() => handleThemeSelect(theme.id)}
                        className={`relative aspect-[3/4] rounded-xl border-2 transition-all duration-300 overflow-hidden group ${
                            landing.theme === theme.id
                                ? "border-brand-500 ring-2 ring-brand-500/20 scale-105 z-10"
                                : "border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 hover:scale-102"
                        }`}
                    >
                        <div
                            className={`absolute inset-0 ${theme.previewBg}`}
                        ></div>
                        <div className="absolute inset-x-2 bottom-8 top-auto">
                            <div
                                className={`h-4 w-full ${
                                    theme.buttonShape === "pill"
                                        ? "rounded-full"
                                        : theme.buttonShape === "sharp"
                                        ? "rounded-none"
                                        : "rounded-md"
                                } ${
                                    theme.buttonStyle === "outline"
                                        ? "border-2"
                                        : ""
                                }`}
                                style={{
                                    backgroundColor:
                                        theme.buttonStyle === "outline"
                                            ? "transparent"
                                            : theme.buttonColor,
                                    borderColor: theme.buttonColor,
                                }}
                            />
                        </div>
                        <span className="absolute bottom-1.5 left-1 right-1 text-center text-[10px] font-bold px-1 py-0.5 rounded-md backdrop-blur-md bg-white/70 dark:bg-black/50 text-neutral-900 dark:text-white truncate">
                            {theme.name}
                        </span>
                    </button>
                ))}

                {/* Saved Custom Themes */}
                {landing.savedCustomThemes?.map((saved) => (
                    <div
                        key={saved.id}
                        className={`relative aspect-[3/4] rounded-xl border-2 transition-all duration-300 overflow-hidden group ${
                            landing.theme === saved.id
                                ? "border-amber-500 ring-2 ring-amber-500/20 scale-105 z-10"
                                : "border-amber-200 dark:border-amber-800 hover:border-amber-400 hover:scale-102"
                        }`}
                    >
                        <button
                            onClick={() => handleThemeSelect(saved.id)}
                            className="absolute inset-0"
                            style={{
                                backgroundColor:
                                    saved.customDesign.backgroundColor,
                            }}
                        >
                            <div className="absolute inset-x-2 bottom-8 top-auto">
                                <div
                                    className={`h-4 w-full ${
                                        saved.customDesign.buttonShape ===
                                        "pill"
                                            ? "rounded-full"
                                            : saved.customDesign.buttonShape ===
                                              "sharp"
                                            ? "rounded-none"
                                            : "rounded-md"
                                    } ${
                                        saved.customDesign.buttonStyle ===
                                        "outline"
                                            ? "border-2"
                                            : ""
                                    }`}
                                    style={{
                                        backgroundColor:
                                            saved.customDesign.buttonStyle ===
                                            "outline"
                                                ? "transparent"
                                                : saved.customDesign
                                                      .buttonColor,
                                        borderColor:
                                            saved.customDesign.buttonColor,
                                    }}
                                />
                            </div>
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteSavedTheme(saved.id);
                            }}
                            className="absolute top-1 right-1 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            data-tooltip="Eliminar tema"
                        >
                            <Trash2 size={12} />
                        </button>
                        <span className="absolute bottom-1.5 left-1 right-1 text-center text-[10px] font-bold px-1 py-0.5 rounded-md backdrop-blur-md bg-amber-100/90 dark:bg-amber-900/70 text-amber-800 dark:text-amber-200 truncate pointer-events-none">
                            {saved.name}
                        </span>
                    </div>
                ))}

                {/* Custom theme slot */}
                <button
                    onClick={handleSelectCustom}
                    className={`relative aspect-[3/4] rounded-xl border-2 transition-all duration-300 overflow-hidden group ${
                        landing.theme === "custom"
                            ? "border-brand-500 ring-2 ring-brand-500/20 scale-105 z-10"
                            : "border-dashed border-neutral-300 dark:border-neutral-600 hover:border-neutral-400"
                    }`}
                >
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundColor:
                                landing.theme === "custom"
                                    ? landing.customDesign.backgroundColor
                                    : landing.lastCustomDesign?.backgroundColor ||
                                      "#f5f5f5",
                        }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles size={24} className="text-neutral-400" />
                    </div>
                    {landing.lastCustomDesign && landing.theme !== "custom" && (
                        <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-green-500 text-white text-[8px] font-bold rounded">
                            Guardado
                        </div>
                    )}
                    <span className="absolute bottom-1.5 left-1 right-1 text-center text-[10px] font-bold px-1 py-0.5 rounded-md backdrop-blur-md bg-white/70 dark:bg-black/50 text-neutral-900 dark:text-white truncate">
                        Personalizado
                    </span>
                </button>
            </div>

            {/* Custom theme info */}
            {landing.theme === "custom" && (
                <p className="mt-3 text-xs text-brand-600 dark:text-brand-400 flex items-center gap-1">
                    <Sparkles size={12} />
                    Tema personalizado activo. Los cambios se guardan
                    automaticamente.
                </p>
            )}
            {currentSavedTheme && (
                <p className="mt-3 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <Save size={12} />
                    Editando tema guardado: "{currentSavedTheme.name}". Los
                    cambios se guardan automaticamente.
                </p>
            )}
        </section>
    );
};
