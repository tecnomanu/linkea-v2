/**
 * BlockButton - Reusable button component for all block types
 *
 * Icon alignment modes:
 * - left/right: icon fixed, text fills remaining space and centers within it
 * - inline: icon and text flow together, both centered
 */

import {
    BlockDesign,
    getButtonStyles,
    getIconContainerStyles,
} from "@/hooks/useBlockStyles";
import React from "react";

interface BlockButtonProps {
    href: string;
    title: string;
    subtitle?: React.ReactNode;
    design: BlockDesign;
    position?: "full" | "top";
    icon?: React.ReactNode;
    rightContent?: React.ReactNode;
    isPreview?: boolean;
    onClick?: (e: React.MouseEvent) => void;
    animationDelay?: number;
    isDarkTheme?: boolean;
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
    const iconAlignment = design.buttonIconAlignment || "left";

    const handleClick = (e: React.MouseEvent) => {
        if (isPreview) {
            e.preventDefault();
            return;
        }
        onClick?.(e);
    };

    const animationClasses =
        position === "full"
            ? "animate-in slide-in-from-bottom-2 fade-in fill-mode-backwards"
            : "";

    const IconBox = () =>
        showIcon ? (
            <div
                className={`${iconStyles.className} shrink-0`}
                style={iconStyles.style}
            >
                {icon}
            </div>
        ) : null;

    const TextBox = ({ centered = true }: { centered?: boolean }) => (
        <div className={`text-center min-w-0 ${centered ? "flex-1" : ""}`}>
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
            <div className="flex items-center gap-2 px-3 py-2">
                {/* Inline: icon and text centered together */}
                {iconAlignment === "inline" && (
                    <div className="flex-1 flex items-center justify-center gap-2 min-w-0">
                        <IconBox />
                        <TextBox centered={false} />
                    </div>
                )}

                {/* Left: icon first, text fills rest and centers */}
                {iconAlignment === "left" && (
                    <>
                        <IconBox />
                        <TextBox />
                        {rightContent}
                    </>
                )}

                {/* Right: text fills and centers, icon last */}
                {iconAlignment === "right" && (
                    <>
                        <TextBox />
                        <IconBox />
                    </>
                )}
            </div>
        </a>
    );
};

export default BlockButton;
