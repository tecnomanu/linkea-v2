/**
 * YouTubeBlock - YouTube video block
 *
 * Display modes:
 * - button: Link only (opens YouTube)
 * - preview: Embed only (video player)
 * - both: Button + Embed (header button with player below)
 */

import { renderBlockIcon } from "@/hooks/useBlockIcon";
import { createBlockDesign, getBlockSubtitle } from "@/hooks/useBlockStyles";
import { LinkBlock, MediaDisplayMode, UserProfile } from "@/types";
import { Youtube } from "lucide-react";
import React from "react";
import { BlockButton, BlockContainer, BlockPreview } from "./partial";

interface YouTubeBlockProps {
    link: LinkBlock;
    design: UserProfile["customDesign"];
    buttonClassName: string;
    buttonStyle: React.CSSProperties;
    isPreview?: boolean;
    onClick?: (e: React.MouseEvent) => void;
    animationDelay?: number;
}

/**
 * Extract YouTube video ID from URL
 */
const getYoutubeId = (url: string): string | null => {
    if (!url) return null;
    const regExp =
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
};

/**
 * Get the current display mode, handling legacy showInlinePlayer
 */
const getDisplayMode = (link: LinkBlock): MediaDisplayMode => {
    if (link.mediaDisplayMode) return link.mediaDisplayMode;
    // Legacy fallback: showInlinePlayer true = preview only (old behavior)
    return link.showInlinePlayer ? "preview" : "button";
};

export const YouTubeBlock: React.FC<YouTubeBlockProps> = ({
    link,
    design,
    isPreview = false,
    onClick,
    animationDelay = 0,
}) => {
    const videoId = getYoutubeId(link.url);
    const embedUrl = videoId
        ? `https://www.youtube.com/embed/${videoId}?autoplay=${
              link.autoPlay ? 1 : 0
          }&mute=${link.startMuted ? 1 : 0}`
        : null;

    // Use centralized helper for consistent BlockDesign mapping
    const blockDesign = createBlockDesign(design);

    // Get subtitle based on showLinkSubtext setting
    const subtitle = getBlockSubtitle(blockDesign, "Ver en YouTube", link.url);

    // Render icon: user custom icon takes priority, else fallback
    const icon = renderBlockIcon({
        linkIcon: link.icon,
        fallbackIcon: (
            <Youtube size={22} style={{ color: design.buttonTextColor }} />
        ),
        size: 22,
        color: design.buttonTextColor,
    });

    const displayMode = getDisplayMode(link);
    const showPreview =
        (displayMode === "preview" || displayMode === "both") &&
        videoId &&
        embedUrl;

    // Button only mode
    if (displayMode === "button" || !showPreview) {
        return (
            <BlockButton
                href={link.url}
                title={link.title}
                subtitle={subtitle}
                design={blockDesign}
                position="full"
                icon={icon}
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
                        title={link.title || "YouTube Video"}
                        width="100%"
                        height="100%"
                        frameBorder="0"
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
                    icon={icon}
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
                    title={link.title || "YouTube Video"}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allowFullScreen
                    loading="lazy"
                />
            </BlockPreview>
        </BlockContainer>
    );
};

export default YouTubeBlock;
