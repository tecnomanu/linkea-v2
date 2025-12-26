/**
 * MapBlock - Google Maps location block
 *
 * Modes:
 * - Button only: Link to Google Maps
 * - Button + Preview: Header button with embedded map
 */

import { BlockDesign } from "@/hooks/useBlockStyles";
import { LinkBlock, UserProfile } from "@/types";
import { MapPin } from "lucide-react";
import React from "react";
import { renderBlockIcon } from "@/hooks/useBlockIcon";
import { BlockButton, BlockContainer, BlockPreview } from "./partial";

interface MapBlockProps {
    link: LinkBlock;
    design: UserProfile["customDesign"];
    buttonClassName: string; // Legacy prop - not used
    buttonStyle: React.CSSProperties; // Legacy prop - not used
    isPreview?: boolean;
    onClick?: (e: React.MouseEvent) => void;
    animationDelay?: number;
}

/**
 * Build Google Maps URL for external link
 */
const buildMapsUrl = (address?: string, query?: string): string => {
    const searchTerm = address || query;
    if (!searchTerm) return "https://maps.google.com";
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        searchTerm
    )}`;
};

/**
 * Build Google Maps embed URL
 */
const buildEmbedUrl = (
    address?: string,
    query?: string,
    zoom: number = 15
): string => {
    const searchTerm = address || query;
    if (!searchTerm) return "";
    return `https://www.google.com/maps?q=${encodeURIComponent(
        searchTerm
    )}&z=${zoom}&output=embed`;
};

export const MapBlock: React.FC<MapBlockProps> = ({
    link,
    design,
    isPreview = false,
    onClick,
    animationDelay = 0,
}) => {
    const displayMode = link.mapDisplayMode || "button";
    const mapsUrl = buildMapsUrl(link.mapAddress, link.mapQuery);
    const embedUrl = buildEmbedUrl(
        link.mapAddress,
        link.mapQuery,
        link.mapZoom
    );

    // Convert design to BlockDesign format
    const blockDesign: BlockDesign = {
        buttonColor: design.buttonColor,
        buttonTextColor: design.buttonTextColor,
        buttonStyle: design.buttonStyle,
        buttonShape: design.buttonShape,
        showButtonIcons: design.showButtonIcons,
        showLinkSubtext: design.showLinkSubtext,
    };

    // Render icon: user custom icon takes priority, else fallback to MapPin
    const icon = renderBlockIcon({
        linkIcon: link.icon,
        fallbackIcon: (
            <MapPin size={22} style={{ color: design.buttonTextColor }} />
        ),
        size: 22,
        color: design.buttonTextColor,
    });

    // Show address if global showLinkSubtext is on OR mapShowAddress is true
    const shouldShowAddress = design.showLinkSubtext || link.mapShowAddress;
    const locationText = link.mapAddress || link.mapQuery;

    // Button + Preview mode (inline display)
    if (displayMode === "inline" && locationText) {
        return (
            <BlockContainer animationDelay={animationDelay}>
                {/* Header button */}
                {link.title && (
                    <BlockButton
                        href={mapsUrl}
                        title={link.title}
                        subtitle={shouldShowAddress ? locationText : undefined}
                        design={blockDesign}
                        position="top"
                        icon={icon}
                        isPreview={isPreview}
                        onClick={onClick}
                    />
                )}

                {/* Map embed */}
                <BlockPreview
                    design={blockDesign}
                    hasButton={!!link.title}
                    backgroundColor="white"
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
                </BlockPreview>
            </BlockContainer>
        );
    }

    // Button only mode (default)
    return (
        <BlockButton
            href={mapsUrl}
            title={link.title}
            subtitle={shouldShowAddress ? locationText : undefined}
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

export default MapBlock;
