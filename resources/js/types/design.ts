/**
 * Design-related types for landing page styling.
 *
 * Includes background, button, typography, and avatar configuration types.
 */

// =============================================================================
// Button Styling
// =============================================================================

export type ButtonStyle = "solid" | "outline" | "soft" | "hard";
export type ButtonShape = "sharp" | "rounded" | "pill";
export type ButtonSize = "compact" | "normal";
export type ButtonIconAlignment = "left" | "inline" | "right";

// =============================================================================
// Typography
// =============================================================================

export type FontPair = "modern" | "elegant" | "mono";

// =============================================================================
// Background Styling
// =============================================================================

export type BackgroundAttachment = "fixed" | "scroll";
export type BackgroundSize = "cover" | "contain" | "auto" | string;
export type BackgroundPosition =
    | "center"
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top left"
    | "top right"
    | "bottom left"
    | "bottom right"
    | string;
export type BackgroundRepeat = "no-repeat" | "repeat" | "repeat-x" | "repeat-y";

/**
 * Legacy background editor controls (kept for migration but hidden in UI)
 */
export interface BackgroundControls {
    hideBgColor?: boolean;
    colors?: string[];
    scale?: {
        min: number;
        max: number;
        default: number;
        aspectRatio?: boolean;
    };
    opacity?: { default: number };
    rotationBg?: { min: number; max: number; default: number };
}

// =============================================================================
// Custom Design Configuration
// =============================================================================

/**
 * Complete custom design configuration for a landing page.
 * Used by LandingProfile.customDesign and SavedCustomTheme.
 */
export interface CustomDesignConfig {
    // Background
    backgroundColor: string;
    backgroundImage?: string | { image?: string };
    backgroundEnabled?: boolean;
    backgroundAttachment?: BackgroundAttachment;
    backgroundSize?: BackgroundSize;
    backgroundPosition?: BackgroundPosition;
    backgroundRepeat?: BackgroundRepeat;
    backgroundProps?: Record<string, string | number>;
    backgroundControls?: BackgroundControls;

    // Buttons
    buttonStyle: ButtonStyle;
    buttonShape: ButtonShape;
    buttonSize?: ButtonSize;
    buttonColor: string;
    buttonTextColor: string;
    buttonBorderColor?: string;
    buttonBorderEnabled?: boolean;
    showButtonIcons?: boolean;
    buttonIconAlignment?: ButtonIconAlignment;
    showLinkSubtext?: boolean;

    // Typography & Theme
    fontPair: FontPair;
    textColor?: string;

    // Avatar
    roundedAvatar?: boolean;
    avatarFloating?: boolean;
}

/**
 * Saved custom theme slot (max 2 allowed per user)
 */
export interface SavedCustomTheme {
    id: string;
    name: string;
    customDesign: CustomDesignConfig;
    createdAt: string;
}

