/**
 * DesignTab - Main design configuration orchestrator.
 *
 * Composed of:
 * - HeaderSection: Avatar, title, subtitle
 * - ThemesSection: Theme presets and saved themes
 * - BackgroundSection: Background image configuration
 * - AppearanceSection: Colors, buttons, typography
 *
 * ARCHITECTURE:
 * ============
 * Two update functions with distinct responsibilities:
 *
 * 1. onUpdateLanding (from Dashboard)
 *    - Updates top-level LandingProfile fields (name, title, subtitle, avatar, etc.)
 *    - Direct state update → triggers auto-save → reflects in PhonePreview
 *
 * 2. handleCustomDesignChange (local)
 *    - Updates nested customDesign fields (colors, buttons, typography, etc.)
 *    - Adds extra logic for theme management:
 *      • Switches to "custom" theme automatically
 *      • Updates lastCustomDesign for theme history
 *      • If editing a saved theme, updates it in savedCustomThemes array
 *    - Eventually calls onUpdateLanding to persist changes
 *
 * Both functions update state immediately → PhonePreview shows changes in real-time
 * Actual saving is handled by AutoSaveContext (debounced auto-save or manual save)
 */

import { CustomDesignConfig, LandingProfile } from "@/types/index";
import React, { useCallback, useMemo } from "react";
import { AppearanceSection } from "./AppearanceSection";
import { BackgroundSection } from "./BackgroundSection";
import { HeaderSection } from "./HeaderSection";
import { ThemesSection } from "./ThemesSection";

interface DesignTabProps {
    /** Landing profile (public landing configuration, NOT authenticated landing) */
    landing: LandingProfile;
    /** Updates top-level LandingProfile fields (title, avatar, etc.) */
    onUpdateLanding: (updates: Partial<LandingProfile>) => void;
}

export const DesignTab: React.FC<DesignTabProps> = ({
    landing,
    onUpdateLanding,
}) => {
    // Check if landing has a custom background image
    const hasBackgroundImage = useMemo(() => {
        const bgImage = landing.customDesign.backgroundImage;
        if (!bgImage || typeof bgImage !== "string") return false;
        return (
            bgImage.includes("http") ||
            bgImage.includes("data:image") ||
            bgImage.startsWith("url(")
        );
    }, [landing.customDesign.backgroundImage]);

    // Check if current theme is a saved custom theme
    const currentSavedTheme = useMemo(() => {
        return landing.savedCustomThemes?.find((t) => t.id === landing.theme);
    }, [landing.savedCustomThemes, landing.theme]);

    /**
     * Updates customDesign fields with theme management logic.
     *
     * Use this for: colors, button styles, typography, background properties
     * (any field inside landing.customDesign)
     *
     * Logic:
     * - If editing a saved theme → updates the theme in savedCustomThemes
     * - Otherwise → switches to "custom" theme and stores in lastCustomDesign
     */
    const handleCustomDesignChange = useCallback(
        (key: keyof CustomDesignConfig, value: any) => {
            const newCustomDesign = { ...landing.customDesign, [key]: value };

            if (currentSavedTheme) {
                // Editing a saved theme: update it in the array
                const updatedSavedThemes = landing.savedCustomThemes?.map((t) =>
                    t.id === currentSavedTheme.id
                        ? { ...t, customDesign: newCustomDesign }
                        : t
                );
                onUpdateLanding({
                    customDesign: newCustomDesign,
                    savedCustomThemes: updatedSavedThemes,
                });
            } else {
                // Not editing a saved theme: switch to "custom" and track history
                onUpdateLanding({
                    theme: "custom",
                    customDesign: newCustomDesign,
                    lastCustomDesign: newCustomDesign,
                });
            }
        },
        [
            landing.customDesign,
            landing.savedCustomThemes,
            currentSavedTheme,
            onUpdateLanding,
        ]
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">
            {/* 1. Header & Profile */}
            <HeaderSection
                landing={landing}
                onUpdateLanding={onUpdateLanding}
                onUpdateCustomDesign={handleCustomDesignChange}
            />

            {/* 2. Themes */}
            <ThemesSection
                landing={landing}
                onUpdateLanding={onUpdateLanding}
                hasBackgroundImage={hasBackgroundImage}
            />

            {/* 3. Background Image */}
            <BackgroundSection
                landing={landing}
                onUpdateLanding={onUpdateLanding}
                onUpdateCustomDesign={handleCustomDesignChange}
                hasBackgroundImage={hasBackgroundImage}
            />

            {/* 4. Appearance */}
            <AppearanceSection
                landing={landing}
                onUpdateCustomDesign={handleCustomDesignChange}
            />
        </div>
    );
};
