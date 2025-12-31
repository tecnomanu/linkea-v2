/**
 * BlockButton - Reusable button component for all block types
 *
 * Can be used as:
 * - Standalone button (full rounding)
 * - Header button for button+preview blocks (top rounding only)
 *
 * Handles all button styles: solid, outline, soft, hard (brutalist)
 */

import {
    BlockDesign,
    getButtonStyles,
    getIconContainerStyles,
} from "@/hooks/useBlockStyles";
import React from "react";

interface BlockButtonProps {
    /** Target URL for the link */
    href: string;
    /** Button title/label */
    title: string;
    /** Optional subtitle (e.g., "Twitch", "Calendario") - can be string or ReactNode */
    subtitle?: React.ReactNode;
    /** Design configuration */
    design: BlockDesign;
    /** Position: "full" for standalone, "top" for button+preview */
    position?: "full" | "top";
    /** Icon element to display */
    icon?: React.ReactNode;
    /** Right side content (e.g., badge) */
    rightContent?: React.ReactNode;
    /** If true, prevents navigation (preview mode) */
    isPreview?: boolean;
    /** Click handler */
    onClick?: (e: React.MouseEvent) => void;
    /** Animation delay in ms */
    animationDelay?: number;
    /** Whether this is part of a dark theme */
    isDarkTheme?: boolean;
    /** Additional className */
    className?: string;
}

export const BlockButton: React.FC<BlockButtonProps> = ({
    href,
    title,
    subtitle,
    design,
    position = "full",
    icon,
    rightContent,
    isPreview = false,
    onClick,
    animationDelay = 0,
    isDarkTheme = false,
    className = "",
}) => {
    const buttonStyles = getButtonStyles(design, position, isDarkTheme);
    const iconStyles = getIconContainerStyles(design);
    const showIcon = design.showButtonIcons !== false && icon;

    const handleClick = (e: React.MouseEvent) => {
        if (isPreview) {
            e.preventDefault();
            return;
        }
        onClick?.(e);
    };

    // Animation classes only for standalone buttons (position === "full")
    const animationClasses =
        position === "full"
            ? "animate-in slide-in-from-bottom-2 fade-in fill-mode-backwards"
            : "";

    const iconAlignment = design.buttonIconAlignment || "left";

    // Render icon element
    const renderIcon = () =>
        showIcon && (
            <div className={iconStyles.className} style={iconStyles.style}>
                {icon}
            </div>
        );

    // Render text content - for inline, text doesn't expand (no flex-1)
    const renderText = () => (
        <div
            className={`min-w-0 ${
                iconAlignment === "inline" ? "text-center" : "flex-1 text-left"
            }`}
        >
            <h3 className="text-base font-bold truncate">{title}</h3>
            {subtitle && (
                <p className="text-xs truncate opacity-70">{subtitle}</p>
            )}
        </div>
    );

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            className={`${buttonStyles.className} ${animationClasses} ${className}`}
            style={{
                ...buttonStyles.style,
                ...(animationDelay > 0 && {
                    animationDelay: `${animationDelay}ms`,
                }),
            }}
        >
            <div
                className={`flex items-center p-3 ${
                    iconAlignment === "inline" ? "justify-center gap-2" : ""
                }`}
            >
                {/* Left: icon first, then text expands */}
                {iconAlignment === "left" && renderIcon()}
                {iconAlignment === "left" && renderText()}

                {/* Inline: icon and text centered together */}
                {iconAlignment === "inline" && renderIcon()}
                {iconAlignment === "inline" && renderText()}

                {/* Right: text expands, then icon */}
                {iconAlignment === "right" && renderText()}
                {iconAlignment === "right" && renderIcon()}

                {/* Right content (badge, indicator, etc.) - only for non-right alignment */}
                {iconAlignment !== "right" && rightContent}
            </div>
        </a>
    );
};

export default BlockButton;
