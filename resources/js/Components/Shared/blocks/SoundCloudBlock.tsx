/**
 * SoundCloudBlock - Public landing page renderer for SoundCloud audio blocks
 *
 * Renders as either:
 * - button: Opens SoundCloud in new tab
 * - inline: Embeds SoundCloud player widget
 *
 * Related files:
 * - types.ts: LinkBlock.url, showInlinePlayer
 * - configs/SoundCloudConfig.tsx: Panel configuration UI
 */

import { LinkBlock, UserProfile } from "@/types";
import { Headphones, Music } from "lucide-react";
import React from "react";

interface SoundCloudBlockProps {
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
 * Builds SoundCloud embed URL
 * Note: The official embed requires the track's embed URL from their oembed API,
 * but we can use the widget URL format for basic embedding
 */
const buildSoundCloudEmbedUrl = (url: string): string | null => {
    if (!url || !url.includes("soundcloud.com")) return null;
    // Use SoundCloud's widget API
    return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`;
};

export const SoundCloudBlock: React.FC<SoundCloudBlockProps> = ({
    link,
    design,
    buttonClassName,
    buttonStyle,
    isPreview = false,
    onClick,
    animationDelay = 0,
    roundingClass = "rounded-[20px]",
}) => {
    const embedUrl = buildSoundCloudEmbedUrl(link.url);

    // Inline embed mode
    if (link.showInlinePlayer && embedUrl) {
        return (
            <div
                className={`w-full overflow-hidden mb-4 animate-in slide-in-from-bottom-2 fade-in fill-mode-backwards ${roundingClass}`}
                style={{ animationDelay: `${animationDelay}ms` }}
            >
                {/* Header with title */}
                {link.title && (
                    <a
                        href={link.url}
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
                            <Music size={20} />
                            <span className="font-bold">{link.title}</span>
                        </div>
                    </a>
                )}

                {/* SoundCloud Player Embed */}
                <div
                    className={`bg-neutral-100 overflow-hidden ${roundingClass}`}
                    style={{
                        border: `2px solid ${design.buttonColor}20`,
                    }}
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
                </div>
            </div>
        );
    }

    // Button mode (default)
    return (
        <a
            href={link.url}
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
                        <Headphones size={22} style={{ color: design.buttonTextColor }} />
                    </div>
                )}

                {/* Text content */}
                <div className="flex-1 min-w-0 text-left">
                    <h3 className="text-base font-bold truncate">{link.title}</h3>
                    <p className="text-xs truncate opacity-70">SoundCloud</p>
                </div>
            </div>
        </a>
    );
};

export default SoundCloudBlock;

