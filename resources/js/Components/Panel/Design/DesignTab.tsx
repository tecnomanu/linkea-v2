import { ImageUploader } from "@/Components/Shared/ImageUploader";
import { ColorPicker } from "@/Components/ui/ColorPicker";
import { Input } from "@/Components/ui/Input";
import { PositionSelector } from "@/Components/ui/PositionSelector";
import { Textarea } from "@/Components/ui/Textarea";
import { Toggle } from "@/Components/ui/Toggle";
import {
    getLegacyBackgroundStyles,
    LEGACY_BACKGROUNDS,
    LegacyBackground,
} from "@/constants/legacyBackgrounds";
import { getThemePreset, isPresetTheme, THEME_PRESETS } from "@/constants/themePresets";
import { ButtonShape, ButtonStyle, FontPair, UserProfile } from "@/types";
import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    Archive,
    Grid,
    Image,
    LayoutTemplate,
    Palette,
    Sliders,
    Sparkles,
    Trash2,
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
        previewClass: "border-2 border-neutral-900 text-neutral-900 bg-transparent",
    },
    {
        id: "soft",
        label: "Suave",
        previewClass: "bg-neutral-100 text-neutral-900 shadow-sm",
    },
    {
        id: "hard",
        label: "Brutal",
        previewClass: "bg-white border-2 border-neutral-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]",
    },
];

// Button shape options
const BUTTON_SHAPES: { id: ButtonShape; label: string; class: string }[] = [
    { id: "sharp", label: "Recto", class: "rounded-none" },
    { id: "rounded", label: "Redondeado", class: "rounded-xl" },
    { id: "pill", label: "Pastilla", class: "rounded-full" },
];

// Typography options
const FONTS: { id: FontPair; label: string; fontClass: string }[] = [
    { id: "modern", label: "Sans Moderna", fontClass: "font-sans" },
    { id: "elegant", label: "Serif Elegante", fontClass: "font-serif" },
    { id: "mono", label: "Mono Tecnica", fontClass: "font-mono" },
];

// Icon alignment options
const ICON_ALIGNMENTS: { id: 'left' | 'inline' | 'right'; label: string; icon: React.ReactNode }[] = [
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

export const DesignTab: React.FC<DesignTabProps> = ({ user, onUpdateUser }) => {
    const [showLegacyBackgrounds, setShowLegacyBackgrounds] = useState(false);
    const [selectedLegacyBg, setSelectedLegacyBg] = useState<LegacyBackground | null>(null);

    // Check if current theme is a preset
    const isCurrentThemePreset = isPresetTheme(user.theme);

    // Handle theme selection - applies ALL preset values
    const handleThemeSelect = useCallback((themeId: string) => {
        const preset = getThemePreset(themeId);
        if (preset) {
            onUpdateUser({
                theme: themeId as any,
                customDesign: {
                    ...user.customDesign,
                    backgroundColor: preset.backgroundColor,
                    backgroundImage: preset.backgroundImage,
                    buttonStyle: preset.buttonStyle,
                    buttonShape: preset.buttonShape,
                    buttonColor: preset.buttonColor,
                    buttonTextColor: preset.buttonTextColor,
                    fontPair: preset.fontPair,
                    // Clear legacy background when selecting a preset theme
                    backgroundProps: undefined,
                    backgroundControls: undefined,
                },
            });
            setSelectedLegacyBg(null);
        }
    }, [user.customDesign, onUpdateUser]);

    // Handle custom design changes - switches to custom theme
    const handleCustomChange = useCallback((
        key: keyof UserProfile["customDesign"],
        value: any
    ) => {
        onUpdateUser({
            theme: "custom",
            customDesign: { ...user.customDesign, [key]: value },
        });
    }, [user.customDesign, onUpdateUser]);

    // Find the currently selected legacy background based on backgroundImage
    const currentSelectedLegacyBg = useMemo(() => {
        const currentBgImage =
            typeof user.customDesign.backgroundImage === "string"
                ? user.customDesign.backgroundImage
                : undefined;
        if (!currentBgImage) return null;

        const normalizeForCompare = (s: string) =>
            s.replace(/\\\//g, "/").replace(/\\"/g, '"').substring(0, 200);

        return (
            LEGACY_BACKGROUNDS.find((bg) => {
                const styles = getLegacyBackgroundStyles(bg);
                return (
                    styles.backgroundImage &&
                    normalizeForCompare(currentBgImage) ===
                        normalizeForCompare(styles.backgroundImage as string)
                );
            }) || null
        );
    }, [user.customDesign.backgroundImage]);

    // Handle legacy background selection
    const handleLegacyBackgroundSelect = useCallback((backgroundId: string) => {
        const background = LEGACY_BACKGROUNDS.find((bg) => bg.id === backgroundId);
        if (background) {
            const styles = getLegacyBackgroundStyles(background);
            setSelectedLegacyBg(background);
            onUpdateUser({
                theme: "custom",
                customDesign: {
                    ...user.customDesign,
                    backgroundColor: background.backgroundColor,
                    backgroundImage: (styles.backgroundImage || styles.background) as string,
                    backgroundProps: background.props ? { ...background.props } : undefined,
                    backgroundControls: background.controls ? { ...background.controls } : undefined,
                },
            });
        }
    }, [user.customDesign, onUpdateUser]);

    // Handle background property changes (colors, opacity, scale, rotation)
    const handleBackgroundPropChange = useCallback(
        (propName: string, value: string | number) => {
            const currentBg = selectedLegacyBg || currentSelectedLegacyBg;
            if (!currentBg) return;

            const newProps = {
                ...(user.customDesign.backgroundProps || currentBg.props || {}),
                [propName]: value,
            };

            // For gradient, regenerate the background
            if (currentBg.id === "gradient") {
                const rotation = propName === "rotationBg" ? value : newProps.rotationBg ?? 90;
                const color1 = propName === "color1" ? value : newProps.color1 ?? "#FE6A16";
                const color2 = propName === "color2" ? value : newProps.color2 ?? "#ff528e";
                const newBackground = `linear-gradient(${rotation}deg, ${color1} 0%, ${color2} 100%)`;

                onUpdateUser({
                    theme: "custom",
                    customDesign: {
                        ...user.customDesign,
                        backgroundImage: newBackground,
                        backgroundProps: newProps,
                    },
                });
            } else {
                onUpdateUser({
                    theme: "custom",
                    customDesign: {
                        ...user.customDesign,
                        backgroundProps: newProps,
                    },
                });
            }
        },
        [selectedLegacyBg, currentSelectedLegacyBg, user.customDesign, onUpdateUser]
    );

    // Check if current background is a custom image (not legacy pattern)
    const hasCustomBackgroundImage = useMemo(() => {
        const bgImage = user.customDesign.backgroundImage;
        if (!bgImage || typeof bgImage !== "string") return false;
        return bgImage.includes("http") || bgImage.includes("data:image");
    }, [user.customDesign.backgroundImage]);

    // Get the active background for editing
    const activeLegacyBg = selectedLegacyBg || currentSelectedLegacyBg;
    const bgControls = activeLegacyBg?.controls;
    const bgProps = user.customDesign.backgroundProps || activeLegacyBg?.props || {};

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
                                onUpdateUser({ avatar: "/images/logo_only.png" });
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
                        {/* Round Avatar Toggle */}
                        <div className="flex items-center justify-between py-2">
                            <Toggle
                                checked={user.customDesign.roundedAvatar !== false}
                                onChange={(checked) => handleCustomChange("roundedAvatar", checked)}
                                label="Redondear imagen"
                                labelPosition="left"
                                size="md"
                            />
                        </div>

                        {/* Name Input */}
                        <Input
                            id="landing-name"
                            type="text"
                            value={user.name}
                            onChange={(e) => onUpdateUser({ name: e.target.value })}
                            placeholder="Titulo de tu landing"
                            className="font-bold"
                        />

                        {/* Bio Input */}
                        <Textarea
                            id="landing-bio"
                            value={user.bio}
                            onChange={(e) => onUpdateUser({ bio: e.target.value })}
                            rows={2}
                            placeholder="Subtitulo o descripcion breve"
                        />
                    </div>
                </div>
            </section>

            {/* 2. Themes - Complete presets */}
            <section className="bg-white dark:bg-neutral-900 rounded-[32px] p-6 md:p-8 border border-neutral-100 dark:border-neutral-800 shadow-soft-xl">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
                        <Grid size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                            Temas
                        </h2>
                        <p className="text-sm text-neutral-400 dark:text-neutral-500">
                            Estilos predefinidos completos. Selecciona uno para aplicar fondo, colores y tipografia.
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
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
                            <div className={`absolute inset-0 ${theme.previewBg}`}></div>
                            {/* Theme preview button inside */}
                            <div className="absolute inset-x-2 bottom-8 top-auto">
                                <div 
                                    className={`h-4 w-full ${
                                        theme.buttonShape === 'pill' ? 'rounded-full' : 
                                        theme.buttonShape === 'sharp' ? 'rounded-none' : 'rounded-md'
                                    } ${
                                        theme.buttonStyle === 'outline' ? 'border-2' : ''
                                    }`}
                                    style={{
                                        backgroundColor: theme.buttonStyle === 'outline' ? 'transparent' : theme.buttonColor,
                                        borderColor: theme.buttonColor,
                                    }}
                                />
                            </div>
                            <span className="absolute bottom-1.5 left-1 right-1 text-center text-[10px] font-bold px-1 py-0.5 rounded-md backdrop-blur-md bg-white/70 dark:bg-black/50 text-neutral-900 dark:text-white truncate">
                                {theme.name}
                            </span>
                            {/* Custom indicator */}
                            {user.theme === "custom" && theme.id === "custom" && (
                                <div className="absolute top-1 right-1">
                                    <Sparkles size={12} className="text-amber-500" />
                                </div>
                            )}
                        </button>
                    ))}
                    {/* Custom theme slot */}
                    <button
                        onClick={() => onUpdateUser({ theme: "custom" })}
                        className={`relative aspect-[3/4] rounded-xl border-2 transition-all duration-300 overflow-hidden group ${
                            user.theme === "custom"
                                ? "border-brand-500 ring-2 ring-brand-500/20 scale-105 z-10"
                                : "border-dashed border-neutral-300 dark:border-neutral-600 hover:border-neutral-400"
                        }`}
                    >
                        <div 
                            className="absolute inset-0"
                            style={{ backgroundColor: user.customDesign.backgroundColor }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Sparkles size={24} className="text-neutral-400" />
                        </div>
                        <span className="absolute bottom-1.5 left-1 right-1 text-center text-[10px] font-bold px-1 py-0.5 rounded-md backdrop-blur-md bg-white/70 dark:bg-black/50 text-neutral-900 dark:text-white truncate">
                            Personalizado
                        </span>
                    </button>
                </div>
                {!isCurrentThemePreset && user.theme === "custom" && (
                    <p className="mt-3 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <Sparkles size={12} />
                        Estas usando un tema personalizado. Los cambios en Apariencia se guardaran aqui.
                    </p>
                )}
            </section>

            {/* 3. Custom Background Image */}
            <section className="bg-white dark:bg-neutral-900 rounded-[32px] p-6 md:p-8 border border-neutral-100 dark:border-neutral-800 shadow-soft-xl">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400">
                        <Image size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                            Imagen de Fondo
                        </h2>
                        <p className="text-sm text-neutral-400 dark:text-neutral-500">
                            Sube tu propia imagen como fondo
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Combined upload zone with preview */}
                    <div className="relative">
                        {/* Background preview / Upload zone */}
                        <div
                            className={`
                                relative w-full h-48 rounded-2xl border-2 border-dashed transition-all duration-300
                                ${hasCustomBackgroundImage 
                                    ? "border-transparent" 
                                    : "border-neutral-300 dark:border-neutral-600 hover:border-brand-400 dark:hover:border-brand-500"
                                }
                            `}
                            style={hasCustomBackgroundImage ? {
                                backgroundImage: user.customDesign.backgroundImage?.startsWith("url(")
                                    ? user.customDesign.backgroundImage
                                    : `url("${user.customDesign.backgroundImage}")`,
                                backgroundSize: user.customDesign.backgroundSize || "cover",
                                backgroundPosition: user.customDesign.backgroundPosition || "center",
                                backgroundRepeat: user.customDesign.backgroundRepeat || "no-repeat",
                            } : {
                                backgroundColor: user.customDesign.backgroundColor,
                            }}
                        >
                            {/* Delete button for existing image */}
                            {hasCustomBackgroundImage && (
                                <button
                                    onClick={() => {
                                        onUpdateUser({
                                            theme: "custom",
                                            customDesign: {
                                                ...user.customDesign,
                                                backgroundImage: undefined,
                                            },
                                        });
                                        setSelectedLegacyBg(null);
                                    }}
                                    className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg transition-colors z-10"
                                    title="Eliminar imagen de fondo"
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}

                            {/* Upload overlay/zone */}
                            <div className={`
                                absolute inset-0 flex flex-col items-center justify-center rounded-2xl
                                ${hasCustomBackgroundImage 
                                    ? "bg-black/40 opacity-0 hover:opacity-100 transition-opacity" 
                                    : ""
                                }
                            `}>
                                <ImageUploader
                                    value={undefined}
                                    onChange={(imageData) => {
                                        if (imageData) {
                                            onUpdateUser({
                                                theme: "custom",
                                                customDesign: {
                                                    ...user.customDesign,
                                                    backgroundImage: `url("${imageData.base64}")`,
                                                    backgroundSize: "cover",
                                                    backgroundPosition: "center",
                                                    backgroundRepeat: "no-repeat",
                                                },
                                            });
                                            setSelectedLegacyBg(null);
                                        }
                                    }}
                                    rounded={false}
                                    size={80}
                                    aspectRatio={16 / 9}
                                    label={hasCustomBackgroundImage ? "Cambiar imagen" : "Subir imagen de fondo"}
                                    outputFormat="webp"
                                    resizeWidth={1920}
                                    maxSizeKB={500}
                                    className={hasCustomBackgroundImage ? "opacity-90" : ""}
                                />
                            </div>
                        </div>
                        <p className="mt-2 text-xs text-neutral-400 text-center">
                            Recomendado: 1920x1080px o mayor. Formato WebP para mejor rendimiento.
                        </p>
                    </div>

                    {/* Background options when image is set */}
                    {hasCustomBackgroundImage && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                            {/* Size */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
                                    Tamanio
                                </label>
                                <div className="flex gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl">
                                    {BG_SIZE_OPTIONS.map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => handleCustomChange("backgroundSize", opt.value)}
                                            className={`flex-1 px-2 py-1.5 text-xs font-medium rounded-lg transition-all ${
                                                (user.customDesign.backgroundSize || "cover") === opt.value
                                                    ? "bg-white dark:bg-neutral-700 shadow-sm text-neutral-900 dark:text-white"
                                                    : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Position - Visual selector */}
                            <div className="space-y-2">
                                <PositionSelector
                                    value={user.customDesign.backgroundPosition || "center"}
                                    onChange={(pos) => handleCustomChange("backgroundPosition", pos)}
                                    label="Posicion"
                                />
                            </div>

                            {/* Repeat */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
                                    Repetir
                                </label>
                                <select
                                    value={user.customDesign.backgroundRepeat || "no-repeat"}
                                    onChange={(e) => handleCustomChange("backgroundRepeat", e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                                >
                                    {BG_REPEAT_OPTIONS.map((opt) => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Attachment */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
                                    Fijacion
                                </label>
                                <div className="flex gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl">
                                    {BG_ATTACHMENT_OPTIONS.map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => handleCustomChange("backgroundAttachment", opt.value as 'fixed' | 'scroll')}
                                            className={`flex-1 px-2 py-1.5 text-xs font-medium rounded-lg transition-all ${
                                                (user.customDesign.backgroundAttachment || "scroll") === opt.value
                                                    ? "bg-white dark:bg-neutral-700 shadow-sm text-neutral-900 dark:text-white"
                                                    : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* 4. Legacy Backgrounds (Collapsible) */}
            <section className="bg-white dark:bg-neutral-900 rounded-[32px] p-6 md:p-8 border border-neutral-100 dark:border-neutral-800 shadow-soft-xl">
                <button
                    onClick={() => setShowLegacyBackgrounds(!showLegacyBackgrounds)}
                    className="w-full flex items-center justify-between"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-xl text-amber-600 dark:text-amber-400">
                            <Archive size={24} />
                        </div>
                        <div className="text-left">
                            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                                Fondos Legacy
                            </h2>
                            <p className="text-sm text-neutral-400 dark:text-neutral-500">
                                Fondos clasicos de versiones anteriores
                            </p>
                        </div>
                    </div>
                    <div
                        className={`p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 transition-transform duration-300 ${
                            showLegacyBackgrounds ? "rotate-180" : ""
                        }`}
                    >
                        <svg className="w-5 h-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </button>

                {showLegacyBackgrounds && (
                    <div className="mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-800">
                        <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                            <p className="text-sm text-amber-700 dark:text-amber-300">
                                Estos fondos son de versiones anteriores de Linkea. Se recomienda usar los Temas modernos para nuevas landings.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                            {LEGACY_BACKGROUNDS.map((bg) => {
                                const styles = getLegacyBackgroundStyles(bg);
                                const normalizeForCompare = (s: string) =>
                                    s.replace(/\\\//g, "/").replace(/\\"/g, '"').substring(0, 200);
                                const currentBgImage =
                                    typeof user.customDesign.backgroundImage === "string"
                                        ? user.customDesign.backgroundImage
                                        : undefined;
                                const isSelected =
                                    currentBgImage &&
                                    styles.backgroundImage &&
                                    normalizeForCompare(currentBgImage) ===
                                        normalizeForCompare(styles.backgroundImage as string);

                                return (
                                    <button
                                        key={bg.id}
                                        onClick={() => handleLegacyBackgroundSelect(bg.id)}
                                        className={`relative aspect-[3/4] rounded-xl border-2 transition-all duration-300 overflow-hidden group hover:scale-105 ${
                                            isSelected
                                                ? "border-brand-500 ring-2 ring-brand-500/30"
                                                : "border-transparent hover:border-amber-400 dark:hover:border-amber-600"
                                        }`}
                                    >
                                        <div className="absolute inset-0" style={styles} />
                                        {isSelected && (
                                            <div className="absolute top-2 right-2 w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center shadow-lg">
                                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        )}
                                        <span className="absolute bottom-2 left-2 right-2 text-center text-xs font-bold px-1 py-1 rounded-lg backdrop-blur-md bg-white/70 dark:bg-black/50 text-neutral-900 dark:text-white truncate">
                                            {bg.name}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Background Editor Panel */}
                        {activeLegacyBg && bgControls && (
                            <div className="mt-6 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-200 dark:border-neutral-700">
                                <div className="flex items-center gap-2 mb-4">
                                    <Sliders size={18} className="text-amber-600" />
                                    <h4 className="font-bold text-neutral-800 dark:text-white">
                                        Editar: {activeLegacyBg.name}
                                    </h4>
                                </div>

                                <div className="space-y-4">
                                    {/* Opacity Slider */}
                                    {bgControls.opacity && (
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
                                                Opacidad
                                            </label>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="range"
                                                    min={0}
                                                    max={100}
                                                    value={bgProps.opacity ?? bgControls.opacity.default ?? 100}
                                                    onChange={(e) => handleBackgroundPropChange("opacity", parseInt(e.target.value))}
                                                    className="flex-1 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
                                                />
                                                <span className="text-sm text-neutral-500 w-12 text-right">
                                                    {bgProps.opacity ?? bgControls.opacity.default ?? 100}%
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Scale Slider */}
                                    {bgControls.scale && (
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
                                                Escala
                                            </label>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="range"
                                                    min={bgControls.scale.min}
                                                    max={bgControls.scale.max}
                                                    value={bgProps.scale ?? bgControls.scale.default}
                                                    onChange={(e) => handleBackgroundPropChange("scale", parseInt(e.target.value))}
                                                    className="flex-1 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
                                                />
                                                <span className="text-sm text-neutral-500 w-16 text-right">
                                                    {bgProps.scale ?? bgControls.scale.default} px
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Rotation Slider */}
                                    {bgControls.rotationBg && (
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
                                                Rotacion
                                            </label>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="range"
                                                    min={bgControls.rotationBg.min}
                                                    max={bgControls.rotationBg.max}
                                                    value={bgProps.rotationBg ?? bgControls.rotationBg.default}
                                                    onChange={(e) => handleBackgroundPropChange("rotationBg", parseInt(e.target.value))}
                                                    className="flex-1 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
                                                />
                                                <span className="text-sm text-neutral-500 w-12 text-right">
                                                    {bgProps.rotationBg ?? bgControls.rotationBg.default}°
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Background Color */}
                                    {!bgControls.hideBgColor && (
                                        <ColorPicker
                                            value={user.customDesign.backgroundColor}
                                            onChange={(color) => handleCustomChange("backgroundColor", color)}
                                            label="Color de Fondo"
                                        />
                                    )}

                                    {/* Dynamic Color Pickers */}
                                    {bgControls.colors?.map((colorName, idx) => (
                                        <ColorPicker
                                            key={colorName}
                                            value={String(bgProps[colorName] ?? "#000000")}
                                            onChange={(color) => handleBackgroundPropChange(colorName, color)}
                                            label={`Color ${idx + 1}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </section>

            {/* 5. Appearance - Granular Customization */}
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
                                Personaliza colores, formas y tipografia. Cambiar estas opciones creara un tema personalizado.
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
                                onChange={(color) => handleCustomChange("backgroundColor", color)}
                                label="Fondo"
                                size="md"
                                showHex
                            />
                            <ColorPicker
                                value={user.customDesign.textColor || "#ffffff"}
                                onChange={(color) => handleCustomChange("textColor", color)}
                                label="Texto"
                                size="md"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <p className="text-xs text-neutral-400 dark:text-neutral-500">
                                El color de texto se aplica a titulos, subtitulos y encabezados. Si no lo configuras, se calculara automaticamente segun el contraste del fondo.
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
                                    onClick={() => handleCustomChange("buttonStyle", style.id)}
                                    className={`
                                        h-12 rounded-xl text-sm font-bold transition-all
                                        ${style.previewClass}
                                        ${user.customDesign.buttonStyle === style.id
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
                                    onClick={() => handleCustomChange("buttonShape", shape.id)}
                                    className={`
                                        w-12 h-10 flex items-center justify-center transition-all shadow-sm
                                        ${shape.class}
                                        ${user.customDesign.buttonShape === shape.id
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

                    {/* Button Colors */}
                    <div className="grid md:grid-cols-[200px_1fr] gap-6 items-start">
                        <label className="font-semibold text-neutral-800 dark:text-neutral-200 pt-2">
                            Colores de Boton
                        </label>
                        <div className="flex gap-8">
                            <ColorPicker
                                value={user.customDesign.buttonColor}
                                onChange={(color) => handleCustomChange("buttonColor", color)}
                                label="Fondo / Borde"
                                size="md"
                            />
                            <ColorPicker
                                value={user.customDesign.buttonTextColor}
                                onChange={(color) => handleCustomChange("buttonTextColor", color)}
                                label="Texto / Icono"
                                size="md"
                            />
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
                                checked={user.customDesign.showButtonIcons !== false}
                                onChange={(checked) => handleCustomChange("showButtonIcons", checked)}
                                label="Mostrar iconos"
                                size="md"
                            />
                            
                            {/* Icon Alignment - Only show if icons are enabled */}
                            {user.customDesign.showButtonIcons !== false && (
                                <div className="flex gap-2 bg-neutral-100 dark:bg-neutral-800 p-1.5 rounded-xl w-fit">
                                    {ICON_ALIGNMENTS.map((align) => (
                                        <button
                                            key={align.id}
                                            onClick={() => handleCustomChange("buttonIconAlignment", align.id)}
                                            className={`
                                                px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all
                                                ${(user.customDesign.buttonIconAlignment || "left") === align.id
                                                    ? "bg-white dark:bg-neutral-700 shadow-sm text-neutral-900 dark:text-white"
                                                    : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                                                }
                                            `}
                                            title={align.label}
                                        >
                                            {align.icon}
                                            <span className="hidden sm:inline">{align.label}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
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
                                    onClick={() => handleCustomChange("fontPair", font.id)}
                                    className={`
                                        p-4 rounded-xl border text-left transition-all
                                        ${user.customDesign.fontPair === font.id
                                            ? "border-brand-500 bg-brand-50/20 dark:bg-brand-900/20"
                                            : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
                                        }
                                    `}
                                >
                                    <span className={`block text-lg font-bold text-neutral-900 dark:text-white ${font.fontClass}`}>
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
