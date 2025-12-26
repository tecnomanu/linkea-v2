/**
 * LandingContent - Base component for rendering landing page content
 *
 * Used by both PhonePreview (preview mode) and LandingView (public page).
 * Any changes here will reflect in both places.
 */

import { getLucideIcon } from "@/config/blockConfig";
import { Icon } from "@/constants/icons";
import { isLinkComplete } from "@/hooks/useLinkValidation";
import { LinkBlock, UserProfile } from "@/types";
import { calculateContrastColors } from "@/utils/colorUtils";
import {
    isLegacyIcon,
    isLucideIcon,
    renderLegacyIcon,
} from "@/utils/iconHelper";
import {
    Calendar,
    ExternalLink,
    Ghost,
    Globe,
    MessageCircle,
    Music,
    Share2,
    Video,
    X as XIcon,
    Youtube,
} from "lucide-react";
import React, { useMemo } from "react";
import {
    CalendarBlock,
    EmailBlock,
    MapBlock,
    SoundCloudBlock,
    TikTokBlock,
    TwitchBlock,
    VimeoBlock,
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

// --- Helpers ---

const getYoutubeId = (url: string) => {
    const regExp =
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
};

const getSpotifyEmbedUrl = (url: string) => {
    try {
        const urlObj = new URL(url);
        return urlObj.href.replace(
            "open.spotify.com/",
            "open.spotify.com/embed/"
        );
    } catch {
        return null;
    }
};

const getIcon = (iconName: string, size = 16) => {
    switch (iconName) {
        case "Youtube":
            return <Youtube size={size} />;
        case "MessageCircle":
            return <MessageCircle size={size} />;
        case "Music":
            return <Music size={size} />;
        case "Video":
            return <Video size={size} />;
        case "Twitter":
            return <XIcon size={size} />;
        case "Mastodon":
            return <Ghost size={size} />;
        case "Calendar":
            return <Calendar size={size} />;
        case "Type":
            return null;
        default:
            return <Globe size={size} />;
    }
};

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
        const base = `block w-full p-1.5 transition-all duration-300 hover:scale-[1.01] active:scale-95 group mb-3 last:mb-0 ${shape}`;
        let style: React.CSSProperties = {};
        let className = base;

        switch (design.buttonStyle) {
            case "outline":
                className += ` border-2`;
                style = {
                    borderColor: design.buttonColor,
                    color: design.buttonTextColor,
                };
                break;
            case "soft":
                className += ` shadow-sm backdrop-blur-md`;
                style = {
                    backgroundColor: `${design.buttonColor}CC`,
                    color: design.buttonTextColor,
                };
                break;
            case "hard":
                className += ` border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:scale-100`;
                style = {
                    backgroundColor: design.buttonColor,
                    color: design.buttonTextColor,
                    borderColor: isDarkTheme ? "white" : "black",
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
            className={`w-full ${heightClass} overflow-y-auto hide-scrollbar pt-14 pb-8 transition-all duration-500 ${containerClasses} ${fontClasses}`}
            style={containerStyle}
        >
            {/* Profile Header */}
            <div className="flex flex-col items-center px-6 mb-8 text-center pt-6 animate-in slide-in-from-bottom-4 duration-700 fade-in">
                <div className="relative mb-4 group cursor-pointer">
                    <img
                        src={user.avatar}
                        alt={user.name}
                        className={`relative w-28 h-28 object-cover shadow-xl border-4 border-white/20 transition-all duration-300 ${
                            design.roundedAvatar !== false
                                ? "rounded-full"
                                : "rounded-xl"
                        }`}
                    />
                </div>
                {/* Handle badge - displayed first after avatar */}
                <p
                    className={`text-sm font-medium mb-2 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10 ${
                        isThemePreset ? subTextColor : ""
                    }`}
                    style={
                        !isThemePreset
                            ? {
                                  color: computedTextColors.textMuted,
                                  backgroundColor:
                                      computedTextColors.text === "#ffffff"
                                          ? "rgba(255,255,255,0.1)"
                                          : "rgba(0,0,0,0.05)",
                              }
                            : {}
                    }
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
                {/* Title - displayed after handle badge */}
                <h2
                    className={`text-2xl font-bold mb-1 tracking-tight ${
                        isThemePreset ? baseTextColor : ""
                    }`}
                    style={
                        !isThemePreset ? { color: computedTextColors.text } : {}
                    }
                >
                    {user.name}
                </h2>
                {/* Subtitle - displayed after title */}
                {user.bio && (
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
                        {user.bio}
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

            {/* Action Row */}
            <div className="flex justify-center gap-4 mb-10 animate-in slide-in-from-bottom-5 duration-700 fade-in fill-mode-backwards delay-100">
                {[Share2, ExternalLink].map((Icon, i) => (
                    <button
                        key={i}
                        className={btnClassName.replace(
                            "w-full",
                            "w-12 h-12 flex items-center justify-center"
                        )}
                        style={btnStyle}
                        onClick={(e) => isPreview && e.preventDefault()}
                    >
                        <Icon size={20} />
                    </button>
                ))}
            </div>

            {/* Links Stack */}
            <div
                className={`px-6 space-y-0 pb-10 mx-auto ${contentWidthClass}`}
            >
                {activeLinks.map((link, idx) => {
                    const delay = 150 + idx * 50;

                    // Header Block
                    if (link.type === "header") {
                        const sizeClass =
                            link.headerSize === "large"
                                ? "text-3xl font-black mt-6 mb-2"
                                : link.headerSize === "small"
                                ? "text-lg font-bold mt-2 mb-1 opacity-80"
                                : "text-xl font-bold mt-4 mb-2";
                        return (
                            <div
                                key={link.id}
                                className={`text-center ${sizeClass} ${
                                    isThemePreset ? "" : ""
                                } animate-in slide-in-from-bottom-2 fade-in fill-mode-backwards`}
                                style={{
                                    ...(!isThemePreset
                                        ? { color: computedTextColors.text }
                                        : {}),
                                    animationDelay: `${delay}ms`,
                                }}
                            >
                                {link.title}
                            </div>
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

                    // Media Embeds (YouTube/Spotify)
                    if (
                        (link.type === "video" ||
                            link.type === "music" ||
                            link.type === "youtube" ||
                            link.type === "spotify") &&
                        link.showInlinePlayer
                    ) {
                        const isSpotify = link.type === "music";
                        const embedUrl = isSpotify
                            ? getSpotifyEmbedUrl(link.url)
                            : null;
                        const videoId = !isSpotify
                            ? getYoutubeId(link.url)
                            : null;

                        if (videoId || embedUrl) {
                            return (
                                <div
                                    key={link.id}
                                    className={`w-full overflow-hidden shadow-sm mb-4 ${getRounding()} ${
                                        videoId ? "aspect-video bg-black" : ""
                                    } animate-in slide-in-from-bottom-2 fade-in fill-mode-backwards`}
                                    style={{ animationDelay: `${delay}ms` }}
                                >
                                    {videoId ? (
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            src={`https://www.youtube.com/embed/${videoId}?autoplay=${
                                                link.autoPlay ? 1 : 0
                                            }&mute=${link.startMuted ? 1 : 0}`}
                                            title={link.title}
                                            frameBorder="0"
                                            allowFullScreen
                                        ></iframe>
                                    ) : (
                                        <iframe
                                            style={{
                                                borderRadius:
                                                    design.buttonShape ===
                                                    "sharp"
                                                        ? "0"
                                                        : "12px",
                                            }}
                                            src={embedUrl!}
                                            width="100%"
                                            height={
                                                link.playerSize === "compact"
                                                    ? "80"
                                                    : "152"
                                            }
                                            frameBorder="0"
                                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                            loading="lazy"
                                        ></iframe>
                                    )}
                                </div>
                            );
                        }
                    }

                    // Standard Button
                    let finalUrl = link.url;
                    let subLabel = link.url;
                    if (link.type === "whatsapp") {
                        finalUrl = `https://wa.me/${
                            link.phoneNumber
                        }?text=${encodeURIComponent(
                            link.predefinedMessage || ""
                        )}`;
                        subLabel = link.phoneNumber || "";
                    } else if (link.type === "video") subLabel = "Ver Video";
                    else if (link.type === "music") subLabel = "Escuchar";

                    // Determine icon: legacy SVG icon takes priority, then Lucide icon, then type-based fallback
                    const hasLegacyIcon = isLegacyIcon(link.icon);
                    const hasLucideIcon = isLucideIcon(link.icon);
                    let iconName = "Globe";
                    if (link.type === "whatsapp") iconName = "MessageCircle";
                    else if (link.type === "video") iconName = "Youtube";
                    else if (link.type === "music") iconName = "Music";
                    else if (link.type === "twitter") iconName = "Twitter";
                    else if (link.type === "mastodon") iconName = "Mastodon";

                    // Icon display settings
                    const showIcons = design.showButtonIcons !== false;
                    const iconAlignment = design.buttonIconAlignment || "left";
                    // Subtext (URL/description) is hidden by default
                    const showSubtext = design.showLinkSubtext === true;

                    // Icon background style - fixed for outline buttons
                    const getIconContainerStyle = (): React.CSSProperties => {
                        if (design.buttonStyle === "outline") {
                            return {
                                backgroundColor: `${design.buttonColor}15`,
                            };
                        }
                        return {};
                    };

                    // Render the icon element
                    const renderIcon = (size: number = 22) => {
                        // Legacy SVG icon (from icon picker)
                        if (hasLegacyIcon) {
                            return (
                                <span style={{ color: design.buttonTextColor }}>
                                    {renderLegacyIcon(
                                        link.icon,
                                        size,
                                        "",
                                        design.buttonTextColor
                                    )}
                                </span>
                            );
                        }

                        // Lucide icon saved in link (user can change via config)
                        if (hasLucideIcon) {
                            const iconObj = link.icon as unknown as {
                                type: string;
                                name: string;
                            };
                            const SavedIcon = getLucideIcon(iconObj.name);
                            return (
                                <span style={{ color: design.buttonTextColor }}>
                                    <SavedIcon size={size} />
                                </span>
                            );
                        }

                        // Fallback to type-based icon
                        return (
                            <span style={{ color: design.buttonTextColor }}>
                                {getIcon(iconName, size)}
                            </span>
                        );
                    };

                    return (
                        <a
                            key={link.id}
                            href={finalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => handleLinkClick(e, link.id)}
                            className={`${btnClassName} animate-in slide-in-from-bottom-2 fade-in fill-mode-backwards`}
                            style={{
                                ...btnStyle,
                                animationDelay: `${delay}ms`,
                            }}
                        >
                            <div
                                className={`flex items-center p-3 ${
                                    iconAlignment === "right" ? "relative" : ""
                                }`}
                            >
                                {/* Left icon - separate column */}
                                {showIcons && iconAlignment === "left" && (
                                    <div
                                        className={`w-11 h-11 flex items-center justify-center mr-4 shrink-0 transition-colors duration-300 ${getRounding()} ${
                                            design.buttonStyle === "outline"
                                                ? ""
                                                : "bg-white/20"
                                        }`}
                                        style={getIconContainerStyle()}
                                    >
                                        {renderIcon(22)}
                                    </div>
                                )}

                                {/* Text content */}
                                <div
                                    className={`flex-1 min-w-0 ${
                                        iconAlignment === "inline"
                                            ? "flex items-center gap-3"
                                            : "text-left"
                                    } ${
                                        iconAlignment === "right" ? "pr-12" : ""
                                    }`}
                                >
                                    {/* Inline icon - before text */}
                                    {showIcons &&
                                        iconAlignment === "inline" &&
                                        renderIcon(18)}
                                    <div className="min-w-0">
                                        <h3 className="text-base font-bold truncate">
                                            {link.title}
                                        </h3>
                                        {showSubtext &&
                                            subLabel &&
                                            iconAlignment !== "inline" && (
                                                <p className="text-xs truncate opacity-70">
                                                    {subLabel}
                                                </p>
                                            )}
                                    </div>
                                </div>

                                {/* Right icon - absolute positioned */}
                                {showIcons && iconAlignment === "right" && (
                                    <div
                                        className={`absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center shrink-0 ${getRounding()} ${
                                            design.buttonStyle === "outline"
                                                ? ""
                                                : "bg-white/20"
                                        }`}
                                        style={getIconContainerStyle()}
                                    >
                                        {renderIcon(20)}
                                    </div>
                                )}
                            </div>
                        </a>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="mt-auto pt-6 pb-10 flex flex-col items-center gap-2">
                <div
                    className={`flex items-center gap-2 text-xs opacity-60 hover:opacity-100 transition-opacity ${
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
                    >
                        Politica de Privacidad
                    </a>
                    <span>|</span>
                    <span>
                        Creado con{" "}
                        <a
                            href="https://linkea.ar"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => isPreview && e.preventDefault()}
                            className="font-bold hover:underline"
                        >
                            Linkea
                        </a>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default LandingContent;
