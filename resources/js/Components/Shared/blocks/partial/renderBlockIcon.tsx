/**
 * renderBlockIcon - Helper to render the correct icon for a block
 *
 * Priority:
 * 1. User-assigned legacy icon (link.icon with SVG data)
 * 2. User-assigned Lucide icon (link.icon with type: "lucide")
 * 3. Fallback icon (passed by the block type)
 */

import { getLucideIcon } from "@/config/blockConfig";
import {
    isLegacyIcon,
    isLucideIcon,
    renderLegacyIcon,
} from "@/utils/iconHelper";
import React from "react";

interface RenderBlockIconOptions {
    /** The link's icon property (can be legacy SVG or Lucide reference) */
    linkIcon?: unknown;
    /** Fallback icon element if no custom icon is set */
    fallbackIcon: React.ReactNode;
    /** Icon size in pixels */
    size?: number;
    /** Icon color */
    color: string;
}

/**
 * Renders the appropriate icon based on link configuration
 * @returns React element with the icon
 */
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
        const iconObj = linkIcon as { type: string; name: string };
        const LucideIcon = getLucideIcon(iconObj.name);
        return (
            <span style={{ color }}>
                <LucideIcon size={size} />
            </span>
        );
    }

    // Priority 3: Fallback icon (block type default)
    return fallbackIcon;
};
