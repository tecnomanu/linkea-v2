/**
 * THEME PRESETS
 * 
 * Complete theme configurations including background, button styles,
 * colors, and typography. Themes are pre-configured combinations.
 * 
 * When a user selects a theme, ALL these values are applied.
 * After selecting, they can customize via Appearance section,
 * which will switch the theme to 'custom'.
 */

import { ButtonShape, ButtonStyle, FontPair } from "@/types/index";

export interface ThemePreset {
    id: string;
    name: string;
    // Preview styling (Tailwind classes for the selector preview)
    previewBg: string;
    // Actual values applied to customDesign
    backgroundColor: string;
    backgroundImage?: string;
    buttonStyle: ButtonStyle;
    buttonShape: ButtonShape;
    buttonColor: string;
    buttonTextColor: string;
    fontPair: FontPair;
    // Optional: for dark themes
    isDark?: boolean;
}

export const THEME_PRESETS: ThemePreset[] = [
    {
        id: "white",
        name: "Blanco Limpio",
        previewBg: "bg-white border-neutral-200",
        backgroundColor: "#ffffff",
        buttonStyle: "solid",
        buttonShape: "rounded",
        buttonColor: "#171717",
        buttonTextColor: "#ffffff",
        fontPair: "modern",
    },
    {
        id: "sunset",
        name: "Atardecer",
        previewBg: "bg-gradient-to-br from-orange-100 to-rose-200",
        backgroundColor: "#fed7aa",
        backgroundImage: "linear-gradient(to bottom right, #fed7aa, #fecdd3)",
        buttonStyle: "soft",
        buttonShape: "pill",
        buttonColor: "#ea580c",
        buttonTextColor: "#ffffff",
        fontPair: "modern",
    },
    {
        id: "ocean",
        name: "Oceano",
        previewBg: "bg-gradient-to-br from-cyan-100 to-blue-200",
        backgroundColor: "#cffafe",
        backgroundImage: "linear-gradient(to bottom right, #cffafe, #bfdbfe)",
        buttonStyle: "soft",
        buttonShape: "rounded",
        buttonColor: "#0891b2",
        buttonTextColor: "#ffffff",
        fontPair: "modern",
    },
    {
        id: "forest",
        name: "Bosque",
        previewBg: "bg-gradient-to-br from-emerald-100 to-teal-200",
        backgroundColor: "#d1fae5",
        backgroundImage: "linear-gradient(to bottom right, #d1fae5, #99f6e4)",
        buttonStyle: "solid",
        buttonShape: "rounded",
        buttonColor: "#059669",
        buttonTextColor: "#ffffff",
        fontPair: "elegant",
    },
    {
        id: "candy",
        name: "Dulce",
        previewBg: "bg-gradient-to-br from-pink-100 to-purple-200",
        backgroundColor: "#fce7f3",
        backgroundImage: "linear-gradient(to bottom right, #fce7f3, #e9d5ff)",
        buttonStyle: "soft",
        buttonShape: "pill",
        buttonColor: "#db2777",
        buttonTextColor: "#ffffff",
        fontPair: "modern",
    },
    {
        id: "midnight",
        name: "Medianoche",
        previewBg: "bg-neutral-900 border-neutral-700",
        backgroundColor: "#171717",
        buttonStyle: "outline",
        buttonShape: "rounded",
        buttonColor: "#ffffff",
        buttonTextColor: "#ffffff",
        fontPair: "mono",
        isDark: true,
    },
    {
        id: "brutal",
        name: "Brutal",
        previewBg: "bg-yellow-300 border-black",
        backgroundColor: "#fde047",
        buttonStyle: "hard",
        buttonShape: "sharp",
        buttonColor: "#ffffff",
        buttonTextColor: "#000000",
        fontPair: "mono",
    },
    {
        id: "minimal",
        name: "Minimalista",
        previewBg: "bg-neutral-50 border-neutral-200",
        backgroundColor: "#fafafa",
        buttonStyle: "outline",
        buttonShape: "rounded",
        buttonColor: "#171717",
        buttonTextColor: "#171717",
        fontPair: "modern",
    },
];

/**
 * Get a theme preset by ID
 */
export const getThemePreset = (id: string): ThemePreset | undefined => {
    return THEME_PRESETS.find(theme => theme.id === id);
};

/**
 * Check if a given theme ID is a preset (not custom)
 */
export const isPresetTheme = (themeId: string): boolean => {
    return THEME_PRESETS.some(theme => theme.id === themeId);
};

