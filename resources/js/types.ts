export type BlockType =
    // Standard link types
    | "link" // Standard link
    | "button" // Button link (legacy)
    | "classic" // Classic link (legacy)
    // Headers
    | "header" // Section header
    | "heading" // Heading (legacy name)
    // Social
    | "social" // Social media icon
    // Embeds
    | "youtube" // YouTube embed
    | "spotify" // Spotify embed
    | "soundcloud" // SoundCloud embed
    | "tiktok" // TikTok embed
    | "twitch" // Twitch embed
    | "vimeo" // Vimeo embed (TODO: implement full block)
    // Messaging
    | "whatsapp" // WhatsApp link
    | "email" // Email mailto link (TODO: implement full block)
    // Scheduling & Leads
    | "calendar" // Calendar/Booking embed (Calendly, Cal.com, etc.)
    // Contact & Forms
    | "map" // Google Maps embed (TODO: implement full block)
    | "contact" // Contact form (TODO: implement full block)
    // Legacy/other
    | "mastodon" // Mastodon
    | "twitter" // Twitter (legacy)
    | "video" // Video (legacy)
    | "music"; // Music (legacy)

export type HeaderSize = "small" | "medium" | "large";
export type PlayerSize = "normal" | "compact";
export type MediaDisplayMode = "button" | "preview" | "both"; // button = link only, preview = embed only, both = button + embed
export type CalendarProvider = "calendly" | "cal" | "acuity" | "other";
export type CalendarDisplayMode = "button" | "inline"; // button = link to external, inline = embed

export type ButtonStyle = "solid" | "outline" | "soft" | "hard";
export type ButtonShape = "sharp" | "rounded" | "pill";
export type ButtonSize = "compact" | "normal";
export type FontPair = "modern" | "elegant" | "mono";

// Saved custom theme slot (max 2 allowed)
export interface SavedCustomTheme {
    id: string;
    name: string;
    customDesign: CustomDesignConfig;
    createdAt: string;
}

// Extracted CustomDesign interface for reuse
export interface CustomDesignConfig {
    backgroundColor: string;
    backgroundImage?: string | { image?: string };
    backgroundEnabled?: boolean; // Switch to show/hide background image without deleting it
    backgroundAttachment?: "fixed" | "scroll";
    backgroundSize?: string;
    backgroundPosition?: string;
    backgroundRepeat?: string;

    // Legacy background editor props (kept for migration but hidden in UI)
    backgroundProps?: Record<string, string | number>;
    backgroundControls?: {
        hideBgColor?: boolean;
        colors?: string[];
        scale?: {
            min: number;
            max: number;
            default: number;
            aspectRatio?: boolean;
        };
        opacity?: { default: number };
        rotationBg?: { min: number; max: number; default: number };
    };

    buttonStyle: ButtonStyle;
    buttonShape: ButtonShape;
    buttonSize?: ButtonSize;
    buttonColor: string;
    buttonTextColor: string;
    buttonBorderColor?: string; // Border color (always stored, default: #000000)
    buttonBorderEnabled?: boolean; // Whether border is visible (default: false)

    showButtonIcons?: boolean;
    buttonIconAlignment?: "left" | "inline" | "right";
    showLinkSubtext?: boolean;

    fontPair: FontPair;
    textColor?: string;
    roundedAvatar?: boolean;
    avatarFloating?: boolean; // true = floating with shadow/border (default), false = flat/plain (legacy)
}

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
    mediaDisplayMode?: MediaDisplayMode; // button, preview, or both
    showInlinePlayer?: boolean; // @deprecated - use mediaDisplayMode instead
    autoPlay?: boolean;
    startMuted?: boolean;
    playerSize?: PlayerSize;

    // Calendar specific (Calendly, Cal.com, Acuity)
    calendarProvider?: CalendarProvider;
    calendarDisplayMode?: CalendarDisplayMode;
    // URL is stored in the standard 'url' field

    // Email specific
    emailAddress?: string;
    emailSubject?: string;
    emailBody?: string;

    // Map specific
    mapAddress?: string;
    mapQuery?: string;
    mapZoom?: number;
    mapDisplayMode?: "button" | "inline";
    mapShowAddress?: boolean; // Show address even when global showLinkSubtext is off

    // Video embeds (Vimeo, TikTok, Twitch)
    videoId?: string;

    // SoundCloud specific
    soundcloudUrl?: string;
}

export interface UserProfile {
    // Internal name (not displayed)
    name: string;
    handle: string;
    avatar: string;
    
    // Title & Subtitle (displayed on page, from template_config)
    title: string;
    subtitle: string;
    showTitle?: boolean; // Show/hide title (default: true)
    showSubtitle?: boolean; // Show/hide subtitle (default: true)

    // Design Configuration
    // Can be preset ID or 'custom' or saved theme ID (saved_1, saved_2)
    theme: string;

    // Custom Design Properties - uses extracted interface
    customDesign: CustomDesignConfig;

    // Saved custom themes (max 2) - allows user to save and restore custom designs
    savedCustomThemes?: SavedCustomTheme[];

    // Last custom design backup - restored when switching back to 'custom' from a preset
    lastCustomDesign?: CustomDesignConfig;

    // SEO & Analytics
    seoTitle?: string;
    seoDescription?: string;
    googleAnalyticsId?: string;
    facebookPixelId?: string;

    // Privacy
    isPrivate?: boolean; // Hide profile from search engines (noindex)

    // Verification & Legacy
    isVerified?: boolean; // Shows verified badge
    isLegacy?: boolean; // Shows legacy member badge (migrated from old system)
}

export interface NavItem {
    id: string;
    label: string;
    icon: string;
}
