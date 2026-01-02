/**
 * useBlockStyles - Centralized hook for block component styling
 *
 * Provides consistent styling for buttons and preview containers
 * across all block types. Eliminates prop drilling from LandingContent.
 */

import { ButtonShape, ButtonSize, ButtonStyle, UserProfile } from "@/types";

export interface BlockDesign {
    buttonColor: string;
    buttonTextColor: string;
    buttonBorderColor?: string; // Border color (always stored, default: #000000)
    buttonBorderEnabled?: boolean; // Whether border is visible (default: false)
    buttonStyle: ButtonStyle;
    buttonShape: ButtonShape;
    buttonSize?: ButtonSize;
    showButtonIcons?: boolean;
    buttonIconAlignment?: "left" | "right" | "inline";
    showLinkSubtext?: boolean;
}

interface ButtonStyleResult {
    className: string;
    style: React.CSSProperties;
}

// Rounding classes based on shape and position
// "preview" is a softer rounding for embed containers (not as aggressive as button)
const ROUNDING = {
    sharp: {
        full: "rounded-none",
        top: "rounded-none",
        bottom: "rounded-none",
        preview: "rounded-none",
    },
    pill: {
        full: "rounded-full",
        top: "rounded-t-[28px]",
        bottom: "rounded-b-md",
        preview: "rounded-3xl", // Softer than full for embeds
    },
    rounded: {
        full: "rounded-[20px]",
        top: "rounded-t-[20px]",
        bottom: "rounded-b-md",
        preview: "rounded-2xl", // Softer than full for embeds
    },
} as const;

/**
 * Get rounding class based on shape and position
 */
export const getRoundingClass = (
    shape: ButtonShape = "rounded",
    position: "full" | "top" | "bottom" | "preview" = "full"
): string => {
    return ROUNDING[shape]?.[position] || ROUNDING.rounded[position];
};

/**
 * Get button styles based on design settings
 * @param design - Design configuration
 * @param position - "full" for standalone buttons, "top" for button+preview combos
 * @param isDarkTheme - Whether the theme is dark (affects hard style shadows)
 */
export const getButtonStyles = (
    design: BlockDesign,
    position: "full" | "top" = "full",
    isDarkTheme = false
): ButtonStyleResult => {
    const rounding = getRoundingClass(design.buttonShape, position);
    // Button size: compact (legacy default) vs normal (larger)
    const sizeClass = design.buttonSize === "normal" ? "p-1.5" : "p-0.5";
    const base = `block w-full ${sizeClass} transition-all duration-300 hover:scale-[1.01] active:scale-95 group ${rounding}`;

    let className = base;
    let style: React.CSSProperties = {};

    // Check if border is enabled (new system) - respects buttonBorderEnabled flag
    const borderEnabled = design.buttonBorderEnabled === true;
    const borderColor = design.buttonBorderColor || "#000000";

    switch (design.buttonStyle) {
        case "outline":
            className += " border-2";
            if (borderEnabled) {
                // Border enabled: use separate border color + background color
                style = {
                    borderColor: borderColor,
                    backgroundColor: design.buttonColor,
                    color: design.buttonTextColor,
                };
            } else {
                // Standard outline: transparent bg, border = buttonColor
                style = {
                    borderColor: design.buttonColor,
                    color: design.buttonTextColor,
                };
            }
            break;

        case "soft":
            className += " shadow-sm backdrop-blur-md";
            style = {
                backgroundColor: `${design.buttonColor}CC`,
                color: design.buttonTextColor,
            };
            if (borderEnabled) {
                className += " border-2";
                style.borderColor = borderColor;
            }
            break;

        case "hard":
            // Brutalist style - always has border and shadow
            const hardBorderColor = borderEnabled
                ? borderColor
                : isDarkTheme
                ? "white"
                : "black";
            const shadowColor = isDarkTheme
                ? "rgba(255,255,255,1)"
                : "rgba(0,0,0,1)";
            className +=
                " border-2 hover:translate-x-[2px] hover:translate-y-[2px] hover:scale-100";
            style = {
                backgroundColor: design.buttonColor,
                color: design.buttonTextColor,
                borderColor: hardBorderColor,
                boxShadow: `4px 4px 0px 0px ${shadowColor}`,
            };
            break;

        case "solid":
        default:
            className += " shadow-md";
            style = {
                backgroundColor: design.buttonColor,
                color: design.buttonTextColor,
            };
            if (borderEnabled) {
                className += " border-2";
                style.borderColor = borderColor;
            }
            break;
    }

    return { className, style };
};

/**
 * Get preview container styles
 * @param design - Design configuration
 * @param _hasButton - Reserved for future use (button+preview connected mode)
 * @param isDarkTheme - Whether the theme is dark
 */
export const getPreviewStyles = (
    design: BlockDesign,
    _hasButton: boolean,
    isDarkTheme = false
): ButtonStyleResult => {
    // Preview uses softer rounding than buttons (not as aggressive)
    const rounding = getRoundingClass(design.buttonShape, "preview");

    let className = `w-full overflow-hidden ${rounding}`;
    let style: React.CSSProperties = {
        border: `2px solid ${design.buttonColor}20`,
    };

    // For brutalist style, add matching border and shadow
    if (design.buttonStyle === "hard") {
        const borderColor = isDarkTheme ? "white" : "black";
        const shadowColor = isDarkTheme
            ? "rgba(255,255,255,1)"
            : "rgba(0,0,0,1)";
        style = {
            borderColor,
            borderWidth: "2px",
            borderStyle: "solid",
            boxShadow: `4px 4px 0px 0px ${shadowColor}`,
        };
    }

    return { className, style };
};

/**
 * Get the subtitle for a block based on showLinkSubtext setting
 * @param design - Design configuration
 * @param brandName - The brand name (e.g., "Vimeo", "TikTok", "SoundCloud")
 * @param url - The link URL
 */
export const getBlockSubtitle = (
    design: BlockDesign,
    brandName: string,
    url: string
): string => {
    // If showLinkSubtext is enabled, show the URL
    if (design.showLinkSubtext) {
        return url;
    }
    // Otherwise show the brand name
    return brandName;
};

/**
 * Get icon container styles for buttons
 */
export const getIconContainerStyles = (
    design: BlockDesign
): { className: string; style: React.CSSProperties } => {
    const rounding = getRoundingClass(design.buttonShape, "full");
    // Size based on buttonSize: compact (legacy) vs normal
    const sizeClass = design.buttonSize === "normal" ? "w-11 h-11" : "w-9 h-9";
    // For outline without border enabled, use subtle bg; otherwise use white/20
    const borderEnabled = design.buttonBorderEnabled === true;
    const hasBg = design.buttonStyle !== "outline" || borderEnabled;

    return {
        className: `${sizeClass} flex items-center justify-center shrink-0 ${rounding} ${
            hasBg ? "bg-white/20" : ""
        }`,
        style:
            design.buttonStyle === "outline" && !borderEnabled
                ? { backgroundColor: `${design.buttonColor}15` }
                : {},
    };
};

/**
 * Create BlockDesign from UserProfile customDesign
 *
 * All block components should use this helper to ensure they receive
 * the same properties. BlockDesign is a subset of CustomDesignConfig,
 * so we can directly use the design object.
 */
export const createBlockDesign = (
    design: UserProfile["customDesign"]
): BlockDesign => design;

/**
 * Hook that provides all block styling utilities
 */
export const useBlockStyles = (
    design: UserProfile["customDesign"],
    isDarkTheme = false
) => {
    const blockDesign = createBlockDesign(design);

    return {
        design: blockDesign,

        // Get button styles for standalone button
        getButtonFull: () => getButtonStyles(blockDesign, "full", isDarkTheme),

        // Get button styles for button+preview header
        getButtonTop: () => getButtonStyles(blockDesign, "top", isDarkTheme),

        // Get preview container styles
        getPreview: (hasButton: boolean) =>
            getPreviewStyles(blockDesign, hasButton, isDarkTheme),

        // Get icon container styles
        getIconContainer: () => getIconContainerStyles(blockDesign),

        // Utility getters
        getRounding: (
            position: "full" | "top" | "bottom" | "preview" = "full"
        ) => getRoundingClass(blockDesign.buttonShape, position),

        showIcons: blockDesign.showButtonIcons !== false,
    };
};

export default useBlockStyles;
