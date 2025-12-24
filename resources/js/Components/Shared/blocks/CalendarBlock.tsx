/**
 * CalendarBlock - Public landing page renderer for Calendar/Booking blocks
 *
 * Renders calendar links as either:
 * - button: A styled link that opens the calendar in a new tab
 * - inline: An embedded iframe showing the calendar widget
 *
 * Supports: Calendly, Cal.com, Acuity Scheduling, and custom URLs
 *
 * Related files:
 * - types.ts: CalendarProvider, CalendarDisplayMode, LinkBlock
 * - configs/CalendarConfig.tsx: Panel configuration UI
 * - LandingContent.tsx: Parent component that renders this block
 *
 * SEO/Accessibility notes:
 * - iframe has title attribute for screen readers
 * - Loading="lazy" for better performance
 * - Fallback link for non-embed mode
 */

import { LinkBlock, UserProfile } from "@/types";
import { Calendar, ExternalLink } from "lucide-react";
import React from "react";

interface CalendarBlockProps {
    link: LinkBlock;
    design: UserProfile["customDesign"];
    /** Button class name from parent (includes shape, style) */
    buttonClassName: string;
    /** Button inline styles from parent */
    buttonStyle: React.CSSProperties;
    /** If true, block is in preview mode (no clicks) */
    isPreview?: boolean;
    /** Click handler from parent */
    onClick?: (e: React.MouseEvent) => void;
    /** Animation delay for staggered entry */
    animationDelay?: number;
    /** Border radius class from parent */
    roundingClass?: string;
}

/**
 * Generates embed URL for different calendar providers
 */
const getCalendarEmbedUrl = (
    url: string,
    provider: string
): string | null => {
    if (!url) return null;

    try {
        const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`);

        switch (provider) {
            case "calendly":
                // Calendly embed: just use the URL directly, widget handles it
                return url;
            case "cal":
                // Cal.com: URL works directly for embed
                return url;
            case "acuity":
                // Acuity: URL works directly for embed
                return url;
            default:
                return url;
        }
    } catch {
        return url;
    }
};

/**
 * Get provider display name
 */
const getProviderLabel = (provider: string): string => {
    switch (provider) {
        case "calendly":
            return "Calendly";
        case "cal":
            return "Cal.com";
        case "acuity":
            return "Acuity";
        default:
            return "Calendario";
    }
};

export const CalendarBlock: React.FC<CalendarBlockProps> = ({
    link,
    design,
    buttonClassName,
    buttonStyle,
    isPreview = false,
    onClick,
    animationDelay = 0,
    roundingClass = "rounded-[20px]",
}) => {
    const displayMode = link.calendarDisplayMode || "button";
    const provider = link.calendarProvider || "other";
    const embedUrl = getCalendarEmbedUrl(link.url, provider);

    // Inline embed mode
    if (displayMode === "inline" && embedUrl) {
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
                            <Calendar size={20} />
                            <span className="font-bold">{link.title}</span>
                        </div>
                    </div>
                )}

                {/* Calendar Embed */}
                <div
                    className={`bg-white overflow-hidden ${roundingClass}`}
                    style={{
                        border: `2px solid ${design.buttonColor}20`,
                    }}
                >
                    {provider === "calendly" ? (
                        // Calendly uses their inline widget script
                        <div
                            className="calendly-inline-widget"
                            data-url={embedUrl}
                            style={{
                                minWidth: "320px",
                                height: "630px",
                            }}
                        >
                            {/* Fallback if script doesn't load */}
                            <noscript>
                                <a
                                    href={embedUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Agendar cita
                                </a>
                            </noscript>
                        </div>
                    ) : (
                        // Generic iframe for other providers
                        <iframe
                            src={embedUrl}
                            title={`${link.title || "Calendario"} - ${getProviderLabel(provider)}`}
                            width="100%"
                            height="630"
                            frameBorder="0"
                            loading="lazy"
                            className="w-full"
                            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                        />
                    )}
                </div>

                {/* Powered by label */}
                <p className="text-xs text-center mt-2 opacity-50">
                    Con {getProviderLabel(provider)}
                </p>
            </div>
        );
    }

    // Button mode (default) - standard link button
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
                <div
                    className={`w-11 h-11 flex items-center justify-center mr-4 shrink-0 ${roundingClass} ${
                        design.buttonStyle === "outline"
                            ? ""
                            : "bg-white/20"
                    }`}
                    style={
                        design.buttonStyle === "outline"
                            ? { backgroundColor: `${design.buttonColor}15` }
                            : {}
                    }
                >
                    <Calendar
                        size={22}
                        style={{ color: design.buttonTextColor }}
                    />
                </div>

                {/* Text content */}
                <div className="flex-1 min-w-0 text-left">
                    <h3 className="text-base font-bold truncate">
                        {link.title}
                    </h3>
                    <p className="text-xs truncate opacity-70 flex items-center gap-1">
                        <span>{getProviderLabel(provider)}</span>
                        <ExternalLink size={10} />
                    </p>
                </div>
            </div>
        </a>
    );
};

export default CalendarBlock;

