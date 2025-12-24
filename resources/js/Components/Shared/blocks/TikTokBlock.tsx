/**
 * TikTokBlock - Public landing page renderer for TikTok video blocks
 *
 * TikTok does not support direct embeds on external sites easily,
 * so this renders as a button that opens TikTok in a new tab.
 *
 * Related files:
 * - types.ts: LinkBlock.url
 * - configs/VideoEmbedConfig.tsx: Panel configuration UI
 */

import { LinkBlock, UserProfile } from "@/types";
import { ExternalLink, Play } from "lucide-react";
import React from "react";

interface TikTokBlockProps {
    link: LinkBlock;
    design: UserProfile["customDesign"];
    buttonClassName: string;
    buttonStyle: React.CSSProperties;
    isPreview?: boolean;
    onClick?: (e: React.MouseEvent) => void;
    animationDelay?: number;
    roundingClass?: string;
}

export const TikTokBlock: React.FC<TikTokBlockProps> = ({
    link,
    design,
    buttonClassName,
    buttonStyle,
    isPreview = false,
    onClick,
    animationDelay = 0,
    roundingClass = "rounded-[20px]",
}) => {
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
                {/* TikTok Icon */}
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
                        {/* TikTok-style icon using Play */}
                        <Play size={22} style={{ color: design.buttonTextColor }} />
                    </div>
                )}

                {/* Text content */}
                <div className="flex-1 min-w-0 text-left">
                    <h3 className="text-base font-bold truncate">{link.title}</h3>
                    <p className="text-xs truncate opacity-70 flex items-center gap-1">
                        <span>TikTok</span>
                        <ExternalLink size={10} />
                    </p>
                </div>
            </div>
        </a>
    );
};

export default TikTokBlock;

