import { ImageUploader } from "@/Components/Shared/ImageUploader";
import { ColorPicker } from "@/Components/ui/ColorPicker";
import { PositionSelector } from "@/Components/ui/PositionSelector";
import { Toggle } from "@/Components/ui/Toggle";
import { ToggleInput, ToggleTextarea } from "@/Components/ui/ToggleInput";
import { getThemePreset, THEME_PRESETS } from "@/constants/themePresets";
import {
    ButtonShape,
    ButtonSize,
    ButtonStyle,
    CustomDesignConfig,
    FontPair,
    SavedCustomTheme,
    UserProfile,
} from "@/types";
import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    Grid,
    Image,
    LayoutTemplate,
    Palette,
    Save,
    Sparkles,
    Trash2,
    X,
} from "lucide-react";
import React, { useCallback, useMemo, useState } from "react";

interface DesignTabProps {
    user: UserProfile;
    onUpdateUser: (updates: Partial<UserProfile>) => void;
}

// Button style options
const BUTTON_STYLES: {
    id: ButtonStyle;
    label: string;
    previewClass: string;
}[] = [
    { id: "solid", label: "Solido", previewClass: "bg-neutral-900 text-white" },
    {
        id: "outline",
        label: "Contorno",
        previewClass:
            "border-2 border-neutral-900 text-neutral-900 bg-transparent",
    },
    {
        id: "soft",
        label: "Suave",
        previewClass: "bg-neutral-100 text-neutral-900 shadow-sm",
    },
    {
        id: "hard",
        label: "Brutal",
        previewClass:
            "bg-white border-2 border-neutral-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]",
    },
];

// Button shape options
const BUTTON_SHAPES: { id: ButtonShape; label: string; class: string }[] = [
    { id: "sharp", label: "Recto", class: "rounded-none" },
    { id: "rounded", label: "Redondeado", class: "rounded-xl" },
    { id: "pill", label: "Pastilla", class: "rounded-full" },
];

// Button size options
const BUTTON_SIZES: { id: ButtonSize; label: string }[] = [
    { id: "compact", label: "Compacto" },
    { id: "normal", label: "Grande" },
];

// Typography options
const FONTS: { id: FontPair; label: string; fontClass: string }[] = [
    { id: "modern", label: "Sans Moderna", fontClass: "font-sans" },
    { id: "elegant", label: "Serif Elegante", fontClass: "font-serif" },
    { id: "mono", label: "Mono Tecnica", fontClass: "font-mono" },
];

// Icon alignment options
const ICON_ALIGNMENTS: {
    id: "left" | "inline" | "right";
    label: string;
    icon: React.ReactNode;
}[] = [
    { id: "left", label: "Izquierda", icon: <AlignLeft size={16} /> },
    { id: "inline", label: "En linea", icon: <AlignCenter size={16} /> },
    { id: "right", label: "Derecha", icon: <AlignRight size={16} /> },
];

// Background size options
const BG_SIZE_OPTIONS = [
    { value: "cover", label: "Cubrir" },
    { value: "contain", label: "Contener" },
    { value: "auto", label: "Auto" },
];

// Background repeat options
const BG_REPEAT_OPTIONS = [
    { value: "no-repeat", label: "No repetir" },
    { value: "repeat", label: "Repetir" },
    { value: "repeat-x", label: "Horizontal" },
    { value: "repeat-y", label: "Vertical" },
];

// Background attachment options
const BG_ATTACHMENT_OPTIONS = [
    { value: "scroll", label: "Scroll" },
    { value: "fixed", label: "Fijo" },
];

// Max saved custom themes
const MAX_SAVED_THEMES = 2;

export const DesignTab: React.FC<DesignTabProps> = ({ user, onUpdateUser }) => {
    const [saveThemeName, setSaveThemeName] = useState("");
    const [showSaveDialog, setShowSaveDialog] = useState(false);

    // Check if current theme is a saved custom theme
    const currentSavedTheme = useMemo(() => {
        return user.savedCustomThemes?.find((t) => t.id === user.theme);
    }, [user.savedCustomThemes, user.theme]);

    // Check if user has a custom background image
    const hasBackgroundImage = useMemo(() => {
        const bgImage = user.customDesign.backgroundImage;
        if (!bgImage || typeof bgImage !== "string") return false;
        return (
            bgImage.includes("http") ||
            bgImage.includes("data:image") ||
            bgImage.startsWith("url(")
        );
    }, [user.customDesign.backgroundImage]);

    // Check if current design has meaningful customizations (not just defaults)
    const hasCustomChanges = useMemo(() => {
        const cd = user.customDesign;
        // Consider it customized if it has non-default values
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
    }, [user.customDesign, hasBackgroundImage]);

    // Handle theme selection - applies ALL preset values but preserves background image
    const handleThemeSelect = useCallback(
        (themeId: string) => {
            // If selecting a saved custom theme
            const savedTheme = user.savedCustomThemes?.find(
                (t) => t.id === themeId
            );
            if (savedTheme) {
                onUpdateUser({
                    theme: themeId,
                    customDesign: {
                        ...savedTheme.customDesign,
                        // Preserve current background image but disable it if saved theme didn't have one
                        backgroundImage: user.customDesign.backgroundImage,
                        backgroundEnabled:
                            savedTheme.customDesign.backgroundEnabled ?? false,
                    },
                });
                return;
            }

            // If selecting a preset theme
            const preset = getThemePreset(themeId);
            if (preset) {
                // Before switching to preset, save current custom design as backup
                // Always save if we're coming from custom (so user can return to it)
                if (user.theme === "custom") {
                    onUpdateUser({
                        lastCustomDesign: { ...user.customDesign },
                    });
                }

                onUpdateUser({
                    theme: themeId as any,
                    customDesign: {
                        ...user.customDesign,
                        backgroundColor: preset.backgroundColor,
                        backgroundImage: user.customDesign.backgroundImage, // Keep image!
                        backgroundEnabled: false, // Disable bg image when selecting preset
                        buttonStyle: preset.buttonStyle,
                        buttonShape: preset.buttonShape,
                        buttonColor: preset.buttonColor,
                        buttonTextColor: preset.buttonTextColor,
                        fontPair: preset.fontPair,
                    },
                });
            }
        },
        [user.customDesign, user.theme, user.savedCustomThemes, onUpdateUser]
    );

    // Handle selecting the "custom" theme - restores last custom design if available
    const handleSelectCustom = useCallback(() => {
        if (user.lastCustomDesign) {
            onUpdateUser({
                theme: "custom",
                customDesign: {
                    ...user.lastCustomDesign,
                    // Keep current background image
                    backgroundImage: user.customDesign.backgroundImage,
                    backgroundEnabled:
                        user.lastCustomDesign.backgroundEnabled ??
                        hasBackgroundImage,
                },
            });
        } else {
            onUpdateUser({ theme: "custom" });
        }
    }, [
        user.lastCustomDesign,
        user.customDesign.backgroundImage,
        hasBackgroundImage,
        onUpdateUser,
    ]);

    // Handle custom design changes - switches to custom theme and updates lastCustomDesign
    const handleCustomChange = useCallback(
        (key: keyof CustomDesignConfig, value: any) => {
            const newCustomDesign = { ...user.customDesign, [key]: value };

            // If we're editing a saved theme, update it automatically
            if (currentSavedTheme) {
                const updatedSavedThemes = user.savedCustomThemes?.map((t) =>
                    t.id === currentSavedTheme.id
                        ? { ...t, customDesign: newCustomDesign }
                        : t
                );
                onUpdateUser({
                    customDesign: newCustomDesign,
                    savedCustomThemes: updatedSavedThemes,
                });
            } else {
                // Switch to custom theme and update
                onUpdateUser({
                    theme: "custom",
                    customDesign: newCustomDesign,
                    lastCustomDesign: newCustomDesign, // Update backup
                });
            }
        },
        [
            user.customDesign,
            user.savedCustomThemes,
            currentSavedTheme,
            onUpdateUser,
        ]
    );

    // Handle saving current theme as custom
    const handleSaveCustomTheme = useCallback(() => {
        if (!saveThemeName.trim()) return;

        const currentThemes = user.savedCustomThemes || [];

        // Check if we have room
        if (currentThemes.length >= MAX_SAVED_THEMES) {
            // Replace the oldest one (last in array)
            const newTheme: SavedCustomTheme = {
                id: `saved_${Date.now()}`,
                name: saveThemeName.trim(),
                customDesign: { ...user.customDesign },
                createdAt: new Date().toISOString(),
            };

            const updatedThemes = [newTheme, currentThemes[0]];
            onUpdateUser({
                savedCustomThemes: updatedThemes,
                theme: newTheme.id,
            });
        } else {
            const newTheme: SavedCustomTheme = {
                id: `saved_${Date.now()}`,
                name: saveThemeName.trim(),
                customDesign: { ...user.customDesign },
                createdAt: new Date().toISOString(),
            };

            onUpdateUser({
                savedCustomThemes: [...currentThemes, newTheme],
                theme: newTheme.id,
            });
        }

        setSaveThemeName("");
        setShowSaveDialog(false);
    }, [
        saveThemeName,
        user.customDesign,
        user.savedCustomThemes,
        onUpdateUser,
    ]);

    // Handle deleting a saved theme
    const handleDeleteSavedTheme = useCallback(
        (themeId: string) => {
            const updatedThemes =
                user.savedCustomThemes?.filter((t) => t.id !== themeId) || [];

            // If we're deleting the current theme, switch to custom
            if (user.theme === themeId) {
                onUpdateUser({
                    savedCustomThemes: updatedThemes,
                    theme: "custom",
                });
            } else {
                onUpdateUser({ savedCustomThemes: updatedThemes });
            }
        },
        [user.savedCustomThemes, user.theme, onUpdateUser]
    );

    // Handle background image toggle
    const handleBackgroundToggle = useCallback(
        (enabled: boolean) => {
            handleCustomChange("backgroundEnabled", enabled);
        },
        [handleCustomChange]
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">
            {/* 1. Header & Profile */}
            <section className="bg-white dark:bg-neutral-900 rounded-[32px] p-6 md:p-8 border border-neutral-100 dark:border-neutral-800 shadow-soft-xl">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-brand-50 dark:bg-brand-900/30 rounded-xl text-brand-600 dark:text-brand-400">
                        <LayoutTemplate size={24} />
                    </div>
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                        Cabecera
                    </h2>
                </div>
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    {/* Avatar Section */}
                    <ImageUploader
                        value={user.avatar}
                        onChange={(imageData) => {
                            if (imageData) {
                                onUpdateUser({ avatar: imageData.base64 });
                            } else {
                                onUpdateUser({
                                    avatar: "/images/logos/logo-icon.webp",
                                });
                            }
                        }}
                        rounded={user.customDesign.roundedAvatar !== false}
                        size={112}
                        aspectRatio={1}
                        label="Cambiar imagen"
                        outputFormat="png"
                        resizeWidth={400}
                        maxSizeKB={4000}
                    />

                    {/* Right Side: Toggle + Inputs */}
                    <div className="flex-1 w-full space-y-4">
                        {/* Avatar Style Toggles */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 py-2">
                            <Toggle
                                checked={
                                    user.customDesign.roundedAvatar !== false
                                }
                                onChange={(checked) =>
                                    handleCustomChange("roundedAvatar", checked)
                                }
                                label="Redondear"
                                labelPosition="left"
                                size="md"
                            />
                            <Toggle
                                checked={
                                    user.customDesign.avatarFloating !== false
                                }
                                onChange={(checked) =>
                                    handleCustomChange(
                                        "avatarFloating",
                                        checked
                                    )
                                }
                                label="Flotante"
                                labelPosition="left"
                                size="md"
                            />
                        </div>

                        {/* Title Input with integrated Toggle */}
                        <ToggleInput
                            id="landing-title"
                            value={user.title}
                            onChange={(value) => onUpdateUser({ title: value })}
                            enabled={user.showTitle !== false}
                            onEnabledChange={(enabled) =>
                                onUpdateUser({ showTitle: enabled })
                            }
                            placeholder="Titulo de tu landing"
                            toggleTitle="Mostrar titulo"
                            className="font-bold"
                        />

                        {/* Subtitle Input with integrated Toggle */}
                        <ToggleTextarea
                            id="landing-subtitle"
                            value={user.subtitle}
                            onChange={(value) =>
                                onUpdateUser({ subtitle: value })
                            }
                            enabled={user.showSubtitle !== false}
                            onEnabledChange={(enabled) =>
                                onUpdateUser({ showSubtitle: enabled })
                            }
                            rows={2}
                            placeholder="Subtitulo o descripcion breve"
                            toggleTitle="Mostrar subtitulo"
                        />
                    </div>
                </div>
            </section>

            {/* 2. Themes - Complete presets + Saved Custom Themes */}
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
                                Estilos predefinidos. Tu imagen de fondo se
                                conserva al cambiar de tema.
                            </p>
                        </div>
                    </div>

                    {/* Save Theme Button */}
                    {(user.theme === "custom" || currentSavedTheme) &&
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
                            {(user.savedCustomThemes?.length || 0) >=
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
                                onChange={(e) =>
                                    setSaveThemeName(e.target.value)
                                }
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
                                user.theme === theme.id
                                    ? "border-brand-500 ring-2 ring-brand-500/20 scale-105 z-10"
                                    : "border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 hover:scale-102"
                            }`}
                        >
                            <div
                                className={`absolute inset-0 ${theme.previewBg}`}
                            ></div>
                            {/* Theme preview button inside */}
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
                    {user.savedCustomThemes?.map((saved) => (
                        <div
                            key={saved.id}
                            className={`relative aspect-[3/4] rounded-xl border-2 transition-all duration-300 overflow-hidden group ${
                                user.theme === saved.id
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
                                {/* Button preview */}
                                <div className="absolute inset-x-2 bottom-8 top-auto">
                                    <div
                                        className={`h-4 w-full ${
                                            saved.customDesign.buttonShape ===
                                            "pill"
                                                ? "rounded-full"
                                                : saved.customDesign
                                                      .buttonShape === "sharp"
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
                                                saved.customDesign
                                                    .buttonStyle === "outline"
                                                    ? "transparent"
                                                    : saved.customDesign
                                                          .buttonColor,
                                            borderColor:
                                                saved.customDesign.buttonColor,
                                        }}
                                    />
                                </div>
                            </button>
                            {/* Delete button */}
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
                            user.theme === "custom"
                                ? "border-brand-500 ring-2 ring-brand-500/20 scale-105 z-10"
                                : "border-dashed border-neutral-300 dark:border-neutral-600 hover:border-neutral-400"
                        }`}
                    >
                        <div
                            className="absolute inset-0"
                            style={{
                                backgroundColor:
                                    user.theme === "custom"
                                        ? user.customDesign.backgroundColor
                                        : user.lastCustomDesign
                                              ?.backgroundColor || "#f5f5f5",
                            }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Sparkles size={24} className="text-neutral-400" />
                        </div>
                        {user.lastCustomDesign && user.theme !== "custom" && (
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
                {user.theme === "custom" && (
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

            {/* 3. Background Image Section */}
            <section className="bg-white dark:bg-neutral-900 rounded-[32px] p-6 md:p-8 border border-neutral-100 dark:border-neutral-800 shadow-soft-xl">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400">
                            <Image size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                                Imagen de Fondo
                            </h2>
                            <p className="text-sm text-neutral-400 dark:text-neutral-500">
                                Tu imagen se conserva al cambiar temas
                            </p>
                        </div>
                    </div>

                    {/* Background Toggle - Only show if has image */}
                    {hasBackgroundImage && (
                        <Toggle
                            checked={
                                user.customDesign.backgroundEnabled !== false
                            }
                            onChange={handleBackgroundToggle}
                            label="Mostrar"
                            labelPosition="left"
                            size="md"
                        />
                    )}
                </div>

                {/* Main layout: Image 3/4 + Controls 1/4 on desktop, stacked on mobile */}
                <div
                    className={`flex flex-col ${
                        hasBackgroundImage &&
                        user.customDesign.backgroundEnabled !== false
                            ? "md:flex-row md:min-h-[280px]"
                            : ""
                    } gap-4`}
                >
                    {/* Image preview / Upload zone - Full on mobile, 3/4 on desktop when controls visible */}
                    <div
                        className={`relative ${
                            hasBackgroundImage &&
                            user.customDesign.backgroundEnabled !== false
                                ? "md:w-3/4 md:h-full"
                                : "w-full"
                        }`}
                    >
                        <div
                            className={`
                                relative w-full h-48 md:h-full md:min-h-[280px] rounded-2xl border-2 border-dashed transition-all duration-300
                                ${
                                    hasBackgroundImage
                                        ? "border-transparent"
                                        : "border-neutral-300 dark:border-neutral-600 hover:border-brand-400 dark:hover:border-brand-500"
                                }
                                ${
                                    hasBackgroundImage &&
                                    !user.customDesign.backgroundEnabled
                                        ? "opacity-50"
                                        : ""
                                }
                            `}
                            style={
                                hasBackgroundImage
                                    ? {
                                          backgroundImage:
                                              user.customDesign.backgroundImage
                                                  ?.toString()
                                                  .startsWith("url(")
                                                  ? user.customDesign.backgroundImage?.toString()
                                                  : `url("${user.customDesign.backgroundImage}")`,
                                          backgroundSize:
                                              user.customDesign
                                                  .backgroundSize || "cover",
                                          backgroundPosition:
                                              user.customDesign
                                                  .backgroundPosition ||
                                              "center",
                                          backgroundRepeat:
                                              user.customDesign
                                                  .backgroundRepeat ||
                                              "no-repeat",
                                          backgroundColor:
                                              user.customDesign.backgroundColor,
                                      }
                                    : {
                                          backgroundColor:
                                              user.customDesign.backgroundColor,
                                      }
                            }
                        >
                            {/* Disabled overlay */}
                            {hasBackgroundImage &&
                                !user.customDesign.backgroundEnabled && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl">
                                        <span className="px-3 py-1.5 bg-neutral-900/80 text-white text-sm font-medium rounded-lg">
                                            Imagen desactivada
                                        </span>
                                    </div>
                                )}

                            {/* Delete button for existing image */}
                            {hasBackgroundImage && (
                                <button
                                    onClick={() => {
                                        // Update both props at once to avoid multiple re-renders
                                        const newCustomDesign = {
                                            ...user.customDesign,
                                            backgroundImage: undefined,
                                            backgroundEnabled: false,
                                        };
                                        onUpdateUser({
                                            theme: currentSavedTheme
                                                ? user.theme
                                                : "custom",
                                            customDesign: newCustomDesign,
                                            ...(currentSavedTheme
                                                ? {
                                                      savedCustomThemes:
                                                          user.savedCustomThemes?.map(
                                                              (t) =>
                                                                  t.id ===
                                                                  currentSavedTheme.id
                                                                      ? {
                                                                            ...t,
                                                                            customDesign:
                                                                                newCustomDesign,
                                                                        }
                                                                      : t
                                                          ),
                                                  }
                                                : {
                                                      lastCustomDesign:
                                                          newCustomDesign,
                                                  }),
                                        });
                                    }}
                                    className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg transition-colors z-10"
                                    data-tooltip="Eliminar imagen"
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}

                            {/* Upload overlay/zone */}
                            <div
                                className={`
                                absolute inset-0 flex flex-col items-center justify-center rounded-2xl
                                ${
                                    hasBackgroundImage
                                        ? "bg-black/40 opacity-0 hover:opacity-100 transition-opacity"
                                        : ""
                                }
                            `}
                            >
                                <ImageUploader
                                    value={undefined}
                                    onChange={(imageData) => {
                                        if (imageData) {
                                            // Update all background props at once to avoid multiple re-renders
                                            const newCustomDesign = {
                                                ...user.customDesign,
                                                backgroundImage: `url("${imageData.base64}")`,
                                                backgroundEnabled: true,
                                                backgroundSize: "cover",
                                                backgroundPosition: "center",
                                                backgroundRepeat: "no-repeat",
                                            };
                                            onUpdateUser({
                                                theme: currentSavedTheme
                                                    ? user.theme
                                                    : "custom",
                                                customDesign: newCustomDesign,
                                                ...(currentSavedTheme
                                                    ? {
                                                          savedCustomThemes:
                                                              user.savedCustomThemes?.map(
                                                                  (t) =>
                                                                      t.id ===
                                                                      currentSavedTheme.id
                                                                          ? {
                                                                                ...t,
                                                                                customDesign:
                                                                                    newCustomDesign,
                                                                            }
                                                                          : t
                                                              ),
                                                      }
                                                    : {
                                                          lastCustomDesign:
                                                              newCustomDesign,
                                                      }),
                                            });
                                        }
                                    }}
                                    rounded={false}
                                    size={80}
                                    aspectRatio={16 / 10}
                                    label={
                                        hasBackgroundImage
                                            ? "Cambiar imagen"
                                            : "Subir imagen de fondo"
                                    }
                                    outputFormat="webp"
                                    outputQuality={0.82}
                                    resizeWidth={1920}
                                    maxSizeKB={8000}
                                    className={
                                        hasBackgroundImage ? "opacity-90" : ""
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* Background options - 1/4 on desktop, stacked on mobile */}
                    {hasBackgroundImage &&
                        user.customDesign.backgroundEnabled !== false && (
                            <div className="md:w-1/4 flex flex-col gap-4">
                                {/* Position selector - Top */}
                                <div className="flex justify-center md:justify-start">
                                    <PositionSelector
                                        value={
                                            user.customDesign
                                                .backgroundPosition || "center"
                                        }
                                        onChange={(pos) =>
                                            handleCustomChange(
                                                "backgroundPosition",
                                                pos
                                            )
                                        }
                                        label="Posicion"
                                    />
                                </div>

                                {/* Other controls in column */}
                                <div className="grid grid-cols-3 md:grid-cols-1 gap-3">
                                    {/* Size */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                                            Tamanio
                                        </label>
                                        <div className="flex gap-0.5 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg">
                                            {BG_SIZE_OPTIONS.map((opt) => (
                                                <button
                                                    key={opt.value}
                                                    onClick={() =>
                                                        handleCustomChange(
                                                            "backgroundSize",
                                                            opt.value
                                                        )
                                                    }
                                                    className={`flex-1 px-1.5 py-1 text-[10px] font-medium rounded-md transition-all ${
                                                        (user.customDesign
                                                            .backgroundSize ||
                                                            "cover") ===
                                                        opt.value
                                                            ? "bg-white dark:bg-neutral-700 shadow-sm text-neutral-900 dark:text-white"
                                                            : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                                                    }`}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Repeat */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                                            Repetir
                                        </label>
                                        <select
                                            value={
                                                user.customDesign
                                                    .backgroundRepeat ||
                                                "no-repeat"
                                            }
                                            onChange={(e) =>
                                                handleCustomChange(
                                                    "backgroundRepeat",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-2 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                                        >
                                            {BG_REPEAT_OPTIONS.map((opt) => (
                                                <option
                                                    key={opt.value}
                                                    value={opt.value}
                                                >
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Attachment */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                                            Fijacion
                                        </label>
                                        <div className="flex gap-0.5 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg">
                                            {BG_ATTACHMENT_OPTIONS.map(
                                                (opt) => (
                                                    <button
                                                        key={opt.value}
                                                        onClick={() =>
                                                            handleCustomChange(
                                                                "backgroundAttachment",
                                                                opt.value as
                                                                    | "fixed"
                                                                    | "scroll"
                                                            )
                                                        }
                                                        className={`flex-1 px-1.5 py-1 text-[10px] font-medium rounded-md transition-all ${
                                                            (user.customDesign
                                                                .backgroundAttachment ||
                                                                "scroll") ===
                                                            opt.value
                                                                ? "bg-white dark:bg-neutral-700 shadow-sm text-neutral-900 dark:text-white"
                                                                : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                                                        }`}
                                                    >
                                                        {opt.label}
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                </div>
            </section>

            {/* 4. Appearance - Granular Customization */}
            <section className="bg-white dark:bg-neutral-900 rounded-[32px] overflow-hidden border border-neutral-100 dark:border-neutral-800 shadow-soft-xl">
                <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                            <Palette size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                                Apariencia
                            </h2>
                            <p className="text-sm text-neutral-400 dark:text-neutral-500">
                                Personaliza colores, formas y tipografia.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-6 md:p-8 space-y-8">
                    {/* Background & Text Colors */}
                    <div className="grid md:grid-cols-[200px_1fr] gap-6 items-start">
                        <div className="pt-2">
                            <label className="font-semibold text-neutral-800 dark:text-neutral-200 block">
                                Colores Base
                            </label>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                                Fondo y texto de la pagina
                            </p>
                        </div>
                        <div className="flex gap-8 flex-wrap">
                            <ColorPicker
                                value={user.customDesign.backgroundColor}
                                onChange={(color) =>
                                    handleCustomChange("backgroundColor", color)
                                }
                                label="Fondo"
                                size="md"
                                showHex
                            />
                            <ColorPicker
                                value={user.customDesign.textColor || "#ffffff"}
                                onChange={(color) =>
                                    handleCustomChange("textColor", color)
                                }
                                label="Texto"
                                size="md"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <p className="text-xs text-neutral-400 dark:text-neutral-500">
                                El color de texto se aplica a titulos,
                                subtitulos y encabezados. Si no lo configuras,
                                se calculara automaticamente segun el contraste
                                del fondo.
                            </p>
                        </div>
                    </div>

                    <hr className="border-neutral-100 dark:border-neutral-800" />

                    {/* Button Style */}
                    <div className="grid md:grid-cols-[200px_1fr] gap-6 items-start">
                        <div className="pt-2">
                            <label className="font-semibold text-neutral-800 dark:text-neutral-200 block">
                                Estilo de Boton
                            </label>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                                Tipo de relleno visual
                            </p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {BUTTON_STYLES.map((style) => (
                                <button
                                    key={style.id}
                                    onClick={() =>
                                        handleCustomChange(
                                            "buttonStyle",
                                            style.id
                                        )
                                    }
                                    className={`
                                        h-12 rounded-xl text-sm font-bold transition-all
                                        ${style.previewClass}
                                        ${
                                            user.customDesign.buttonStyle ===
                                            style.id
                                                ? "ring-2 ring-brand-500 ring-offset-2"
                                                : "hover:opacity-80"
                                        }
                                    `}
                                >
                                    {style.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Button Shape */}
                    <div className="grid md:grid-cols-[200px_1fr] gap-6 items-start">
                        <div className="pt-2">
                            <label className="font-semibold text-neutral-800 dark:text-neutral-200 block">
                                Forma de Boton
                            </label>
                        </div>
                        <div className="flex gap-4 bg-neutral-50 dark:bg-neutral-800 p-1.5 rounded-2xl w-fit border border-neutral-100 dark:border-neutral-700">
                            {BUTTON_SHAPES.map((shape) => (
                                <button
                                    key={shape.id}
                                    onClick={() =>
                                        handleCustomChange(
                                            "buttonShape",
                                            shape.id
                                        )
                                    }
                                    className={`
                                        w-12 h-10 flex items-center justify-center transition-all shadow-sm
                                        ${shape.class}
                                        ${
                                            user.customDesign.buttonShape ===
                                            shape.id
                                                ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-md"
                                                : "bg-transparent text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                                        }
                                    `}
                                >
                                    <div
                                        className={`w-6 h-4 border-2 border-current ${
                                            shape.class === "rounded-none"
                                                ? "rounded-none"
                                                : shape.class === "rounded-xl"
                                                ? "rounded-md"
                                                : "rounded-full"
                                        }`}
                                    ></div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Button Size */}
                    <div className="grid md:grid-cols-[200px_1fr] gap-6 items-start">
                        <div className="pt-2">
                            <label className="font-semibold text-neutral-800 dark:text-neutral-200 block">
                                Tamanio de Boton
                            </label>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                                Altura y espaciado interno
                            </p>
                        </div>
                        <div className="flex gap-2 bg-neutral-50 dark:bg-neutral-800 p-1.5 rounded-2xl w-fit border border-neutral-100 dark:border-neutral-700">
                            {BUTTON_SIZES.map((size) => (
                                <button
                                    key={size.id}
                                    onClick={() =>
                                        handleCustomChange(
                                            "buttonSize",
                                            size.id
                                        )
                                    }
                                    className={`
                                        px-4 py-2 rounded-xl text-sm font-medium transition-all
                                        ${
                                            (user.customDesign.buttonSize ||
                                                "compact") === size.id
                                                ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-md"
                                                : "bg-transparent text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                                        }
                                    `}
                                >
                                    {size.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Button Colors */}
                    <div className="grid md:grid-cols-[200px_1fr] gap-6 items-start">
                        <div className="pt-2">
                            <label className="font-semibold text-neutral-800 dark:text-neutral-200 block">
                                Colores de Boton
                            </label>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                                Fondo, texto y borde opcional
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="flex gap-8 flex-wrap">
                                <ColorPicker
                                    value={user.customDesign.buttonColor}
                                    onChange={(color) =>
                                        handleCustomChange("buttonColor", color)
                                    }
                                    label="Fondo"
                                    size="md"
                                />
                                <ColorPicker
                                    value={user.customDesign.buttonTextColor}
                                    onChange={(color) =>
                                        handleCustomChange(
                                            "buttonTextColor",
                                            color
                                        )
                                    }
                                    label="Texto / Icono"
                                    size="md"
                                />
                                <div className="flex flex-col gap-1">
                                    <ColorPicker
                                        value={
                                            user.customDesign
                                                .buttonBorderColor ||
                                            user.customDesign.buttonColor
                                        }
                                        onChange={(color) =>
                                            handleCustomChange(
                                                "buttonBorderColor",
                                                color
                                            )
                                        }
                                        label="Borde"
                                        size="md"
                                        disabled={
                                            !user.customDesign.buttonBorderColor
                                        }
                                    />
                                    {user.customDesign.buttonBorderColor && (
                                        <button
                                            onClick={() =>
                                                handleCustomChange(
                                                    "buttonBorderColor",
                                                    undefined
                                                )
                                            }
                                            className="text-xs text-red-500 hover:text-red-600"
                                        >
                                            Quitar borde
                                        </button>
                                    )}
                                </div>
                            </div>
                            {!user.customDesign.buttonBorderColor && (
                                <button
                                    onClick={() =>
                                        handleCustomChange(
                                            "buttonBorderColor",
                                            user.customDesign.buttonColor
                                        )
                                    }
                                    className="text-sm text-brand-500 hover:text-brand-600 font-medium"
                                >
                                    + Agregar color de borde diferente
                                </button>
                            )}
                        </div>
                    </div>

                    <hr className="border-neutral-100 dark:border-neutral-800" />

                    {/* Show Button Icons Toggle */}
                    <div className="grid md:grid-cols-[200px_1fr] gap-6 items-start">
                        <div className="pt-2">
                            <label className="font-semibold text-neutral-800 dark:text-neutral-200 block">
                                Iconos en Botones
                            </label>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                                Mostrar iconos junto al texto
                            </p>
                        </div>
                        <div className="space-y-4">
                            <Toggle
                                checked={
                                    user.customDesign.showButtonIcons !== false
                                }
                                onChange={(checked) =>
                                    handleCustomChange(
                                        "showButtonIcons",
                                        checked
                                    )
                                }
                                label="Mostrar iconos"
                                size="md"
                            />

                            {/* Icon Alignment - Only show if icons are enabled */}
                            {user.customDesign.showButtonIcons !== false && (
                                <div className="flex gap-2 bg-neutral-100 dark:bg-neutral-800 p-1.5 rounded-xl w-fit">
                                    {ICON_ALIGNMENTS.map((align) => (
                                        <button
                                            key={align.id}
                                            onClick={() =>
                                                handleCustomChange(
                                                    "buttonIconAlignment",
                                                    align.id
                                                )
                                            }
                                            className={`
                                                px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all
                                                ${
                                                    (user.customDesign
                                                        .buttonIconAlignment ||
                                                        "left") === align.id
                                                        ? "bg-white dark:bg-neutral-700 shadow-sm text-neutral-900 dark:text-white"
                                                        : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                                                }
                                            `}
                                            data-tooltip={align.label}
                                        >
                                            {align.icon}
                                            <span className="hidden sm:inline">
                                                {align.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Show Link Subtexts Toggle */}
                    <div className="grid md:grid-cols-[200px_1fr] gap-6 items-start">
                        <div className="pt-2">
                            <label className="font-semibold text-neutral-800 dark:text-neutral-200 block">
                                Mostrar URLs
                            </label>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                                Muestra la URL debajo del titulo
                            </p>
                        </div>
                        <Toggle
                            checked={user.customDesign.showLinkSubtext === true}
                            onChange={(checked) =>
                                handleCustomChange("showLinkSubtext", checked)
                            }
                            label="Mostrar enlaces"
                            size="md"
                        />
                    </div>

                    <hr className="border-neutral-100 dark:border-neutral-800" />

                    {/* Typography */}
                    <div className="grid md:grid-cols-[200px_1fr] gap-6 items-start">
                        <div className="pt-2">
                            <label className="font-semibold text-neutral-800 dark:text-neutral-200 block">
                                Tipografia
                            </label>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                                Estilo de fuente
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {FONTS.map((font) => (
                                <button
                                    key={font.id}
                                    onClick={() =>
                                        handleCustomChange("fontPair", font.id)
                                    }
                                    className={`
                                        p-4 rounded-xl border text-left transition-all
                                        ${
                                            user.customDesign.fontPair ===
                                            font.id
                                                ? "border-brand-500 bg-brand-50/20 dark:bg-brand-900/20"
                                                : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
                                        }
                                    `}
                                >
                                    <span
                                        className={`block text-lg font-bold text-neutral-900 dark:text-white ${font.fontClass}`}
                                    >
                                        Aa
                                    </span>
                                    <span className="text-sm text-neutral-500 dark:text-neutral-400">
                                        {font.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
