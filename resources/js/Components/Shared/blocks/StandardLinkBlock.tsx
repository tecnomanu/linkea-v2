/**
 * StandardLinkBlock - Generic link button block
 *
 * Used for: link, button, classic, social, twitter, mastodon, and any
 * other block type that renders as a simple clickable button.
 *
 * This is the fallback renderer for block types that don't have
 * specialized components.
 */

import {
    getLucideIcon,
    isLegacyIcon,
    isLucideIcon,
    renderLegacyIcon,
} from "@/hooks/useBlockIcon";
import { BlockDesign, getBlockSubtitle } from "@/hooks/useBlockStyles";
import { LinkBlock, UserProfile } from "@/types";
import { Ghost, Globe, MessageCircle, X as XIcon } from "lucide-react";
import React from "react";
import { renderBlockIcon } from "@/hooks/useBlockIcon";
import { BlockButton } from "./partial";

interface StandardLinkBlockProps {
    link: LinkBlock;
    design: UserProfile["customDesign"];
    buttonClassName: string;
    buttonStyle: React.CSSProperties;
    isPreview?: boolean;
    onClick?: (e: React.MouseEvent) => void;
    animationDelay?: number;
}

/**
 * Get fallback icon based on link type
 */
const getFallbackIcon = (type: string, color: string, size = 22) => {
    switch (type) {
        case "twitter":
            return <XIcon size={size} style={{ color }} />;
        case "mastodon":
            return <Ghost size={size} style={{ color }} />;
        case "whatsapp":
            return <MessageCircle size={size} style={{ color }} />;
        default:
            return <Globe size={size} style={{ color }} />;
    }
};

export const StandardLinkBlock: React.FC<StandardLinkBlockProps> = ({
    link,
    design,
    isPreview = false,
    onClick,
    animationDelay = 0,
}) => {
    // Convert design to BlockDesign format
    const blockDesign: BlockDesign = {
        buttonColor: design.buttonColor,
        buttonTextColor: design.buttonTextColor,
        buttonStyle: design.buttonStyle,
        buttonShape: design.buttonShape,
        buttonSize: design.buttonSize,
        showButtonIcons: design.showButtonIcons,
        buttonIconAlignment: design.buttonIconAlignment,
        showLinkSubtext: design.showLinkSubtext,
        buttonBorderColor: design.buttonBorderColor,
    };

    // Get subtitle based on showLinkSubtext setting
    const subtitle = getBlockSubtitle(blockDesign, link.url, link.url);

    // Render icon: user custom icon takes priority, then type-based fallback
    const icon = renderBlockIcon({
        linkIcon: link.icon,
        fallbackIcon: getFallbackIcon(link.type, design.buttonTextColor),
        size: 22,
        color: design.buttonTextColor,
    });

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

export default StandardLinkBlock;

