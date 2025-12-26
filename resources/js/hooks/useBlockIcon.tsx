/**
 * useBlockIcon - Consolidated icon utilities for blocks
 *
 * This file centralizes all icon-related functions to avoid duplication.
 * Handles both Lucide icons and legacy SVG icons from assets.
 */

import { IconType } from "@/constants/icons";
import { BlockType } from "@/types";
import {
    AtSign,
    Calendar,
    Clapperboard,
    Ghost,
    Globe,
    Headphones,
    Link,
    LucideIcon,
    Mail,
    MapPin,
    MessageCircle,
    Music,
    Tv,
    Type,
    Video,
    Youtube,
} from "lucide-react";
import React from "react";

// ============================================================================
// Types
// ============================================================================

export interface IconObject {
    type: string;
    name: string;
}

export interface LegacyIcon {
    type?: string;
    name?: string;
}

// ============================================================================
// Lucide Icon Registry
// ============================================================================

/**
 * Map of Lucide icon names to their components
 * Used for dynamic icon rendering based on saved icon name
 */
export const LUCIDE_ICONS: Record<string, LucideIcon> = {
    link: Link,
    type: Type,
    "message-circle": MessageCircle,
    youtube: Youtube,
    video: Video,
    music: Music,
    ghost: Ghost,
    calendar: Calendar,
    mail: Mail,
    "at-sign": AtSign,
    "map-pin": MapPin,
    clapperboard: Clapperboard,
    headphones: Headphones,
    tv: Tv,
    globe: Globe,
};

/**
 * Get a Lucide icon component by name
 * Returns Globe as fallback if not found
 */
export function getLucideIcon(name: string): LucideIcon {
    return LUCIDE_ICONS[name] || Globe;
}

// ============================================================================
// Icon Type Detection
// ============================================================================

/**
 * Checks if an icon is a valid legacy icon object (SVG file from assets)
 * Excludes Lucide icons which are stored as { type: "lucide", name: "xxx" }
 */
export const isLegacyIcon = (icon: unknown): icon is LegacyIcon => {
    return (
        icon !== null &&
        icon !== undefined &&
        typeof icon === "object" &&
        "type" in icon &&
        "name" in icon &&
        typeof (icon as LegacyIcon).type === "string" &&
        typeof (icon as LegacyIcon).name === "string" &&
        (icon as LegacyIcon).type !== "lucide"
    );
};

/**
 * Checks if an icon is a Lucide icon reference
 */
export const isLucideIcon = (icon: unknown): icon is IconObject => {
    return (
        icon !== null &&
        icon !== undefined &&
        typeof icon === "object" &&
        "type" in icon &&
        "name" in icon &&
        (icon as IconObject).type === "lucide" &&
        typeof (icon as IconObject).name === "string"
    );
};

// ============================================================================
// Color Utilities
// ============================================================================

/**
 * Converts a hex color to CSS filter that will colorize a black SVG to that color.
 */
const hexToFilter = (hex: string): string => {
    if (!hex) return "";

    hex = hex.replace("#", "");

    let r, g, b;
    if (hex.length === 3) {
        r = parseInt(hex[0] + hex[0], 16);
        g = parseInt(hex[1] + hex[1], 16);
        b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length === 6) {
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
    } else {
        return "";
    }

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    if (luminance > 0.9) return "brightness(0) invert(1)";
    if (luminance < 0.1) return "";

    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;
    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    const l = (max + min) / 2;

    let h = 0;
    let s = 0;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case rNorm:
                h = ((gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0)) / 6;
                break;
            case gNorm:
                h = ((bNorm - rNorm) / d + 2) / 6;
                break;
            case bNorm:
                h = ((rNorm - gNorm) / d + 4) / 6;
                break;
        }
    }

    const hDeg = Math.round(h * 360);
    const sPct = Math.round(s * 100);
    const lPct = Math.round(l * 100);
    const hueRotate = hDeg - 50;
    const saturate = sPct * 10;
    const brightness = lPct * 2;

    return `brightness(0) saturate(100%) invert(${lPct}%) sepia(${Math.min(100, sPct + 50)}%) saturate(${Math.max(100, saturate)}%) hue-rotate(${hueRotate}deg) brightness(${Math.max(80, brightness)}%)`;
};

// ============================================================================
// Icon Rendering Functions
// ============================================================================

/**
 * Renders a legacy SVG icon from assets
 */
export const renderLegacyIcon = (
    icon: LegacyIcon | string | null | undefined,
    size = 20,
    className = "",
    textColor?: string
): React.ReactNode => {
    if (!icon) {
        return <Globe size={size} className={className} />;
    }

    if (typeof icon === "string") {
        return <Globe size={size} className={className} />;
    }

    if (icon.type && icon.name) {
        const isColorIcon = icon.type === "colors";
        let filterStyle: React.CSSProperties = {};

        if (!isColorIcon && textColor) {
            const filter = hexToFilter(textColor);
            if (filter) {
                filterStyle = { filter };
            }
        }

        return (
            <img
                src={`/assets/images/icons/${icon.type}/${icon.name}.svg`}
                alt={icon.name}
                className={className}
                style={{ width: size, height: size, ...filterStyle }}
                onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                }}
            />
        );
    }

    return <Globe size={size} className={className} />;
};

/**
 * Gets the icon path for a legacy icon
 */
export const getLegacyIconPath = (icon: LegacyIcon): string => {
    return `/assets/images/icons/${icon.type}/${icon.name}.svg`;
};

/**
 * Render icon for a link based on its icon property
 * Priority: user-assigned icon > fallback
 */
export interface RenderBlockIconOptions {
    linkIcon?: unknown;
    fallbackIcon: React.ReactNode;
    size?: number;
    color: string;
}

export const renderBlockIcon = ({
    linkIcon,
    fallbackIcon,
    size = 22,
    color,
}: RenderBlockIconOptions): React.ReactNode => {
    // Priority 1: Legacy SVG icon (user assigned from icon picker)
    if (isLegacyIcon(linkIcon)) {
        return (
            <span style={{ color }}>
                {renderLegacyIcon(linkIcon, size, "", color)}
            </span>
        );
    }

    // Priority 2: Lucide icon (user assigned from icon picker)
    if (isLucideIcon(linkIcon)) {
        const LucideIconComponent = getLucideIcon(linkIcon.name);
        return (
            <span style={{ color }}>
                <LucideIconComponent size={size} />
            </span>
        );
    }

    // Priority 3: Fallback icon (block type default)
    return fallbackIcon;
};

/**
 * Render the default icon for a block type
 * Used in BlockSelector, LinkCard, and web features
 */
export interface RenderBlockTypeIconOptions {
    iconCategory: IconType | "lucide";
    iconName: string;
    icon: LucideIcon;
    label: string;
}

export function renderBlockTypeIcon(
    config: RenderBlockTypeIconOptions,
    size = 24,
    className = "",
    forceWhite = true
): React.ReactNode {
    // For Lucide icons, use the component directly
    if (config.iconCategory === "lucide") {
        return React.createElement(config.icon, { size, className });
    }

    // For SVG icons, render as img with appropriate filter
    const iconPath = `/assets/images/icons/${config.iconCategory}/${config.iconName}.svg`;
    const isColorIcon = config.iconCategory === "colors";
    const filterClass = forceWhite && !isColorIcon ? "brightness-0 invert" : "";
    const fullClassName = className
        ? `${className} ${filterClass}`
        : filterClass;

    return React.createElement("img", {
        src: iconPath,
        alt: config.label,
        className: fullClassName,
        style: { width: size, height: size },
    });
}

/**
 * Get the icon path for a block type (SVG icons only)
 * Returns null for Lucide icons
 */
export function getBlockIconPath(
    iconCategory: IconType | "lucide",
    iconName: string
): string | null {
    if (iconCategory === "lucide") {
        return null;
    }
    return `/assets/images/icons/${iconCategory}/${iconName}.svg`;
}

// ============================================================================
// Hook (for React components that need reactive icon utilities)
// ============================================================================

export const useBlockIcon = () => {
    return {
        getLucideIcon,
        isLegacyIcon,
        isLucideIcon,
        renderLegacyIcon,
        renderBlockIcon,
        renderBlockTypeIcon,
        getBlockIconPath,
        getLegacyIconPath,
    };
};

export default useBlockIcon;

