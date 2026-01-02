/**
 * VimeoBlock - Vimeo video block
 *
 * Modes:
 * - Button only: Link to Vimeo video
 * - Button + Preview: Header button with embedded player
 */

import { renderBlockIcon } from "@/hooks/useBlockIcon";
import { createBlockDesign, getBlockSubtitle } from "@/hooks/useBlockStyles";
import { LinkBlock, MediaDisplayMode, LandingProfile } from "@/types/index";
import { Play, Video } from "lucide-react";
import React from "react";
import { BlockButton, BlockContainer, BlockPreview } from "./partial";

interface VimeoBlockProps {
    link: LinkBlock;
    design: LandingProfile["customDesign"];
    buttonClassName: string; // Legacy prop - not used
    buttonStyle: React.CSSProperties; // Legacy prop - not used
    isPreview?: boolean;
    onClick?: (e: React.MouseEvent) => void;
    animationDelay?: number;
}

/**
 * Extract Vimeo video ID from URL
 */
const extractVimeoId = (url: string): string | null => {
    if (!url) return null;
    const patterns = [
        /vimeo\.com\/(\d+)/,
        /vimeo\.com\/channels\/[^/]+\/(\d+)/,
        /player\.vimeo\.com\/video\/(\d+)/,
    ];
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
};

/**
 * Get the current display mode, handling legacy showInlinePlayer
 */
const getDisplayMode = (link: LinkBlock): MediaDisplayMode => {
    if (link.mediaDisplayMode) return link.mediaDisplayMode;
    return link.showInlinePlayer ? "both" : "button";
};

export const VimeoBlock: React.FC<VimeoBlockProps> = ({
    link,
    design,
    isPreview = false,
    onClick,
    animationDelay = 0,
}) => {
    const videoId = extractVimeoId(link.url);
    const embedUrl = videoId
        ? `https://player.vimeo.com/video/${videoId}?dnt=1`
        : null;

    // Use centralized helper for consistent BlockDesign mapping
    const blockDesign = createBlockDesign(design);

    // Get subtitle based on showLinkSubtext setting
    const subtitle = getBlockSubtitle(blockDesign, "Vimeo", link.url);

    // Render icon: user custom icon takes priority, else fallback
    const getIcon = (withPlayer = false) =>
        renderBlockIcon({
            linkIcon: link.icon,
            fallbackIcon: withPlayer ? (
                <Video size={22} style={{ color: design.buttonTextColor }} />
            ) : (
                <Play size={22} style={{ color: design.buttonTextColor }} />
            ),
            size: 22,
            color: design.buttonTextColor,
        });

    const displayMode = getDisplayMode(link);
    const showPreview =
        (displayMode === "preview" || displayMode === "both") && embedUrl;

    // Button only mode
    if (displayMode === "button" || !showPreview) {
        return (
            <BlockButton
                href={link.url}
                title={link.title}
                subtitle={subtitle}
                design={blockDesign}
                position="full"
                icon={getIcon(false)}
                isPreview={isPreview}
                onClick={onClick}
                animationDelay={animationDelay}
                className="mb-4"
            />
        );
    }

    // Preview only mode
    if (displayMode === "preview") {
        return (
            <BlockContainer animationDelay={animationDelay}>
                <BlockPreview
                    design={blockDesign}
                    hasButton={false}
                    aspectRatio="16/9"
                    backgroundColor="black"
                >
                    <iframe
                        src={embedUrl}
                        title={link.title || "Vimeo Video"}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                    />
                </BlockPreview>
            </BlockContainer>
        );
    }

    // Both mode (button + preview)
    return (
        <BlockContainer animationDelay={animationDelay}>
            {/* Header button */}
            {link.title && (
                <BlockButton
                    href={link.url}
                    title={link.title}
                    subtitle={subtitle}
                    design={blockDesign}
                    position="top"
                    icon={getIcon(true)}
                    isPreview={isPreview}
                    onClick={onClick}
                />
            )}

            {/* Video embed */}
            <BlockPreview
                design={blockDesign}
                hasButton={!!link.title}
                aspectRatio="16/9"
                backgroundColor="black"
            >
                <iframe
                    src={embedUrl}
                    title={link.title || "Vimeo Video"}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                />
            </BlockPreview>
        </BlockContainer>
    );
};

export default VimeoBlock;
