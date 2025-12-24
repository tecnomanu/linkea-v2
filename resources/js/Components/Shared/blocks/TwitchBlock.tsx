/**
 * TwitchBlock - Public landing page renderer for Twitch channel blocks
 *
 * Renders as a button that links to the Twitch channel.
 * Can optionally show inline embed with chat.
 *
 * Related files:
 * - types.ts: LinkBlock.url, showInlinePlayer
 * - configs/VideoEmbedConfig.tsx: Panel configuration UI
 */

import { LinkBlock, UserProfile } from "@/types";
import { Radio, Video } from "lucide-react";
import React from "react";

interface TwitchBlockProps {
    link: LinkBlock;
    design: UserProfile["customDesign"];
    buttonClassName: string;
    buttonStyle: React.CSSProperties;
    isPreview?: boolean;
    onClick?: (e: React.MouseEvent) => void;
    animationDelay?: number;
    roundingClass?: string;
}

/**
 * Extracts Twitch channel name from URL or returns the input if it's just a name
 */
const extractTwitchChannel = (url: string): string | null => {
    if (!url) return null;
    // If it's just a channel name (no slashes or dots)
    if (!/[./]/.test(url)) return url;
    // Extract from URL
    const match = url.match(/twitch\.tv\/([^/?]+)/i);
    return match ? match[1] : null;
};

export const TwitchBlock: React.FC<TwitchBlockProps> = ({
    link,
    design,
    buttonClassName,
    buttonStyle,
    isPreview = false,
    onClick,
    animationDelay = 0,
    roundingClass = "rounded-[20px]",
}) => {
    const channel = extractTwitchChannel(link.url);
    const twitchUrl = channel ? `https://www.twitch.tv/${channel}` : link.url;
    const embedUrl = channel
        ? `https://player.twitch.tv/?channel=${channel}&parent=${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}&muted=true`
        : null;

    // Inline embed mode (with chat)
    if (link.showInlinePlayer && channel) {
        return (
            <div
                className={`w-full overflow-hidden mb-4 animate-in slide-in-from-bottom-2 fade-in fill-mode-backwards ${roundingClass}`}
                style={{ animationDelay: `${animationDelay}ms` }}
            >
                {/* Header with title */}
                {link.title && (
                    <a
                        href={twitchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`block p-4 ${roundingClass} mb-2 hover:opacity-90 transition-opacity`}
                        style={{
                            backgroundColor: design.buttonColor,
                            color: design.buttonTextColor,
                        }}
                        onClick={(e) => {
                            if (isPreview) e.preventDefault();
                        }}
                    >
                        <div className="flex items-center gap-3">
                            <Radio size={20} className="animate-pulse" />
                            <span className="font-bold">{link.title}</span>
                            <span className="ml-auto text-xs opacity-70">EN VIVO</span>
                        </div>
                    </a>
                )}

                {/* Stream Embed */}
                <div
                    className={`bg-black overflow-hidden ${roundingClass}`}
                    style={{
                        border: `2px solid ${design.buttonColor}20`,
                        aspectRatio: "16/9",
                    }}
                >
                    {embedUrl && (
                        <iframe
                            src={embedUrl}
                            title={link.title || `${channel} - Twitch`}
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            allowFullScreen
                            loading="lazy"
                        />
                    )}
                </div>
            </div>
        );
    }

    // Button mode (default)
    return (
        <a
            href={twitchUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
                if (isPreview) {
                    e.preventDefault();
                    return;
                }
                onClick?.(e);
            }}
            className={`${buttonClassName} animate-in slide-in-from-bottom-2 fade-in fill-mode-backwards`}
            style={{
                ...buttonStyle,
                animationDelay: `${animationDelay}ms`,
            }}
        >
            <div className="flex items-center p-3">
                {/* Icon */}
                {design.showButtonIcons !== false && (
                    <div
                        className={`w-11 h-11 flex items-center justify-center mr-4 shrink-0 ${roundingClass} ${
                            design.buttonStyle === "outline" ? "" : "bg-white/20"
                        }`}
                        style={
                            design.buttonStyle === "outline"
                                ? { backgroundColor: `${design.buttonColor}15` }
                                : {}
                        }
                    >
                        <Video size={22} style={{ color: design.buttonTextColor }} />
                    </div>
                )}

                {/* Text content */}
                <div className="flex-1 min-w-0 text-left">
                    <h3 className="text-base font-bold truncate">{link.title}</h3>
                    <p className="text-xs truncate opacity-70">Twitch</p>
                </div>
            </div>
        </a>
    );
};

export default TwitchBlock;

