/**
 * TikTokBlock - TikTok video link block
 *
 * TikTok does not support easy external embeds,
 * so this renders as a button that opens TikTok in a new tab.
 * Button only - no preview mode.
 */

import { renderBlockIcon } from "@/hooks/useBlockIcon";
import { createBlockDesign, getBlockSubtitle } from "@/hooks/useBlockStyles";
import { LinkBlock, UserProfile } from "@/types";
import { Play } from "lucide-react";
import React from "react";
import { BlockButton } from "./partial";

interface TikTokBlockProps {
    link: LinkBlock;
    design: UserProfile["customDesign"];
    buttonClassName: string; // Legacy prop - not used
    buttonStyle: React.CSSProperties; // Legacy prop - not used
    isPreview?: boolean;
    onClick?: (e: React.MouseEvent) => void;
    animationDelay?: number;
}

export const TikTokBlock: React.FC<TikTokBlockProps> = ({
    link,
    design,
    isPreview = false,
    onClick,
    animationDelay = 0,
}) => {
    const blockDesign = createBlockDesign(design);

    const icon = renderBlockIcon({
        linkIcon: link.icon,
        fallbackIcon: (
            <Play size={22} style={{ color: design.buttonTextColor }} />
        ),
        size: 22,
        color: design.buttonTextColor,
    });

    // Consistent with YouTube: "Ver en TikTok" or URL if showLinkSubtext enabled
    const subtitle = getBlockSubtitle(blockDesign, "Ver en TikTok", link.url);

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

export default TikTokBlock;
