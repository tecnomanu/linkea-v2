/**
 * Block/Link types for landing page content.
 *
 * Each block type represents a different kind of content that can be
 * added to a landing page (links, embeds, headers, etc.)
 */

// =============================================================================
// Block Type Definitions
// =============================================================================

export type BlockType =
    // Standard link types
    | "link"
    | "button" // legacy
    | "classic" // legacy
    // Headers
    | "header"
    | "heading" // legacy
    // Social
    | "social"
    // Embeds
    | "youtube"
    | "spotify"
    | "soundcloud"
    | "tiktok"
    | "twitch"
    | "vimeo"
    // Messaging
    | "whatsapp"
    | "email"
    // Scheduling & Leads
    | "calendar"
    // Contact & Forms
    | "map"
    | "contact"
    // Legacy/other
    | "mastodon"
    | "twitter" // legacy
    | "video" // legacy
    | "music"; // legacy

// =============================================================================
// Block-Specific Types
// =============================================================================

export type HeaderSize = "small" | "medium" | "large";
export type PlayerSize = "normal" | "compact";
export type MediaDisplayMode = "button" | "preview" | "both";
export type CalendarProvider = "calendly" | "cal" | "acuity" | "other";
export type CalendarDisplayMode = "button" | "inline";
export type MapDisplayMode = "button" | "inline";

// =============================================================================
// Link Block Interface
// =============================================================================

/**
 * Represents a single block/link on a landing page.
 * Different block types use different optional fields.
 */
export interface LinkBlock {
    id: string;
    title: string;
    url: string;
    isEnabled: boolean;
    clicks: number;
    type: BlockType;
    icon?: { type?: string; name?: string } | string | null;
    sparklineData: { value: number }[];

    // WhatsApp specific
    phoneNumber?: string;
    predefinedMessage?: string;

    // Header specific
    headerSize?: HeaderSize;

    // Media specific (YouTube/Spotify/Vimeo/Twitch/SoundCloud/TikTok)
    mediaDisplayMode?: MediaDisplayMode;
    showInlinePlayer?: boolean; // Show embedded player vs link preview
    autoPlay?: boolean;
    startMuted?: boolean;
    playerSize?: PlayerSize;

    // Calendar specific (Calendly, Cal.com, Acuity)
    calendarProvider?: CalendarProvider;
    calendarDisplayMode?: CalendarDisplayMode;

    // Email specific
    emailAddress?: string;
    emailSubject?: string;
    emailBody?: string;

    // Map specific
    mapAddress?: string;
    mapQuery?: string;
    mapZoom?: number;
    mapDisplayMode?: MapDisplayMode;
    mapShowAddress?: boolean;

    // Video embeds (Vimeo, TikTok, Twitch)
    videoId?: string;

    // SoundCloud specific
    soundcloudUrl?: string;
}

