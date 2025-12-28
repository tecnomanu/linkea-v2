/**
 * SpotifyBlock - Spotify audio block
 *
 * Display modes:
 * - button: Link only (opens Spotify)
 * - preview: Embed only (player widget)
 * - both: Button + Embed (header button with player below)
 */

import { renderBlockIcon } from "@/hooks/useBlockIcon";
import { createBlockDesign, getBlockSubtitle } from "@/hooks/useBlockStyles";
import { LinkBlock, MediaDisplayMode, UserProfile } from "@/types";
import { Music } from "lucide-react";
import React from "react";
import { BlockButton, BlockContainer, BlockPreview } from "./partial";

interface SpotifyBlockProps {
    link: LinkBlock;
    design: UserProfile["customDesign"];
    buttonClassName: string;
    buttonStyle: React.CSSProperties;
    isPreview?: boolean;
    onClick?: (e: React.MouseEvent) => void;
    animationDelay?: number;
}

/**
 * Convert Spotify URL to embed URL
 */
const getSpotifyEmbedUrl = (url: string): string | null => {
    if (!url) return null;
    try {
        const urlObj = new URL(url);
        if (!urlObj.hostname.includes("spotify.com")) return null;
        return urlObj.href.replace(
            "open.spotify.com/",
            "open.spotify.com/embed/"
        );
    } catch {
        return null;
    }
};

/**
 * Get the current display mode, handling legacy showInlinePlayer
 */
const getDisplayMode = (link: LinkBlock): MediaDisplayMode => {
    if (link.mediaDisplayMode) return link.mediaDisplayMode;
    // Legacy fallback: showInlinePlayer true = preview only (old behavior)
    return link.showInlinePlayer ? "preview" : "button";
};

export const SpotifyBlock: React.FC<SpotifyBlockProps> = ({
    link,
    design,
    isPreview = false,
    onClick,
    animationDelay = 0,
}) => {
    const embedUrl = getSpotifyEmbedUrl(link.url);
    const isCompact = link.playerSize === "compact";

    // Use centralized helper for consistent BlockDesign mapping
    const blockDesign = createBlockDesign(design);

    // Get subtitle based on showLinkSubtext setting
    const subtitle = getBlockSubtitle(
        blockDesign,
        "Escuchar en Spotify",
        link.url
    );

    // Render icon: user custom icon takes priority, else fallback
    const icon = renderBlockIcon({
        linkIcon: link.icon,
        fallbackIcon: (
            <Music size={22} style={{ color: design.buttonTextColor }} />
        ),
        size: 22,
        color: design.buttonTextColor,
    });

    const displayMode = getDisplayMode(link);
    const showPreview =
        (displayMode === "preview" || displayMode === "both") && embedUrl;

    // Helper to render the Spotify embed
    const renderEmbed = (hasButton: boolean) => (
        <BlockPreview
            design={blockDesign}
            hasButton={hasButton}
            backgroundColor="transparent"
        >
            <iframe
                style={{
                    borderRadius: design.buttonShape === "sharp" ? "0" : "12px",
                }}
                src={embedUrl!}
                width="100%"
                height={isCompact ? "80" : "152"}
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
            />
        </BlockPreview>
    );

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
                {renderEmbed(false)}
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

            {/* Player embed */}
            {renderEmbed(!!link.title)}
        </BlockContainer>
    );
};

export default SpotifyBlock;
