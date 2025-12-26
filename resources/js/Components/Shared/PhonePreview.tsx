/**
 * PhonePreview - Phone/Tablet/Desktop preview wrapper
 *
 * Uses LandingContent for the actual content rendering.
 * This component only provides the device frame (phone, tablet, browser).
 */

import { LinkBlock, UserProfile } from "@/types";
import { usePage } from "@inertiajs/react";
import { Battery, Globe, Signal, Wifi } from "lucide-react";
import React from "react";
import { DeviceMode, LandingContent, SocialLink } from "./LandingContent";

// Re-export types for convenience
export type { DeviceMode, SocialLink };

interface PhonePreviewProps {
    user: UserProfile;
    links: LinkBlock[];
    socialLinks?: SocialLink[];
    device?: DeviceMode;
    className?: string;
    scale?: number;
    /** If false, links are clickable and tracking occurs. Default: true */
    isPreview?: boolean;
    /** If true, container height/width adjusts to scaled size. Useful for layouts. Default: false */
    fitContainer?: boolean;
}

// --- Main Export ---

// Base dimensions for mobile device
const MOBILE_WIDTH = 380;
const MOBILE_HEIGHT = 780;

export const PhonePreview: React.FC<PhonePreviewProps> = ({
    user,
    links,
    socialLinks = [],
    device = "mobile",
    className = "",
    scale = 1,
    isPreview = true,
    fitContainer = false,
}) => {
    const { appUrl } = usePage<{ appUrl: string }>().props;
    const displayDomain = appUrl.replace(/^https?:\/\//, "");
    const cleanHandle = user.handle.replace("@", "");
    const publicUrl = `${displayDomain}/${cleanHandle}`;

    if (device === "mobile") {
        const phoneFrame = (
            <div
                className={`relative select-none rounded-[56px] bg-neutral-900 border-[12px] border-neutral-900 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] ${
                    !fitContainer ? className : ""
                }`}
                style={{
                    width: MOBILE_WIDTH,
                    height: MOBILE_HEIGHT,
                    transform: `scale(${scale})`,
                    transformOrigin: "top center",
                }}
            >
                {/* Inner Screen Container (White/Content) */}
                <div className="relative h-full w-full bg-white rounded-[44px] overflow-hidden">
                    {/* Dynamic Island / Notch Area */}
                    <div className="absolute top-1 left-0 w-full h-14 z-50 grid grid-cols-3 items-start pt-3 pointer-events-none text-white mix-blend-difference">
                        {/* Left - Time (centered in left third) */}
                        <div className="flex justify-center">
                            <span className="text-xs font-semibold tracking-wide">
                                {new Date().toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                        </div>
                        {/* Center - Space for notch */}
                        <div></div>
                        {/* Right - Status icons (centered in right third) */}
                        <div className="flex justify-center gap-1.5 items-center">
                            <Signal size={14} />
                            <Wifi size={14} />
                            <Battery size={16} />
                        </div>
                    </div>

                    {/* The Notch Itself (Black Pill) */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[110px] h-[32px] bg-black rounded-full z-40 flex items-center justify-end px-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500/50"></div>
                    </div>

                    {/* Content - Uses shared LandingContent */}
                    <LandingContent
                        user={user}
                        links={links}
                        socialLinks={socialLinks}
                        device="mobile"
                        isPreview={isPreview}
                    />
                </div>

                {/* Hardware Buttons (Optional Cosmetic) */}
                <div className="absolute top-24 -left-[14px] w-[2px] h-8 bg-neutral-800 rounded-l-md"></div>
                <div className="absolute top-36 -left-[14px] w-[2px] h-12 bg-neutral-800 rounded-l-md"></div>
                <div className="absolute top-28 -right-[14px] w-[2px] h-20 bg-neutral-800 rounded-r-md"></div>
            </div>
        );

        // Wrap in fitted container if needed (respects scaled dimensions in layout)
        if (fitContainer) {
            return (
                <div
                    className={className}
                    style={{
                        height: MOBILE_HEIGHT * scale,
                    }}
                >
                    {phoneFrame}
                </div>
            );
        }

        return phoneFrame;
    }

    // Desktop / Tablet Browser Frame
    const width = device === "tablet" ? "w-[768px]" : "w-full max-w-[1200px]";

    return (
        <div
            className={`flex flex-col bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-700 transition-all duration-500 mx-auto h-full max-h-[85vh] ${width} ${className}`}
        >
            {/* Browser Toolbar */}
            <div className="h-10 bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 flex items-center px-4 gap-4 shrink-0">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                {/* Address Bar */}
                <div className="flex-1 max-w-xl mx-auto h-7 bg-white dark:bg-neutral-800 rounded-md border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-xs text-neutral-500 gap-2">
                    <div className="text-green-500">
                        <Globe size={10} />
                    </div>
                    <span>{publicUrl}</span>
                </div>
                <div className="w-12"></div> {/* Spacer to balance dots */}
            </div>
            {/* Content Area - Uses shared LandingContent */}
            <div className="flex-1 overflow-hidden relative bg-white">
                <LandingContent
                    user={user}
                    links={links}
                    socialLinks={socialLinks}
                    device={device}
                    isPreview={isPreview}
                />
            </div>
        </div>
    );
};

// Also export LandingContent for direct use
export { LandingContent };
