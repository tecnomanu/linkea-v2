/**
 * BlockContainer - Wrapper for button+preview block combinations
 *
 * Provides:
 * - Consistent layout for blocks with header button + embed preview
 * - Entry animation
 * - Proper margin handling
 *
 * Note: Does NOT use overflow-hidden to allow brutalist shadows to render
 */

import React from "react";

interface BlockContainerProps {
    /** Animation delay in ms */
    animationDelay?: number;
    /** Children content (usually BlockButton + BlockPreview) */
    children: React.ReactNode;
    /** Additional className */
    className?: string;
}

export const BlockContainer: React.FC<BlockContainerProps> = ({
    animationDelay = 0,
    children,
    className = "",
}) => {
    return (
        <div
            className={`w-full mb-4 flex flex-col gap-2 animate-in slide-in-from-bottom-2 fade-in fill-mode-backwards ${className}`}
            style={{ animationDelay: `${animationDelay}ms` }}
        >
            {children}
        </div>
    );
};

export default BlockContainer;
