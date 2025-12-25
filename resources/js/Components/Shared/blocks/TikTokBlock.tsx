/**
 * TikTokBlock - TikTok video link block
 *
 * TikTok does not support easy external embeds,
 * so this renders as a button that opens TikTok in a new tab.
 * Button only - no preview mode.
 */

import { BlockDesign, getBlockSubtitle } from "@/hooks/useBlockStyles";
import { LinkBlock, UserProfile } from "@/types";
import { ExternalLink, Play } from "lucide-react";
import React from "react";
import { BlockButton, renderBlockIcon } from "./partial";

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
    // Convert design to BlockDesign format
    const blockDesign: BlockDesign = {
        buttonColor: design.buttonColor,
        buttonTextColor: design.buttonTextColor,
        buttonStyle: design.buttonStyle,
        buttonShape: design.buttonShape,
        showButtonIcons: design.showButtonIcons,
        showLinkSubtext: design.showLinkSubtext,
    };

    // Render icon: user custom icon takes priority, else fallback to Play
    const icon = renderBlockIcon({
        linkIcon: link.icon,
        fallbackIcon: <Play size={22} style={{ color: design.buttonTextColor }} />,
        size: 22,
        color: design.buttonTextColor,
    });

    // Get subtitle based on showLinkSubtext setting
    const subtitleText = getBlockSubtitle(blockDesign, "TikTok", link.url);

    // Subtitle with external link icon
    const SubtitleContent = () => (
        <span className="flex items-center gap-1">
            <span>{subtitleText}</span>
            <ExternalLink size={10} />
        </span>
    );

    return (
        <BlockButton
            href={link.url}
            title={link.title}
            subtitle={<SubtitleContent />}
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
