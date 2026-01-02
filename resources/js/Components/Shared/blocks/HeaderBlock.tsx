/**
 * HeaderBlock - Section header/divider block
 *
 * Renders a text header to organize the landing page into sections.
 * Supports 3 sizes: small, medium (default), large.
 */

import { LinkBlock, LandingProfile } from "@/types/index";
import { calculateContrastColors, isLightColor } from "@/utils/colorUtils";
import React, { useMemo } from "react";

interface HeaderBlockProps {
    link: LinkBlock;
    design: LandingProfile["customDesign"];
    theme: string;
    isPreview?: boolean;
    animationDelay?: number;
}

// List of actual Tailwind preset themes
const PRESET_THEMES = [
    "midnight",
    "ocean",
    "forest",
    "candy",
    "sunset",
    "white",
];

export const HeaderBlock: React.FC<HeaderBlockProps> = ({
    link,
    design,
    theme,
    animationDelay = 0,
}) => {
    const isThemePreset = PRESET_THEMES.includes(theme);
    const isDarkTheme = theme === "midnight";

    // Calculate text color based on background
    const textColor = useMemo(() => {
        if (isThemePreset) {
            return isDarkTheme ? "#ffffff" : "#1a1a1a";
        }

        // Use explicitly set textColor if available
        if (design.textColor) {
            return design.textColor;
        }

        // Auto-calculate based on background
        const bgImage =
            typeof design.backgroundImage === "string"
                ? design.backgroundImage
                : typeof design.backgroundImage === "object" &&
                  design.backgroundImage?.image
                ? design.backgroundImage.image
                : undefined;

        return calculateContrastColors(
            design.backgroundColor || "#ffffff",
            bgImage
        ).text;
    }, [
        isThemePreset,
        isDarkTheme,
        design.textColor,
        design.backgroundColor,
        design.backgroundImage,
    ]);

    // Size classes based on headerSize
    const getSizeClass = () => {
        switch (link.headerSize) {
            case "large":
                return "text-3xl font-black mt-6 mb-2";
            case "small":
                return "text-lg font-bold mt-2 mb-1 opacity-80";
            case "medium":
            default:
                return "text-xl font-bold mt-4 mb-2";
        }
    };

    return (
        <div
            className={`text-center ${getSizeClass()} animate-in slide-in-from-bottom-2 fade-in fill-mode-backwards`}
            style={{
                color: textColor,
                animationDelay: `${animationDelay}ms`,
            }}
        >
            {link.title}
        </div>
    );
};

export default HeaderBlock;

