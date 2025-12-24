/**
 * VimeoBlock - Public landing page renderer for Vimeo video blocks
 *
 * Renders as either:
 * - button: Opens video in new tab
 * - inline: Embeds Vimeo player
 *
 * Related files:
 * - types.ts: LinkBlock.url, showInlinePlayer
 * - configs/VideoEmbedConfig.tsx: Panel configuration UI
 */

import { LinkBlock, UserProfile } from "@/types";
import { Play, Video } from "lucide-react";
import React from "react";

interface VimeoBlockProps {
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
 * Extracts Vimeo video ID from URL
 * Supports: vimeo.com/123456789, vimeo.com/channels/xxx/123456789, player.vimeo.com/video/123456789
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
    buttonClassName,
    buttonStyle,
    isPreview = false,
    onClick,
    animationDelay = 0,
    roundingClass = "rounded-[20px]",
}) => {
    const videoId = extractVimeoId(link.url);
    const embedUrl = videoId ? `https://player.vimeo.com/video/${videoId}?dnt=1` : null;

    // Inline embed mode
    if (link.showInlinePlayer && embedUrl) {
        return (
            <div
                className={`w-full overflow-hidden mb-4 animate-in slide-in-from-bottom-2 fade-in fill-mode-backwards ${roundingClass}`}
                style={{ animationDelay: `${animationDelay}ms` }}
            >
                {/* Header with title */}
                {link.title && (
                    <div
                        className={`p-4 ${roundingClass} mb-2`}
                        style={{
                            backgroundColor: design.buttonColor,
                            color: design.buttonTextColor,
                        }}
                    >
                        <div className="flex items-center gap-3">
                            <Video size={20} />
                            <span className="font-bold">{link.title}</span>
                        </div>
                    </div>
                )}

                {/* Video Embed */}
                <div
                    className={`bg-black overflow-hidden ${roundingClass}`}
                    style={{
                        border: `2px solid ${design.buttonColor}20`,
                        aspectRatio: "16/9",
                    }}
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
                        <Play size={22} style={{ color: design.buttonTextColor }} />
                    </div>
                )}

                {/* Text content */}
                <div className="flex-1 min-w-0 text-left">
                    <h3 className="text-base font-bold truncate">{link.title}</h3>
                    <p className="text-xs truncate opacity-70">Vimeo</p>
                </div>
            </div>
        </a>
    );
};

export default VimeoBlock;

