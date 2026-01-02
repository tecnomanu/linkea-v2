/**
 * EmailBlock - Email mailto link block
 *
 * Opens the user's email client with predefined recipient, subject, and body.
 * Button only - no preview mode.
 */

import { renderBlockIcon } from "@/hooks/useBlockIcon";
import { createBlockDesign } from "@/hooks/useBlockStyles";
import { LinkBlock, LandingProfile } from "@/types/index";
import { Mail } from "lucide-react";
import React from "react";
import { BlockButton } from "./partial";

interface EmailBlockProps {
    link: LinkBlock;
    design: LandingProfile["customDesign"];
    buttonClassName: string; // Legacy prop - not used
    buttonStyle: React.CSSProperties; // Legacy prop - not used
    isPreview?: boolean;
    onClick?: (e: React.MouseEvent) => void;
    animationDelay?: number;
}

/**
 * Build mailto: URL with optional subject and body
 */
const buildMailtoUrl = (
    email: string,
    subject?: string,
    body?: string
): string => {
    if (!email) return "#";

    let url = `mailto:${email}`;
    const params: string[] = [];

    if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
    if (body) params.push(`body=${encodeURIComponent(body)}`);

    if (params.length > 0) url += `?${params.join("&")}`;

    return url;
};

export const EmailBlock: React.FC<EmailBlockProps> = ({
    link,
    design,
    isPreview = false,
    onClick,
    animationDelay = 0,
}) => {
    const mailtoUrl = buildMailtoUrl(
        link.emailAddress || "",
        link.emailSubject,
        link.emailBody
    );

    // Use centralized helper for consistent BlockDesign mapping
    const blockDesign = createBlockDesign(design);

    // Render icon: user custom icon takes priority, else fallback to Mail
    const icon = renderBlockIcon({
        linkIcon: link.icon,
        fallbackIcon: (
            <Mail size={22} style={{ color: design.buttonTextColor }} />
        ),
        size: 22,
        color: design.buttonTextColor,
    });

    // Show email as subtitle if showLinkSubtext is enabled
    const subtitle =
        design.showLinkSubtext && link.emailAddress
            ? link.emailAddress
            : undefined;

    return (
        <BlockButton
            href={mailtoUrl}
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

export default EmailBlock;
