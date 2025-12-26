/**
 * CalendarBlock - Calendar/Booking block
 *
 * Supports: Calendly, Cal.com, Acuity Scheduling, and custom URLs
 *
 * Modes:
 * - Button only: Link to calendar booking page
 * - Button + Preview: Header button with embedded calendar widget
 */

import { renderBlockIcon } from "@/hooks/useBlockIcon";
import { BlockDesign, getBlockSubtitle } from "@/hooks/useBlockStyles";
import { LinkBlock, UserProfile } from "@/types";
import { Calendar, ExternalLink } from "lucide-react";
import React from "react";
import { BlockButton, BlockContainer, BlockPreview } from "./partial";

interface CalendarBlockProps {
    link: LinkBlock;
    design: UserProfile["customDesign"];
    buttonClassName: string; // Legacy prop - not used
    buttonStyle: React.CSSProperties; // Legacy prop - not used
    isPreview?: boolean;
    onClick?: (e: React.MouseEvent) => void;
    animationDelay?: number;
}

/**
 * Generate embed URL for different calendar providers
 */
const getCalendarEmbedUrl = (url: string, provider: string): string | null => {
    if (!url) return null;

    try {
        const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;
        new URL(normalizedUrl);

        switch (provider) {
            case "calendly":
                const calendlyParams = new URLSearchParams({
                    embed_domain: window?.location?.hostname || "linkea.app",
                    embed_type: "Inline",
                    hide_landing_page_details: "1",
                    hide_gdpr_banner: "1",
                });
                return `${normalizedUrl}?${calendlyParams.toString()}`;
            case "cal":
                return `${normalizedUrl}?embed=true`;
            case "acuity":
                return normalizedUrl;
            default:
                return normalizedUrl;
        }
    } catch {
        return url;
    }
};

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
    isPreview = false,
    onClick,
    animationDelay = 0,
}) => {
    const displayMode = link.calendarDisplayMode || "button";
    const provider = link.calendarProvider || "other";
    const embedUrl = getCalendarEmbedUrl(link.url, provider);
    const providerLabel = getProviderLabel(provider);

    // Convert design to BlockDesign format
    const blockDesign: BlockDesign = {
        buttonColor: design.buttonColor,
        buttonTextColor: design.buttonTextColor,
        buttonStyle: design.buttonStyle,
        buttonShape: design.buttonShape,
        showButtonIcons: design.showButtonIcons,
        showLinkSubtext: design.showLinkSubtext,
    };

    // Render icon: user custom icon takes priority, else fallback to Calendar
    const icon = renderBlockIcon({
        linkIcon: link.icon,
        fallbackIcon: (
            <Calendar size={22} style={{ color: design.buttonTextColor }} />
        ),
        size: 22,
        color: design.buttonTextColor,
    });

    // Get subtitle based on showLinkSubtext setting (URL or provider name)
    const subtitleText = getBlockSubtitle(blockDesign, providerLabel, link.url);

    // Subtitle with external link icon for button mode
    const ButtonSubtitle = () => (
        <span className="flex items-center gap-1">
            <span>{subtitleText}</span>
            <ExternalLink size={10} />
        </span>
    );

    // Button + Preview mode (inline calendar embed)
    if (displayMode === "inline" && embedUrl) {
        return (
            <BlockContainer animationDelay={animationDelay}>
                {/* Header button */}
                {link.title && (
                    <BlockButton
                        href={link.url}
                        title={link.title}
                        subtitle={subtitleText}
                        design={blockDesign}
                        position="top"
                        icon={icon}
                        isPreview={isPreview}
                        onClick={onClick}
                    />
                )}

                {/* Calendar embed */}
                <BlockPreview
                    design={blockDesign}
                    hasButton={!!link.title}
                    backgroundColor="white"
                >
                    <iframe
                        src={embedUrl}
                        title={`${
                            link.title || "Calendario"
                        } - ${providerLabel}`}
                        width="100%"
                        height="630"
                        frameBorder="0"
                        loading="lazy"
                        className="w-full"
                        allow="payment"
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                    />
                </BlockPreview>

                {/* Powered by label */}
                <p className="text-xs text-center mt-2 opacity-50">
                    Con {providerLabel}
                </p>
            </BlockContainer>
        );
    }

    // Button only mode (default)
    return (
        <BlockButton
            href={link.url}
            title={link.title}
            subtitle={<ButtonSubtitle />}
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

export default CalendarBlock;
