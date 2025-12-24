/**
 * Color Utilities
 *
 * Functions for calculating color contrast and determining
 * appropriate text colors based on background.
 */

/**
 * Convert hex color to RGB
 */
export function hexToRgb(
    hex: string
): { r: number; g: number; b: number } | null {
    // Remove # if present
    const cleanHex = hex.replace(/^#/, "");

    // Handle shorthand (e.g., #fff)
    const fullHex =
        cleanHex.length === 3
            ? cleanHex
                  .split("")
                  .map((c) => c + c)
                  .join("")
            : cleanHex;

    const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
    return result
        ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
          }
        : null;
}

/**
 * Calculate relative luminance of a color
 * Based on WCAG 2.0 formula
 * https://www.w3.org/TR/WCAG20/#relativeluminancedef
 */
export function getLuminance(r: number, g: number, b: number): number {
    const [rs, gs, bs] = [r, g, b].map((c) => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Determine if a color is "light" or "dark"
 * Returns true if the color is light (should use dark text)
 */
export function isLightColor(color: string): boolean {
    const rgb = hexToRgb(color);
    if (!rgb) return true; // Default to light if can't parse

    const luminance = getLuminance(rgb.r, rgb.g, rgb.b);
    return luminance > 0.179; // Threshold based on WCAG contrast requirements
}

/**
 * Get contrasting text color for a given background
 * Returns white or dark gray based on background luminance
 */
export function getContrastTextColor(backgroundColor: string): string {
    return isLightColor(backgroundColor) ? "#1a1a1a" : "#ffffff";
}

/**
 * Get contrasting text color with secondary option
 * Returns both primary and muted text colors
 */
export function getContrastColors(backgroundColor: string): {
    text: string;
    textMuted: string;
} {
    const isLight = isLightColor(backgroundColor);
    return {
        text: isLight ? "#1a1a1a" : "#ffffff",
        textMuted: isLight ? "#666666" : "#a3a3a3",
    };
}

/**
 * Try to extract dominant color from a CSS background string
 * Handles: hex colors, rgb(), linear-gradient(), SVG data URIs, etc.
 */
export function extractDominantColor(background: string): string | null {
    if (!background) return null;

    // Direct hex color
    const hexMatch = background.match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
    if (hexMatch) return background;

    // For SVG data URIs, extract fill colors (prioritize non-white/black fills)
    if (background.includes("data:image/svg+xml")) {
        // Decode URL-encoded SVG if needed
        let svgContent = background;
        try {
            if (background.includes("%")) {
                svgContent = decodeURIComponent(background);
            }
        } catch {
            // Keep original if decode fails
        }

        // Find all fill and stop-color values in SVG (including shorthand hex like #305)
        // stop-color is used in gradients, fill is used for shapes
        const fillMatches = svgContent.matchAll(
            /(?:fill|stop-color)=['"]?(#[0-9a-fA-F]{3,6}|rgb[a]?\([^)]+\))['"]?/gi
        );
        const fills: string[] = [];
        for (const match of fillMatches) {
            let color = match[1];
            // Expand shorthand hex (e.g., #305 -> #330055)
            if (color && color.startsWith("#") && color.length === 4) {
                color = `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`;
            }
            // Skip white, near-white, black, and transparent
            if (color && !isNearWhiteOrBlack(color)) {
                fills.push(color);
            }
        }

        // Return first meaningful fill color found
        if (fills.length > 0) {
            const firstFill = fills[0];
            // Convert to hex if needed
            if (firstFill.startsWith("#")) {
                return firstFill;
            }
            const rgbMatch = firstFill.match(
                /rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/
            );
            if (rgbMatch) {
                const r = parseInt(rgbMatch[1], 10);
                const g = parseInt(rgbMatch[2], 10);
                const b = parseInt(rgbMatch[3], 10);
                return `#${r.toString(16).padStart(2, "0")}${g
                    .toString(16)
                    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
            }
        }
    }

    // Hex color anywhere in string (first match)
    const hexInString = background.match(/#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/);
    if (hexInString) return hexInString[0];

    // RGB/RGBA
    const rgbMatch = background.match(
        /rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/
    );
    if (rgbMatch) {
        const r = parseInt(rgbMatch[1], 10);
        const g = parseInt(rgbMatch[2], 10);
        const b = parseInt(rgbMatch[3], 10);
        return `#${r.toString(16).padStart(2, "0")}${g
            .toString(16)
            .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
    }

    return null;
}

/**
 * Check if a color is near white or black (should be skipped for dominant color detection)
 */
function isNearWhiteOrBlack(color: string): boolean {
    const rgb = hexToRgb(color.startsWith("#") ? color : "#ffffff");
    if (!rgb) {
        // Try to parse rgb()
        const rgbMatch = color.match(
            /rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/
        );
        if (rgbMatch) {
            const r = parseInt(rgbMatch[1], 10);
            const g = parseInt(rgbMatch[2], 10);
            const b = parseInt(rgbMatch[3], 10);
            // Near white: all channels > 240
            if (r > 240 && g > 240 && b > 240) return true;
            // Near black: all channels < 15
            if (r < 15 && g < 15 && b < 15) return true;
        }
        return false;
    }
    // Near white: all channels > 240
    if (rgb.r > 240 && rgb.g > 240 && rgb.b > 240) return true;
    // Near black: all channels < 15
    if (rgb.r < 15 && rgb.g < 15 && rgb.b < 15) return true;
    return false;
}

/**
 * Calculate text color based on background color/image
 * Used for auto-detecting appropriate text color
 */
export function calculateTextColor(
    backgroundColor: string,
    backgroundImage?: string
): string {
    // If there's a complex background image, we can try to extract a color from it
    // For gradients, extract the first color
    if (backgroundImage) {
        const extractedColor = extractDominantColor(backgroundImage);
        if (extractedColor) {
            return getContrastTextColor(extractedColor);
        }
    }

    // Fall back to background color
    if (backgroundColor) {
        return getContrastTextColor(backgroundColor);
    }

    // Default to dark text (assumes light background)
    return "#1a1a1a";
}

/**
 * Calculate text colors based on background color and/or image
 * Prioritizes backgroundImage color extraction for SVG patterns
 * Returns both primary and muted text colors
 */
export function calculateContrastColors(
    backgroundColor: string,
    backgroundImage?: string
): { text: string; textMuted: string } {
    // If there's a complex background image (SVG, gradient), extract color from it first
    if (backgroundImage) {
        const extractedColor = extractDominantColor(backgroundImage);
        if (extractedColor) {
            return getContrastColors(extractedColor);
        }
    }

    // Fall back to background color
    if (backgroundColor) {
        return getContrastColors(backgroundColor);
    }

    // Default to dark text (assumes light background)
    return {
        text: "#1a1a1a",
        textMuted: "#666666",
    };
}
