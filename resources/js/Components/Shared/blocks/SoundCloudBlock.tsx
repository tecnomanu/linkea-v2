/**
 * SoundCloudBlock - SoundCloud audio block
 *
 * Modes:
 * - Button only: Link to SoundCloud
 * - Button + Preview: Header button with embedded player widget
 */

import { BlockDesign, getBlockSubtitle } from "@/hooks/useBlockStyles";
import { LinkBlock, UserProfile } from "@/types";
import { Headphones } from "lucide-react";
import React from "react";
import { BlockButton, BlockContainer, BlockPreview, renderBlockIcon } from "./partial";

interface SoundCloudBlockProps {
    link: LinkBlock;
    design: UserProfile["customDesign"];
    buttonClassName: string; // Legacy prop - not used
    buttonStyle: React.CSSProperties; // Legacy prop - not used
    isPreview?: boolean;
    onClick?: (e: React.MouseEvent) => void;
    animationDelay?: number;
}

/**
 * Build SoundCloud embed URL
 */
const buildSoundCloudEmbedUrl = (url: string): string | null => {
    if (!url || !url.includes("soundcloud.com")) return null;
    return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`;
};

export const SoundCloudBlock: React.FC<SoundCloudBlockProps> = ({
    link,
    design,
    isPreview = false,
    onClick,
    animationDelay = 0,
}) => {
    const embedUrl = buildSoundCloudEmbedUrl(link.url);

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
    const subtitle = getBlockSubtitle(blockDesign, "SoundCloud", link.url);

    // Render icon: user custom icon takes priority, else fallback to Headphones
    const icon = renderBlockIcon({
        linkIcon: link.icon,
        fallbackIcon: <Headphones size={22} style={{ color: design.buttonTextColor }} />,
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
                        icon={icon}
                        isPreview={isPreview}
                        onClick={onClick}
                    />
                )}

                {/* SoundCloud player embed */}
                <BlockPreview
                    design={blockDesign}
                    hasButton={!!link.title}
                    backgroundColor="#f5f5f5"
                >
                    <iframe
                        src={embedUrl}
                        title={link.title || "SoundCloud Player"}
                        width="100%"
                        height="166"
                        frameBorder="0"
                        allow="autoplay"
                        loading="lazy"
                        scrolling="no"
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
            icon={icon}
            isPreview={isPreview}
            onClick={onClick}
            animationDelay={animationDelay}
            className="mb-4"
        />
    );
};

export default SoundCloudBlock;
