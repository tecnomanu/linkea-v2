/**
 * VimeoBlock - Vimeo video block
 *
 * Modes:
 * - Button only: Link to Vimeo video
 * - Button + Preview: Header button with embedded player
 */

import { BlockDesign, getBlockSubtitle } from "@/hooks/useBlockStyles";
import { LinkBlock, UserProfile } from "@/types";
import { Play, Video } from "lucide-react";
import React from "react";
import { BlockButton, BlockContainer, BlockPreview, renderBlockIcon } from "./partial";

interface VimeoBlockProps {
    link: LinkBlock;
    design: UserProfile["customDesign"];
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

export const VimeoBlock: React.FC<VimeoBlockProps> = ({
    link,
    design,
    isPreview = false,
    onClick,
    animationDelay = 0,
}) => {
    const videoId = extractVimeoId(link.url);
    const embedUrl = videoId ? `https://player.vimeo.com/video/${videoId}?dnt=1` : null;

    // Convert design to BlockDesign format
    const blockDesign: BlockDesign = {
        buttonColor: design.buttonColor,
        buttonTextColor: design.buttonTextColor,
        buttonStyle: design.buttonStyle,
        buttonShape: design.buttonShape,
        showButtonIcons: design.showButtonIcons,
        showLinkSubtext: design.showLinkSubtext,
    };

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

    // Button + Preview mode (inline player enabled)
    if (link.showInlinePlayer && embedUrl) {
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
    }

    // Button only mode (default)
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
};

export default VimeoBlock;
