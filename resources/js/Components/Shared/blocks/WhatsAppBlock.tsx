/**
 * WhatsAppBlock - WhatsApp direct message block
 *
 * Renders a button that opens WhatsApp with a predefined message.
 * Uses wa.me deep link format.
 */

import { renderBlockIcon } from "@/hooks/useBlockIcon";
import { createBlockDesign, getBlockSubtitle } from "@/hooks/useBlockStyles";
import { LinkBlock, LandingProfile } from "@/types/index";
import { MessageCircle } from "lucide-react";
import React from "react";
import { BlockButton } from "./partial";

interface WhatsAppBlockProps {
    link: LinkBlock;
    design: LandingProfile["customDesign"];
    buttonClassName: string;
    buttonStyle: React.CSSProperties;
    isPreview?: boolean;
    onClick?: (e: React.MouseEvent) => void;
    animationDelay?: number;
}

/**
 * Build WhatsApp deep link URL
 */
const buildWhatsAppUrl = (
    phoneNumber?: string,
    predefinedMessage?: string
): string => {
    const phone = phoneNumber?.replace(/\D/g, "") || "";
    const message = encodeURIComponent(predefinedMessage || "");
    return `https://wa.me/${phone}${message ? `?text=${message}` : ""}`;
};

export const WhatsAppBlock: React.FC<WhatsAppBlockProps> = ({
    link,
    design,
    isPreview = false,
    onClick,
    animationDelay = 0,
}) => {
    const whatsappUrl = buildWhatsAppUrl(
        link.phoneNumber,
        link.predefinedMessage
    );

    // Use centralized helper for consistent BlockDesign mapping
    const blockDesign = createBlockDesign(design);

    // Format phone number for display
    const displayPhone = link.phoneNumber || "";
    const subtitle = getBlockSubtitle(blockDesign, displayPhone, displayPhone);

    // Render icon: user custom icon takes priority, else fallback
    const icon = renderBlockIcon({
        linkIcon: link.icon,
        fallbackIcon: (
            <MessageCircle
                size={22}
                style={{ color: design.buttonTextColor }}
            />
        ),
        size: 22,
        color: design.buttonTextColor,
    });

    return (
        <BlockButton
            href={whatsappUrl}
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
};

export default WhatsAppBlock;
