/**
 * TwitchBlock - Twitch channel/stream block
 *
 * Modes:
 * - Button only: Link to Twitch channel
 * - Button + Preview: Header button with embedded stream player
 *
 * TODO: Implement Twitch API integration to detect live status
 * - Create TwitchService.php to query Twitch Helix API
 * - Endpoint: GET https://api.twitch.tv/helix/streams?user_login={channel}
 * - Requires TWITCH_CLIENT_ID and TWITCH_CLIENT_SECRET in .env
 * - Cache result for 2 minutes to avoid rate limits
 * - When live: show LiveBadge + Radio icon pulsing
 * - When offline: show user's custom icon
 */

import { renderBlockIcon } from "@/hooks/useBlockIcon";
import { createBlockDesign, getBlockSubtitle } from "@/hooks/useBlockStyles";
import { LinkBlock, MediaDisplayMode, UserProfile } from "@/types";
import { Video } from "lucide-react";
import React from "react";
import { BlockButton, BlockContainer, BlockPreview } from "./partial";

interface TwitchBlockProps {
    link: LinkBlock;
    design: UserProfile["customDesign"];
    buttonClassName: string; // Legacy prop - not used with new components
    buttonStyle: React.CSSProperties; // Legacy prop - not used
    isPreview?: boolean;
    onClick?: (e: React.MouseEvent) => void;
    animationDelay?: number;
}

/**
 * Extract Twitch channel name from URL or return input if it's just a name
 */
const extractTwitchChannel = (url: string): string | null => {
    if (!url) return null;
    if (!/[./]/.test(url)) return url;
    const match = url.match(/twitch\.tv\/([^/?]+)/i);
    return match ? match[1] : null;
};

/**
 * Get the current display mode, handling legacy showInlinePlayer
 */
const getDisplayMode = (link: LinkBlock): MediaDisplayMode => {
    if (link.mediaDisplayMode) return link.mediaDisplayMode;
    return link.showInlinePlayer ? "both" : "button";
};

export const TwitchBlock: React.FC<TwitchBlockProps> = ({
    link,
    design,
    isPreview = false,
    onClick,
    animationDelay = 0,
}) => {
    const channel = extractTwitchChannel(link.url);
    const twitchUrl = channel ? `https://www.twitch.tv/${channel}` : link.url;
    const embedUrl = channel
        ? `https://player.twitch.tv/?channel=${channel}&parent=${
              typeof window !== "undefined"
                  ? window.location.hostname
                  : "localhost"
          }&muted=true`
        : null;

    // Use centralized helper for consistent BlockDesign mapping
    const blockDesign = createBlockDesign(design);

    // Get subtitle based on showLinkSubtext setting
    const subtitle = getBlockSubtitle(blockDesign, "Twitch", link.url);

    // TODO: Enable when Twitch API integration is implemented
    // const isLive = false; // Will come from API
    //
    // const LiveBadge = () => (
    //     <div className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded animate-pulse">
    //         EN VIVO
    //     </div>
    // );
    //
    // const getLiveIcon = () => (
    //     <Radio
    //         size={22}
    //         className="animate-pulse"
    //         style={{ color: design.buttonTextColor }}
    //     />
    // );

    // Always use user's custom icon or fallback to Video icon
    const icon = renderBlockIcon({
        linkIcon: link.icon,
        fallbackIcon: (
            <Video size={22} style={{ color: design.buttonTextColor }} />
        ),
        size: 22,
        color: design.buttonTextColor,
    });

    const displayMode = getDisplayMode(link);
    const showPreview =
        (displayMode === "preview" || displayMode === "both") &&
        channel &&
        embedUrl;

    // Button only mode
    if (displayMode === "button" || !showPreview) {
        return (
            <BlockButton
                href={twitchUrl}
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
                        title={link.title || `${channel} - Twitch`}
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
                    href={twitchUrl}
                    title={link.title}
                    subtitle={subtitle}
                    design={blockDesign}
                    position="top"
                    icon={icon}
                    // TODO: Add when live detection is implemented
                    // rightContent={isLive ? <LiveBadge /> : undefined}
                    isPreview={isPreview}
                    onClick={onClick}
                />
            )}

            {/* Stream embed */}
            <BlockPreview
                design={blockDesign}
                hasButton={!!link.title}
                aspectRatio="16/9"
                backgroundColor="black"
            >
                <iframe
                    src={embedUrl}
                    title={link.title || `${channel} - Twitch`}
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

export default TwitchBlock;
