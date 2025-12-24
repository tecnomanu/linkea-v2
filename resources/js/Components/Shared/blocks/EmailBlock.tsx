/**
 * EmailBlock - Public landing page renderer for Email mailto links
 *
 * Renders a button that opens the user's email client with
 * predefined recipient, subject, and body
 *
 * Related files:
 * - types.ts: LinkBlock.emailAddress, emailSubject, emailBody
 * - configs/EmailConfig.tsx: Panel configuration UI
 */

import { LinkBlock, UserProfile } from "@/types";
import { Mail } from "lucide-react";
import React from "react";

interface EmailBlockProps {
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
 * Builds the mailto: URL with optional subject and body
 */
const buildMailtoUrl = (
    email: string,
    subject?: string,
    body?: string
): string => {
    if (!email) return "#";

    let url = `mailto:${email}`;
    const params: string[] = [];

    if (subject) {
        params.push(`subject=${encodeURIComponent(subject)}`);
    }
    if (body) {
        params.push(`body=${encodeURIComponent(body)}`);
    }

    if (params.length > 0) {
        url += `?${params.join("&")}`;
    }

    return url;
};

export const EmailBlock: React.FC<EmailBlockProps> = ({
    link,
    design,
    buttonClassName,
    buttonStyle,
    isPreview = false,
    onClick,
    animationDelay = 0,
    roundingClass = "rounded-[20px]",
}) => {
    const mailtoUrl = buildMailtoUrl(
        link.emailAddress || "",
        link.emailSubject,
        link.emailBody
    );

    return (
        <a
            href={mailtoUrl}
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
                        <Mail size={22} style={{ color: design.buttonTextColor }} />
                    </div>
                )}

                {/* Text content */}
                <div className="flex-1 min-w-0 text-left">
                    <h3 className="text-base font-bold truncate">{link.title}</h3>
                    {design.showLinkSubtext && link.emailAddress && (
                        <p className="text-xs truncate opacity-70">
                            {link.emailAddress}
                        </p>
                    )}
                </div>
            </div>
        </a>
    );
};

export default EmailBlock;

