/**
 * BlockPreview - Reusable container for embed/preview content
 *
 * Handles:
 * - Proper rounding based on button shape (bottom if has header, full if standalone)
 * - Border styles matching button style (including brutalist)
 * - Aspect ratio for video embeds
 * - NO overflow-hidden to allow brutalist shadows to show
 */

import { getPreviewStyles, BlockDesign } from "@/hooks/useBlockStyles";
import React from "react";

interface BlockPreviewProps {
    /** Design configuration */
    design: BlockDesign;
    /** Whether there's a button header above this preview */
    hasButton?: boolean;
    /** Aspect ratio (e.g., "16/9" for video) */
    aspectRatio?: string;
    /** Background color */
    backgroundColor?: string;
    /** Whether this is part of a dark theme */
    isDarkTheme?: boolean;
    /** Children content (usually an iframe or embed) */
    children: React.ReactNode;
    /** Additional className */
    className?: string;
}

export const BlockPreview: React.FC<BlockPreviewProps> = ({
    design,
    hasButton = false,
    aspectRatio,
    backgroundColor = "black",
    isDarkTheme = false,
    children,
    className = "",
}) => {
    const previewStyles = getPreviewStyles(design, hasButton, isDarkTheme);

    return (
        <div
            className={`${previewStyles.className} ${className}`}
            style={{
                ...previewStyles.style,
                backgroundColor,
                ...(aspectRatio && { aspectRatio }),
            }}
        >
            {children}
        </div>
    );
};

export default BlockPreview;

