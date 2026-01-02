/**
 * LandingContent - Base component for rendering landing page content
 *
 * Used by both PhonePreview (preview mode) and LandingView (public page).
 * Any changes here will reflect in both places.
 */

import { Icon } from "@/constants/icons";
import { renderLegacyIcon } from "@/hooks/useBlockIcon";
import { isLinkComplete } from "@/hooks/useLinkValidation";
import { LinkBlock, UserProfile } from "@/types";
import { calculateContrastColors, isLightColor } from "@/utils/colorUtils";
import { Globe, Share2 } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import ShareModal from "./ShareModal";
import {
    CalendarBlock,
    EmailBlock,
    HeaderBlock,
    MapBlock,
    SoundCloudBlock,
    SpotifyBlock,
    StandardLinkBlock,
    TikTokBlock,
    TwitchBlock,
    VimeoBlock,
    WhatsAppBlock,
    YouTubeBlock,
} from "./blocks";

export type DeviceMode = "mobile" | "tablet" | "desktop";

export interface SocialLink {
    id: string;
    url: string;
    icon?: Icon;
    active: boolean;
}

interface LandingContentProps {
    user: UserProfile;
    links: LinkBlock[];
    socialLinks?: SocialLink[];
    device?: DeviceMode;
    /** If true, links are not clickable and no tracking occurs */
    isPreview?: boolean;
    /** If true, uses min-h-screen for full viewport coverage (public pages) */
    fullScreen?: boolean;
}

// --- Style Generators ---

// List of actual Tailwind preset themes (not custom SVG backgrounds)
const PRESET_THEMES = [
    "midnight",
    "ocean",
    "forest",
    "candy",
    "sunset",
    "white",
];

const getThemeBackground = (theme: string) => {
    switch (theme) {
        case "midnight":
            return "bg-neutral-900 text-white";
        case "ocean":
            return "bg-gradient-to-br from-cyan-100 to-blue-200 text-neutral-900";
        case "forest":
            return "bg-gradient-to-br from-emerald-100 to-teal-200 text-neutral-900";
        case "candy":
            return "bg-gradient-to-br from-pink-100 to-purple-200 text-neutral-900";
        case "sunset":
            return "bg-gradient-to-br from-orange-100 to-rose-200 text-neutral-900";
        case "white":
            return "bg-white text-neutral-900";
        case "custom":
        default:
            return "";
    }
};

const isPresetTheme = (theme: string) => PRESET_THEMES.includes(theme);

const getFontClass = (fontPair: string) => {
    switch (fontPair) {
        case "elegant":
            return "font-serif";
        case "mono":
            return "font-mono";
        case "modern":
        default:
            return "font-sans";
    }
};

// --- Main Component ---

export const LandingContent: React.FC<LandingContentProps> = ({
    user,
    links,
    socialLinks = [],
    device = "mobile",
    isPreview = false,
    fullScreen = false,
}) => {
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    // Animated share button text - shows briefly on first load (public pages only)
    const [showShareText, setShowShareText] = useState(false);

    // Share button text animation: appear after 2.5s, disappear after 5s total
    useEffect(() => {
        if (isPreview) return;
        const showTimer = setTimeout(() => setShowShareText(true), 2500);
        const hideTimer = setTimeout(() => setShowShareText(false), 5000);
        return () => {
            clearTimeout(showTimer);
            clearTimeout(hideTimer);
        };
    }, [isPreview]);

    const activeSocialLinks = socialLinks.filter((s) => s.active);
    // Filter links that are enabled AND have complete/valid data
    const activeLinks = links.filter((l) => l.isEnabled && isLinkComplete(l));
    const design = user.customDesign;
    // Only consider actual Tailwind preset themes, NOT custom SVG backgrounds like "large_triangles"
    const isThemePreset = isPresetTheme(user.theme);
    const isDarkTheme = user.theme === "midnight";

    // Calculate text color based on background for custom themes
    // For preset themes, use the theme's built-in colors
    // For custom themes, use textColor if set, otherwise auto-calculate from background
    const computedTextColors = useMemo(() => {
        if (isThemePreset) {
            // Preset themes have known colors
            return {
                text: isDarkTheme ? "#ffffff" : "#1a1a1a",
                textMuted: isDarkTheme ? "#a3a3a3" : "#666666",
            };
        }

        // Use explicitly set textColor if available
        if (design.textColor) {
            // Derive muted from primary
            const isLightText =
                design.textColor === "#ffffff" ||
                design.textColor === "#fff" ||
                design.textColor === "white";
            return {
                text: design.textColor,
                textMuted: isLightText ? "#a3a3a3" : "#666666",
            };
        }

        // Auto-calculate based on background color and/or image
        // This handles SVG patterns, gradients, and solid colors
        const bgImage =
            typeof design.backgroundImage === "string"
                ? design.backgroundImage
                : typeof design.backgroundImage === "object" &&
                  design.backgroundImage?.image
                ? design.backgroundImage.image
                : undefined;

        return calculateContrastColors(
            design.backgroundColor || "#ffffff",
            bgImage
        );
    }, [
        isThemePreset,
        isDarkTheme,
        design.textColor,
        design.backgroundColor,
        design.backgroundImage,
    ]);

    // Badge styling: INVERTED for contrast - dark badge on light bg, light badge on dark bg
    // This creates visual separation between badge and page background
    const badgeStyle = useMemo(() => {
        // For preset themes, use known values (inverted)
        if (isThemePreset) {
            return isDarkTheme
                ? {
                      // Dark page: light badge with dark text
                      color: "#1f2937",
                      backgroundColor: "rgba(255,255,255,0.75)",
                      borderColor: "rgba(255,255,255,0.3)",
                  }
                : {
                      // Light page: dark badge with light text
                      color: "#ffffff",
                      backgroundColor: "rgba(0,0,0,0.55)",
                      borderColor: "rgba(0,0,0,0.1)",
                  };
        }

        // For custom themes, check if background is light or dark
        const bgColor = design.backgroundColor || "#ffffff";
        const bgIsLight = isLightColor(bgColor);

        // Badge INVERTED for contrast with page background:
        // - Light background: dark badge with white text (stands out)
        // - Dark background: light badge with dark text (stands out)
        if (bgIsLight) {
            return {
                color: "#ffffff", // white text
                backgroundColor: "rgba(0,0,0,0.55)", // dark bg with blur
                borderColor: "rgba(0,0,0,0.1)",
            };
        } else {
            return {
                color: "#1f2937", // dark text
                backgroundColor: "rgba(255,255,255,0.75)", // light bg with blur
                borderColor: "rgba(255,255,255,0.3)",
            };
        }
    }, [isThemePreset, isDarkTheme, design.backgroundColor]);

    const baseTextColor = isDarkTheme ? "text-white" : "text-neutral-900";
    const subTextColor = isDarkTheme ? "text-neutral-400" : "text-neutral-600";

    // backgroundImage can be:
    // - A CSS string like 'url("...")' (from LandingView after processing)
    // - A CSS string with SVG data-uri (legacy backgrounds)
    // - An object {image: 'path'} (from Dashboard preview, needs local handling)
    const resolveBackgroundImage = (
        bg: string | { image?: string } | undefined
    ): string | undefined => {
        if (!bg) return undefined;
        if (typeof bg === "string") {
            // Already a CSS value (url(...), linear-gradient, etc.)
            return bg;
        }
        if (typeof bg === "object" && bg.image) {
            // Object format - wrap in url() for preview mode
            const imagePath = bg.image;
            if (imagePath.startsWith("http") || imagePath.startsWith("data:")) {
                return `url("${imagePath}")`;
            }
            // Relative path - in preview mode this should already be a full URL or base64
            return `url("${imagePath}")`;
        }
        return undefined;
    };

    const backgroundImageValue = resolveBackgroundImage(design.backgroundImage);

    // Check if background image is enabled (defaults to true if not explicitly set to false)
    const isBackgroundEnabled = (design as any).backgroundEnabled !== false;

    // In preview mode, always use 'scroll' to prevent weird fixed background behavior
    // In public pages (fullScreen), respect the original backgroundAttachment setting
    const effectiveBackgroundAttachment = isPreview
        ? "scroll"
        : (design as any).backgroundAttachment || "scroll";

    const containerStyle: React.CSSProperties = !isThemePreset
        ? {
              backgroundColor: design.backgroundColor,
              color: "#000",
              // Only apply background image if enabled
              ...(backgroundImageValue &&
                  isBackgroundEnabled && {
                      backgroundImage: backgroundImageValue,
                      backgroundSize: (design as any).backgroundSize || "cover",
                      backgroundPosition:
                          (design as any).backgroundPosition || "center",
                      backgroundAttachment: effectiveBackgroundAttachment,
                      backgroundRepeat:
                          (design as any).backgroundRepeat || "repeat",
                  }),
          }
        : {};
    const containerClasses = isThemePreset
        ? getThemeBackground(user.theme)
        : "";
    const fontClasses = getFontClass(design.fontPair);

    // Layout Width Control based on device
    const contentWidthClass = device === "mobile" ? "max-w-md" : "max-w-2xl";

    // Button rounding helper - used for buttons and icon containers
    const getRounding = () => {
        switch (design.buttonShape) {
            case "sharp":
                return "rounded-none";
            case "pill":
                return "rounded-full";
            case "rounded":
            default:
                return "rounded-[20px]";
        }
    };

    const getButtonStyles = () => {
        const shape = getRounding();
        // Button size: compact (legacy default) vs normal (larger)
        const sizeClass = design.buttonSize === "normal" ? "p-1.5" : "p-0.5";
        const base = `block w-full ${sizeClass} transition-all duration-300 hover:scale-[1.01] active:scale-95 group mb-3 last:mb-0 ${shape}`;
        let style: React.CSSProperties = {};
        let className = base;

        // Check if we have a separate border color (legacy support)
        const hasSeparateBorder = !!design.buttonBorderColor;

        switch (design.buttonStyle) {
            case "outline":
                className += ` border-2`;
                if (hasSeparateBorder) {
                    // Legacy mode: border color + background color + text color all separate
                    style = {
                        borderColor: design.buttonBorderColor,
                        backgroundColor: design.buttonColor,
                        color: design.buttonTextColor,
                    };
                } else {
                    // Standard outline: transparent bg, border = buttonColor
                    style = {
                        borderColor: design.buttonColor,
                        color: design.buttonTextColor,
                    };
                }
                break;
            case "soft":
                className += ` shadow-sm backdrop-blur-md`;
                style = {
                    backgroundColor: `${design.buttonColor}CC`,
                    color: design.buttonTextColor,
                };
                if (hasSeparateBorder) {
                    className += ` border-2`;
                    style.borderColor = design.buttonBorderColor;
                }
                break;
            case "hard":
                className += ` border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:scale-100`;
                style = {
                    backgroundColor: design.buttonColor,
                    color: design.buttonTextColor,
                    borderColor: hasSeparateBorder
                        ? design.buttonBorderColor
                        : isDarkTheme
                        ? "white"
                        : "black",
                    boxShadow: isDarkTheme
                        ? "4px 4px 0px 0px rgba(255,255,255,1)"
                        : "4px 4px 0px 0px rgba(0,0,0,1)",
                };
                break;
            case "solid":
            default:
                className += ` shadow-md`;
                style = {
                    backgroundColor: design.buttonColor,
                    color: design.buttonTextColor,
                };
                if (hasSeparateBorder) {
                    className += ` border-2`;
                    style.borderColor = design.buttonBorderColor;
                }
                break;
        }
        return { className, style };
    };

    const { className: btnClassName, style: btnStyle } = getButtonStyles();

    // Click handler - only works in non-preview mode
    const handleLinkClick = (e: React.MouseEvent, linkId: string) => {
        if (isPreview) {
            e.preventDefault();
            return;
        }
        // Track click in background (fire and forget)
        // Uses API route to avoid CSRF issues on public pages
        fetch(`/api/statistics/link/click/${linkId}`, {
            method: "POST",
        }).catch(() => {
            // Silently fail - don't block navigation
        });
    };

    // Height class: min-h-screen for public pages, h-full for preview
    const heightClass = fullScreen ? "min-h-screen" : "h-full min-h-full";

    return (
        <div
            className={`w-full ${heightClass} overflow-y-auto overlay-scrollbar pt-10 md:pt-14 pb-8 transition-all duration-500 ${containerClasses} ${fontClasses}`}
            style={containerStyle}
        >
            {/* Profile Header */}
            <div className="flex flex-col items-center px-6 mb-6 md:mb-8 text-center pt-2 md:pt-6 animate-in slide-in-from-bottom-4 duration-700 fade-in">
                <div className="relative mb-4 group cursor-pointer">
                    <img
                        src={user.avatar}
                        alt={user.title || user.handle}
                        className={`relative w-28 h-28 object-cover transition-all duration-300 ${
                            design.roundedAvatar !== false
                                ? "rounded-full"
                                : "rounded-xl"
                        } ${
                            design.avatarFloating !== false
                                ? "shadow-xl border-4 border-white/20"
                                : ""
                        }`}
                    />
                </div>
                {/* Handle badge with share button - displayed first after avatar */}
                <div className="flex items-center gap-2 mb-2">
                    <p
                        className="text-sm font-medium px-3 py-1 rounded-full backdrop-blur-md border"
                        style={badgeStyle}
                    >
                        @{user.handle}
                        {(user.isVerified || user.isLegacy) && (
                            <img
                                src="/assets/images/icons/official.svg"
                                alt="Verified"
                                className="w-3.5 h-3.5 ml-1 inline-block"
                                title="Cuenta verificada"
                            />
                        )}
                    </p>
                    {/* Share button - inline with handle badge, expands briefly to show text */}
                    <button
                        onClick={() => !isPreview && setIsShareModalOpen(true)}
                        className={`h-8 px-2.5 flex items-center justify-center rounded-full backdrop-blur-sm border border-white/10 transition-all duration-500 ease-in-out hover:scale-105 active:scale-95 ${
                            isPreview ? "cursor-default" : ""
                        } ${showShareText ? "gap-1.5" : "gap-0"}`}
                        style={{
                            backgroundColor: `${design.buttonColor}E6`,
                            color: design.buttonTextColor,
                        }}
                        title="Compartir"
                    >
                        <Share2 size={14} className="shrink-0" />
                        <span
                            className="text-xs font-semibold whitespace-nowrap overflow-hidden"
                            style={{
                                maxWidth: showShareText ? 80 : 0,
                                opacity: showShareText ? 1 : 0,
                                transition:
                                    "max-width 500ms ease-in-out, opacity 400ms ease-in-out",
                            }}
                        >
                            Compartir
                        </span>
                    </button>
                </div>
                {/* Title - displayed after handle badge (only if enabled and has content) */}
                {user.showTitle !== false && user.title && (
                    <h2
                        className={`text-2xl font-bold mb-1 tracking-tight ${
                            isThemePreset ? baseTextColor : ""
                        }`}
                        style={
                            !isThemePreset
                                ? { color: computedTextColors.text }
                                : {}
                        }
                    >
                        {user.title}
                    </h2>
                )}
                {/* Subtitle - displayed after title (only if enabled and has content) */}
                {user.showSubtitle !== false && user.subtitle && (
                    <p
                        className={`text-sm max-w-[280px] leading-relaxed ${
                            isThemePreset ? subTextColor : ""
                        }`}
                        style={
                            !isThemePreset
                                ? { color: computedTextColors.textMuted }
                                : {}
                        }
                    >
                        {user.subtitle}
                    </p>
                )}

                {/* Social Links Icons */}
                {activeSocialLinks.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                        {activeSocialLinks.map((social) => (
                            <a
                                key={social.id}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => isPreview && e.preventDefault()}
                                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
                                style={{
                                    backgroundColor: design.buttonColor,
                                }}
                                title={social.icon?.name || "Social"}
                            >
                                {social.icon ? (
                                    renderLegacyIcon(
                                        social.icon,
                                        20,
                                        "",
                                        design.buttonTextColor
                                    )
                                ) : (
                                    <Globe
                                        size={18}
                                        style={{
                                            color: design.buttonTextColor,
                                        }}
                                    />
                                )}
                            </a>
                        ))}
                    </div>
                )}
            </div>

            {/* Links Stack */}
            <div
                className={`px-6 space-y-0 pb-10 mx-auto ${contentWidthClass}`}
            >
                {activeLinks.map((link, idx) => {
                    const delay = 150 + idx * 50;

                    // Header Block
                    if (link.type === "header") {
                        return (
                            <HeaderBlock
                                key={link.id}
                                link={link}
                                design={design}
                                theme={user.theme}
                                isPreview={isPreview}
                                animationDelay={delay}
                            />
                        );
                    }

                    // Calendar Block - uses dedicated component
                    if (link.type === "calendar") {
                        return (
                            <CalendarBlock
                                key={link.id}
                                link={link}
                                design={design}
                                buttonClassName={btnClassName}
                                buttonStyle={btnStyle}
                                isPreview={isPreview}
                                onClick={(e) => handleLinkClick(e, link.id)}
                                animationDelay={delay}
                            />
                        );
                    }

                    // Email Block - mailto link
                    if (link.type === "email") {
                        return (
                            <EmailBlock
                                key={link.id}
                                link={link}
                                design={design}
                                buttonClassName={btnClassName}
                                buttonStyle={btnStyle}
                                isPreview={isPreview}
                                onClick={(e) => handleLinkClick(e, link.id)}
                                animationDelay={delay}
                            />
                        );
                    }

                    // Map Block - Google Maps
                    if (link.type === "map") {
                        return (
                            <MapBlock
                                key={link.id}
                                link={link}
                                design={design}
                                buttonClassName={btnClassName}
                                buttonStyle={btnStyle}
                                isPreview={isPreview}
                                onClick={(e) => handleLinkClick(e, link.id)}
                                animationDelay={delay}
                            />
                        );
                    }

                    // Vimeo Block - video embed
                    if (link.type === "vimeo") {
                        return (
                            <VimeoBlock
                                key={link.id}
                                link={link}
                                design={design}
                                buttonClassName={btnClassName}
                                buttonStyle={btnStyle}
                                isPreview={isPreview}
                                onClick={(e) => handleLinkClick(e, link.id)}
                                animationDelay={delay}
                            />
                        );
                    }

                    // TikTok Block - external link
                    if (link.type === "tiktok") {
                        return (
                            <TikTokBlock
                                key={link.id}
                                link={link}
                                design={design}
                                buttonClassName={btnClassName}
                                buttonStyle={btnStyle}
                                isPreview={isPreview}
                                onClick={(e) => handleLinkClick(e, link.id)}
                                animationDelay={delay}
                            />
                        );
                    }

                    // Twitch Block - stream embed/link
                    if (link.type === "twitch") {
                        return (
                            <TwitchBlock
                                key={link.id}
                                link={link}
                                design={design}
                                buttonClassName={btnClassName}
                                buttonStyle={btnStyle}
                                isPreview={isPreview}
                                onClick={(e) => handleLinkClick(e, link.id)}
                                animationDelay={delay}
                            />
                        );
                    }

                    // SoundCloud Block - audio embed
                    if (link.type === "soundcloud") {
                        return (
                            <SoundCloudBlock
                                key={link.id}
                                link={link}
                                design={design}
                                buttonClassName={btnClassName}
                                buttonStyle={btnStyle}
                                isPreview={isPreview}
                                onClick={(e) => handleLinkClick(e, link.id)}
                                animationDelay={delay}
                            />
                        );
                    }

                    // YouTube Block
                    if (link.type === "youtube" || link.type === "video") {
                        return (
                            <YouTubeBlock
                                key={link.id}
                                link={link}
                                design={design}
                                buttonClassName={btnClassName}
                                buttonStyle={btnStyle}
                                isPreview={isPreview}
                                onClick={(e) => handleLinkClick(e, link.id)}
                                animationDelay={delay}
                            />
                        );
                    }

                    // Spotify Block
                    if (link.type === "spotify" || link.type === "music") {
                        return (
                            <SpotifyBlock
                                key={link.id}
                                link={link}
                                design={design}
                                buttonClassName={btnClassName}
                                buttonStyle={btnStyle}
                                isPreview={isPreview}
                                onClick={(e) => handleLinkClick(e, link.id)}
                                animationDelay={delay}
                            />
                        );
                    }

                    // WhatsApp Block
                    if (link.type === "whatsapp") {
                        return (
                            <WhatsAppBlock
                                key={link.id}
                                link={link}
                                design={design}
                                buttonClassName={btnClassName}
                                buttonStyle={btnStyle}
                                isPreview={isPreview}
                                onClick={(e) => handleLinkClick(e, link.id)}
                                animationDelay={delay}
                            />
                        );
                    }

                    // Standard Link Block (fallback for link, social, twitter, mastodon, etc.)
                    return (
                        <StandardLinkBlock
                            key={link.id}
                            link={link}
                            design={design}
                            buttonClassName={btnClassName}
                            buttonStyle={btnStyle}
                            isPreview={isPreview}
                            onClick={(e) => handleLinkClick(e, link.id)}
                            animationDelay={delay}
                        />
                    );
                })}
            </div>

            {/* Footer - Uses theme text color, safe-area for iOS */}
            <div
                className="mt-auto pt-6 flex flex-col items-center gap-2"
                style={{
                    paddingBottom:
                        "max(2.5rem, calc(1rem + env(safe-area-inset-bottom)))",
                }}
            >
                <div
                    className={`flex items-center gap-2 text-xs ${
                        isThemePreset ? subTextColor : ""
                    }`}
                    style={
                        !isThemePreset
                            ? { color: computedTextColors.textMuted }
                            : {}
                    }
                >
                    <a
                        href="/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => isPreview && e.preventDefault()}
                        className="hover:underline"
                        style={{ color: "inherit" }}
                    >
                        Privacidad
                    </a>
                    <span>|</span>
                    <button
                        onClick={(e) => {
                            if (isPreview) {
                                e.preventDefault();
                                return;
                            }
                            window.dispatchEvent(
                                new Event("linkea:openCookieModal")
                            );
                        }}
                        className="hover:underline"
                        style={{ color: "inherit" }}
                    >
                        Cookies
                    </button>
                    <span>|</span>
                    <span>
                        Creado con{" "}
                        <a
                            href="https://linkea.ar"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => isPreview && e.preventDefault()}
                            className="font-bold hover:underline"
                            style={{ color: "inherit" }}
                        >
                            Linkea
                        </a>
                    </span>
                </div>
            </div>

            {/* Share Modal */}
            {!isPreview && (
                <ShareModal
                    isOpen={isShareModalOpen}
                    onClose={() => setIsShareModalOpen(false)}
                    user={user}
                    shareUrl={
                        typeof window !== "undefined"
                            ? window.location.href
                            : `https://linkea.ar/${user.handle}`
                    }
                />
            )}
        </div>
    );
};

export default LandingContent;
