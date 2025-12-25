import { Globe } from "lucide-react";
import React from "react";

/**
 * Legacy icon data structure from MongoDB migration
 */
export interface LegacyIcon {
    type?: string;
    name?: string;
}

/**
 * Converts a hex color to CSS filter that will colorize a black SVG to that color.
 * This is an approximation technique for coloring SVG images.
 */
const hexToFilter = (hex: string): string => {
    if (!hex) return "";
    
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Parse hex to RGB
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

    // Check if it's white or very light - use simple invert
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    if (luminance > 0.9) {
        return "brightness(0) invert(1)";
    }
    
    // Check if it's black or very dark - no filter needed
    if (luminance < 0.1) {
        return "";
    }

    // For other colors, we need to calculate the filter
    // First make it white with brightness(0) invert(1), then apply color
    // Using sepia + saturate + hue-rotate to achieve the target color
    
    // Convert RGB to HSL
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
    
    // Convert to degrees and percentages
    const hDeg = Math.round(h * 360);
    const sPct = Math.round(s * 100);
    const lPct = Math.round(l * 100);
    
    // Build the filter
    // Start with making it the base sepia color, then adjust
    const hueRotate = hDeg - 50; // Sepia is around 50 degrees
    const saturate = sPct * 10; // Amplify saturation
    const brightness = lPct * 2; // Adjust brightness
    
    return `brightness(0) saturate(100%) invert(${lPct}%) sepia(${Math.min(100, sPct + 50)}%) saturate(${Math.max(100, saturate)}%) hue-rotate(${hueRotate}deg) brightness(${Math.max(80, brightness)}%)`;
};

/**
 * Renders a legacy icon from the SVG assets or falls back to a Lucide Globe icon.
 * Legacy icons are stored in /assets/images/icons/{type}/{name}.svg
 * 
 * @param icon - The icon object from the link data or a string
 * @param size - Size in pixels (default: 20)
 * @param className - Additional CSS classes
 * @param textColor - The button text color to match (e.g. "#ffffff", "#ffeb3b")
 */
export const renderLegacyIcon = (
    icon: LegacyIcon | string | null | undefined,
    size = 20,
    className = "",
    textColor?: string
): React.ReactNode => {
    // No icon provided
    if (!icon) {
        return <Globe size={size} className={className} />;
    }

    // String icon (legacy format or Lucide name)
    if (typeof icon === "string") {
        return <Globe size={size} className={className} />;
    }

    // Object icon with type and name
    if (icon.type && icon.name) {
        // For "colors" type icons, don't apply filters (they have their own colors)
        const isColorIcon = icon.type === "colors";
        
        // Calculate filter based on text color
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
                style={{
                    width: size,
                    height: size,
                    ...filterStyle,
                }}
                onError={(e) => {
                    // Fallback to hiding the broken image
                    (e.target as HTMLImageElement).style.display = "none";
                }}
            />
        );
    }

    // Default fallback
    return <Globe size={size} className={className} />;
};

/**
 * Checks if an icon is a valid legacy icon object (SVG file from assets)
 * Excludes Lucide icons which are stored as { type: "lucide", name: "xxx" }
 */
export const isLegacyIcon = (icon: any): icon is LegacyIcon => {
    return (
        icon &&
        typeof icon === "object" &&
        typeof icon.type === "string" &&
        typeof icon.name === "string" &&
        icon.type !== "lucide" // Exclude Lucide icons
    );
};

/**
 * Checks if an icon is a Lucide icon reference
 */
export const isLucideIcon = (icon: any): boolean => {
    return (
        icon &&
        typeof icon === "object" &&
        icon.type === "lucide" &&
        typeof icon.name === "string"
    );
};

/**
 * Gets the icon path for a legacy icon
 */
export const getLegacyIconPath = (icon: LegacyIcon): string => {
    return `/assets/images/icons/${icon.type}/${icon.name}.svg`;
};
