/**
 * MapBlock - Public landing page renderer for Map/Location blocks
 *
 * Renders as either:
 * - button: Opens Google Maps in new tab
 * - inline: Embeds Google Maps iframe
 *
 * Related files:
 * - types.ts: LinkBlock.mapAddress, mapQuery, mapZoom, mapDisplayMode
 * - configs/MapConfig.tsx: Panel configuration UI
 */

import { LinkBlock, UserProfile } from "@/types";
import { ExternalLink, MapPin } from "lucide-react";
import React from "react";

interface MapBlockProps {
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
 * Builds Google Maps URL for external link or embed
 */
const buildMapsUrl = (address?: string, query?: string): string => {
    const searchTerm = address || query;
    if (!searchTerm) return "https://maps.google.com";
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchTerm)}`;
};

/**
 * Builds Google Maps embed URL
 */
const buildEmbedUrl = (address?: string, query?: string, zoom: number = 15): string => {
    const searchTerm = address || query;
    if (!searchTerm) return "";
    // Using the embed API without key (limited but works for basic embeds)
    return `https://www.google.com/maps?q=${encodeURIComponent(searchTerm)}&z=${zoom}&output=embed`;
};

export const MapBlock: React.FC<MapBlockProps> = ({
    link,
    design,
    buttonClassName,
    buttonStyle,
    isPreview = false,
    onClick,
    animationDelay = 0,
    roundingClass = "rounded-[20px]",
}) => {
    const displayMode = link.mapDisplayMode || "button";
    const mapsUrl = buildMapsUrl(link.mapAddress, link.mapQuery);
    const embedUrl = buildEmbedUrl(link.mapAddress, link.mapQuery, link.mapZoom);

    // Inline embed mode
    if (displayMode === "inline" && (link.mapAddress || link.mapQuery)) {
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
                            <MapPin size={20} />
                            <span className="font-bold">{link.title}</span>
                        </div>
                    </div>
                )}

                {/* Map Embed */}
                <div
                    className={`bg-white overflow-hidden ${roundingClass}`}
                    style={{
                        border: `2px solid ${design.buttonColor}20`,
                    }}
                >
                    <iframe
                        src={embedUrl}
                        title={link.title || "Ubicacion"}
                        width="100%"
                        height="300"
                        frameBorder="0"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="w-full"
                        style={{ border: 0 }}
                    />
                </div>

                {/* Link to open in Google Maps */}
                <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 mt-2 text-xs opacity-60 hover:opacity-100 transition-opacity"
                    style={{ color: design.buttonColor }}
                    onClick={(e) => {
                        if (isPreview) e.preventDefault();
                    }}
                >
                    <span>Abrir en Google Maps</span>
                    <ExternalLink size={12} />
                </a>
            </div>
        );
    }

    // Button mode (default)
    return (
        <a
            href={mapsUrl}
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
                        <MapPin size={22} style={{ color: design.buttonTextColor }} />
                    </div>
                )}

                {/* Text content */}
                <div className="flex-1 min-w-0 text-left">
                    <h3 className="text-base font-bold truncate">{link.title}</h3>
                    {design.showLinkSubtext && (link.mapAddress || link.mapQuery) && (
                        <p className="text-xs truncate opacity-70">
                            {link.mapAddress || link.mapQuery}
                        </p>
                    )}
                </div>
            </div>
        </a>
    );
};

export default MapBlock;

