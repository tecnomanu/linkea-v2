/**
 * Design options constants for DesignTab components.
 * Button styles, shapes, sizes, fonts, and background options.
 */

import { ButtonShape, ButtonSize, ButtonStyle, FontPair } from "@/types/index";
import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";
import React from "react";

// =============================================================================
// Button Style Options
// =============================================================================

export interface ButtonStyleOption {
    id: ButtonStyle;
    label: string;
    previewClass: string;
}

export const BUTTON_STYLES: ButtonStyleOption[] = [
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

// =============================================================================
// Button Shape Options
// =============================================================================

export interface ButtonShapeOption {
    id: ButtonShape;
    label: string;
    class: string;
}

export const BUTTON_SHAPES: ButtonShapeOption[] = [
    { id: "sharp", label: "Recto", class: "rounded-none" },
    { id: "rounded", label: "Redondeado", class: "rounded-xl" },
    { id: "pill", label: "Pastilla", class: "rounded-full" },
];

// =============================================================================
// Button Size Options
// =============================================================================

export interface ButtonSizeOption {
    id: ButtonSize;
    label: string;
}

export const BUTTON_SIZES: ButtonSizeOption[] = [
    { id: "compact", label: "Compacto" },
    { id: "normal", label: "Grande" },
];

// =============================================================================
// Typography Options
// =============================================================================

export interface FontOption {
    id: FontPair;
    label: string;
    fontClass: string;
}

export const FONTS: FontOption[] = [
    { id: "modern", label: "Sans Moderna", fontClass: "font-sans" },
    { id: "elegant", label: "Serif Elegante", fontClass: "font-serif" },
    { id: "mono", label: "Mono Tecnica", fontClass: "font-mono" },
];

// =============================================================================
// Icon Alignment Options
// =============================================================================

export interface IconAlignmentOption {
    id: "left" | "inline" | "right";
    label: string;
    icon: React.ReactNode;
}

export const ICON_ALIGNMENTS: IconAlignmentOption[] = [
    {
        id: "left",
        label: "Izquierda",
        icon: React.createElement(AlignLeft, { size: 16 }),
    },
    {
        id: "inline",
        label: "En linea",
        icon: React.createElement(AlignCenter, { size: 16 }),
    },
    {
        id: "right",
        label: "Derecha",
        icon: React.createElement(AlignRight, { size: 16 }),
    },
];

// =============================================================================
// Background Options
// =============================================================================

export interface BackgroundOption {
    value: string;
    label: string;
}

export const BG_SIZE_OPTIONS: BackgroundOption[] = [
    { value: "cover", label: "Cubrir" },
    { value: "contain", label: "Contener" },
    { value: "auto", label: "Auto" },
];

export const BG_REPEAT_OPTIONS: BackgroundOption[] = [
    { value: "no-repeat", label: "No repetir" },
    { value: "repeat", label: "Repetir" },
    { value: "repeat-x", label: "Horizontal" },
    { value: "repeat-y", label: "Vertical" },
];

export const BG_ATTACHMENT_OPTIONS: BackgroundOption[] = [
    { value: "scroll", label: "Scroll" },
    { value: "fixed", label: "Fijo" },
];

// =============================================================================
// Saved Themes Config
// =============================================================================

export const MAX_SAVED_THEMES = 2;
