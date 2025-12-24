export type BlockType = 
    // Standard link types
    | 'link'        // Standard link
    | 'button'      // Button link (legacy)
    | 'classic'     // Classic link (legacy)
    // Headers
    | 'header'      // Section header
    | 'heading'     // Heading (legacy name)
    // Social
    | 'social'      // Social media icon
    // Embeds
    | 'youtube'     // YouTube embed
    | 'spotify'     // Spotify embed
    | 'soundcloud'  // SoundCloud embed
    | 'tiktok'      // TikTok embed
    | 'twitch'      // Twitch embed
    | 'vimeo'       // Vimeo embed (TODO: implement full block)
    // Messaging
    | 'whatsapp'    // WhatsApp link
    | 'email'       // Email mailto link (TODO: implement full block)
    // Scheduling & Leads
    | 'calendar'    // Calendar/Booking embed (Calendly, Cal.com, etc.)
    // Contact & Forms
    | 'map'         // Google Maps embed (TODO: implement full block)
    | 'contact'     // Contact form (TODO: implement full block)
    // Legacy/other
    | 'mastodon'    // Mastodon
    | 'twitter'     // Twitter (legacy)
    | 'video'       // Video (legacy)
    | 'music';      // Music (legacy)

export type HeaderSize = 'small' | 'medium' | 'large';
export type PlayerSize = 'normal' | 'compact';
export type CalendarProvider = 'calendly' | 'cal' | 'acuity' | 'other';
export type CalendarDisplayMode = 'button' | 'inline'; // button = link to external, inline = embed

export type ButtonStyle = 'solid' | 'outline' | 'soft' | 'hard';
export type ButtonShape = 'sharp' | 'rounded' | 'pill';
export type FontPair = 'modern' | 'elegant' | 'mono';

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
  
  // Media specific (YouTube/Spotify)
  showInlinePlayer?: boolean;
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
  mapDisplayMode?: 'button' | 'inline';
  
  // Video embeds (Vimeo, TikTok, Twitch)
  videoId?: string;
  
  // SoundCloud specific
  soundcloudUrl?: string;
}

export interface UserProfile {
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  
  // Design Configuration
  theme: 'custom' | 'white' | 'sunset' | 'ocean' | 'midnight' | 'forest' | 'candy';
  
  // Custom Design Properties
  customDesign: {
      backgroundColor: string;
      backgroundImage?: string | { image?: string }; // CSS string or {image: 'path'}
      backgroundAttachment?: 'fixed' | 'scroll'; // scroll for preview, can be fixed for public
      backgroundSize?: string;
      backgroundPosition?: string;
      backgroundRepeat?: string;
      
      // Legacy background editor props
      backgroundProps?: Record<string, string | number>; // color1, color2, opacity, scale, etc.
      backgroundControls?: {
          hideBgColor?: boolean;
          colors?: string[];
          scale?: { min: number; max: number; default: number; aspectRatio?: boolean };
          opacity?: { default: number };
          rotationBg?: { min: number; max: number; default: number };
      };
      
      buttonStyle: ButtonStyle;
      buttonShape: ButtonShape;
      buttonColor: string;
      buttonTextColor: string;
      
      // Button icon options
      showButtonIcons?: boolean; // true = show icons in buttons (default: true)
      buttonIconAlignment?: 'left' | 'inline' | 'right'; // left = separate column, inline = with text, right = absolute right
      
      // Link subtext (URL/description) display
      showLinkSubtext?: boolean; // false = hide URL/subtext under link title (default: false)
      
      fontPair: FontPair;
      
      // Text color for the landing page content (headings, bio, etc.)
      // If not set, will be auto-calculated based on background contrast
      textColor?: string;
      
      roundedAvatar?: boolean; // true = round, false = square (default: true)
  };

  // SEO & Analytics
  seoTitle?: string;
  seoDescription?: string;
  googleAnalyticsId?: string;
  facebookPixelId?: string;
  
  // Verification & Legacy
  isVerified?: boolean;  // Shows verified badge
  isLegacy?: boolean;    // Shows legacy member badge (migrated from old system)
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
}
