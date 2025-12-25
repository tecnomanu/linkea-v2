/**
 * Block Configuration - Single source of truth for all block types
 *
 * This file centralizes all block-related configuration to avoid duplication
 * and make maintenance easier. Any change here propagates to:
 * - BlockSelector.tsx (block picker)
 * - LinkCard.tsx (link list item display)
 * - LinksTab.tsx (default values on creation)
 * - LandingContent.tsx (public rendering)
 *
 * When adding a new block type:
 * 1. Add entry to BLOCK_TYPES below
 * 2. Add validation in useLinkValidation.ts
 * 3. Create config component in configs/
 * 4. Create renderer in blocks/
 * 5. Update backend SaveLinksRequest.php
 */

import { BlockType, LinkBlock } from "@/types";
import {
    AtSign,
    Calendar,
    Clapperboard,
    Ghost,
    Globe,
    Headphones,
    Link,
    LucideIcon,
    Mail,
    MapPin,
    MessageCircle,
    Music,
    Tv,
    Type,
    Video,
    Youtube,
} from "lucide-react";

/**
 * Map of Lucide icon names to their components
 * Used for dynamic icon rendering based on saved icon name
 */
export const LUCIDE_ICONS: Record<string, LucideIcon> = {
    link: Link,
    type: Type,
    "message-circle": MessageCircle,
    youtube: Youtube,
    video: Video,
    music: Music,
    ghost: Ghost,
    calendar: Calendar,
    mail: Mail,
    "at-sign": AtSign,
    "map-pin": MapPin,
    clapperboard: Clapperboard,
    headphones: Headphones,
    tv: Tv,
    globe: Globe,
};

/**
 * Get a Lucide icon component by name
 * Returns Globe as fallback if not found
 */
export function getLucideIcon(name: string): LucideIcon {
    return LUCIDE_ICONS[name] || Globe;
}

/**
 * Configuration interface for a block type
 */
export interface BlockTypeConfig {
    // Display
    label: string;
    description: string;

    // Icon (Lucide icon component)
    icon: LucideIcon;
    iconName: string; // For serialization to DB

    // Styling
    colorClass: string; // Background color for icon container
    badgeClass: string; // Badge styling in link list

    // Behavior
    hidden?: boolean; // Hide from block selector
    hideUrlInput?: boolean; // Don't show URL input in LinkCard

    // Input placeholders
    titlePlaceholder: string;
    urlPlaceholder?: string;

    // Default values when creating a new block
    defaults: Partial<LinkBlock>;
}

/**
 * All block type configurations
 */
export const BLOCK_TYPES: Record<BlockType, BlockTypeConfig> = {
    // Standard link
    link: {
        label: "Enlace",
        description: "Link a cualquier URL",
        icon: Link,
        iconName: "link",
        colorClass: "bg-orange-500 text-white",
        badgeClass:
            "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
        titlePlaceholder: "Titulo del enlace",
        urlPlaceholder: "https://ejemplo.com",
        defaults: {
            title: "",
            url: "https://",
        },
    },

    // Header/Section divider
    header: {
        label: "Cabecera",
        description: "Texto separador de seccion",
        icon: Type,
        iconName: "type",
        colorClass: "bg-neutral-800 text-white dark:bg-neutral-700",
        badgeClass:
            "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
        hideUrlInput: true,
        titlePlaceholder: "Titulo de seccion",
        defaults: {
            title: "Nueva seccion",
            url: "",
        },
    },

    // WhatsApp
    whatsapp: {
        label: "WhatsApp",
        description: "Iniciar una conversacion",
        icon: MessageCircle,
        iconName: "message-circle",
        colorClass: "bg-green-500 text-white",
        badgeClass:
            "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        hideUrlInput: true,
        titlePlaceholder: "Texto del boton (ej: Escribinos)",
        defaults: {
            title: "Escribinos por WhatsApp",
            url: "",
            phoneNumber: "",
            predefinedMessage: "",
        },
    },

    // YouTube
    youtube: {
        label: "Video YouTube",
        description: "Insertar un video",
        icon: Video,
        iconName: "youtube",
        colorClass: "bg-red-600 text-white",
        badgeClass:
            "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        titlePlaceholder: "Titulo del video",
        urlPlaceholder: "URL de YouTube",
        defaults: {
            title: "",
            url: "",
            showInlinePlayer: true,
            autoPlay: false,
            startMuted: true,
        },
    },

    // Spotify
    spotify: {
        label: "Spotify",
        description: "Insertar cancion o album",
        icon: Music,
        iconName: "music",
        colorClass: "bg-emerald-500 text-white",
        badgeClass:
            "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
        titlePlaceholder: "Titulo de la cancion",
        urlPlaceholder: "URL de Spotify",
        defaults: {
            title: "",
            url: "",
            showInlinePlayer: true,
            playerSize: "normal" as const,
        },
    },

    // Mastodon
    mastodon: {
        label: "Mastodon",
        description: "Verificar tu perfil",
        icon: Ghost,
        iconName: "ghost",
        colorClass: "bg-indigo-600 text-white",
        badgeClass:
            "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
        titlePlaceholder: "Nombre del perfil",
        urlPlaceholder: "URL de Mastodon",
        defaults: {
            title: "",
            url: "",
        },
    },

    // Calendar (Calendly, Cal.com, Acuity)
    calendar: {
        label: "Calendario",
        description: "Agendar citas y reuniones",
        icon: Calendar,
        iconName: "calendar",
        colorClass: "bg-blue-600 text-white",
        badgeClass:
            "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        hideUrlInput: true,
        titlePlaceholder: "Agendar Cita",
        defaults: {
            title: "Agendar Cita",
            url: "",
            calendarProvider: "calendly" as const,
            calendarDisplayMode: "button" as const,
        },
    },

    // Email
    email: {
        label: "Email",
        description: "Recibir mensajes por correo",
        icon: Mail,
        iconName: "mail",
        colorClass: "bg-sky-500 text-white",
        badgeClass:
            "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
        hideUrlInput: true,
        titlePlaceholder: "Contactame",
        defaults: {
            title: "Contactame",
            url: "",
            emailAddress: "",
            emailSubject: "",
            emailBody: "",
        },
    },

    // Map
    map: {
        label: "Mapa",
        description: "Mostrar tu ubicacion",
        icon: MapPin,
        iconName: "map-pin",
        colorClass: "bg-rose-500 text-white",
        badgeClass:
            "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
        hideUrlInput: true,
        titlePlaceholder: "Nuestra Ubicacion",
        defaults: {
            title: "Nuestra Ubicacion",
            url: "",
            mapAddress: "",
            mapZoom: 15,
            mapDisplayMode: "button" as const,
        },
    },

    // Vimeo
    vimeo: {
        label: "Vimeo",
        description: "Insertar video de Vimeo",
        icon: Video,
        iconName: "video",
        colorClass: "bg-cyan-600 text-white",
        badgeClass:
            "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
        titlePlaceholder: "Titulo del video",
        urlPlaceholder: "URL de Vimeo",
        defaults: {
            title: "",
            url: "",
            showInlinePlayer: true,
        },
    },

    // TikTok
    tiktok: {
        label: "TikTok",
        description: "Insertar video de TikTok",
        icon: Clapperboard,
        iconName: "clapperboard",
        colorClass: "bg-black text-white",
        badgeClass:
            "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
        titlePlaceholder: "Titulo del video",
        urlPlaceholder: "URL de TikTok",
        defaults: {
            title: "",
            url: "",
            showInlinePlayer: false,
        },
    },

    // SoundCloud
    soundcloud: {
        label: "SoundCloud",
        description: "Insertar audio de SoundCloud",
        icon: Headphones,
        iconName: "headphones",
        colorClass: "bg-orange-500 text-white",
        badgeClass:
            "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
        titlePlaceholder: "Titulo del audio",
        urlPlaceholder: "URL de SoundCloud",
        defaults: {
            title: "",
            url: "",
            showInlinePlayer: true,
        },
    },

    // Twitch
    twitch: {
        label: "Twitch",
        description: "Mostrar canal en vivo",
        icon: Tv,
        iconName: "tv",
        colorClass: "bg-purple-600 text-white",
        badgeClass:
            "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
        titlePlaceholder: "Canal de Twitch",
        urlPlaceholder: "URL o nombre del canal",
        defaults: {
            title: "",
            url: "",
            showInlinePlayer: false,
        },
    },

    // Social (hidden from selector, used for social bar)
    social: {
        label: "Icono Social",
        description: "Enlace a red social",
        icon: Link,
        iconName: "link",
        colorClass: "bg-blue-500 text-white",
        badgeClass:
            "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        hidden: true,
        titlePlaceholder: "",
        defaults: {},
    },

    // Legacy aliases (hidden, map to new types)
    button: {
        label: "Enlace",
        description: "Link a cualquier URL",
        icon: Link,
        iconName: "link",
        colorClass: "bg-orange-500 text-white",
        badgeClass:
            "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
        hidden: true,
        titlePlaceholder: "Titulo del enlace",
        urlPlaceholder: "https://ejemplo.com",
        defaults: {},
    },
    heading: {
        label: "Cabecera",
        description: "Texto separador de seccion",
        icon: Type,
        iconName: "type",
        colorClass: "bg-neutral-800 text-white dark:bg-neutral-700",
        badgeClass:
            "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
        hidden: true,
        hideUrlInput: true,
        titlePlaceholder: "Titulo de seccion",
        defaults: {},
    },
    video: {
        label: "Video YouTube",
        description: "Insertar un video",
        icon: Video,
        iconName: "video",
        colorClass: "bg-red-600 text-white",
        badgeClass:
            "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        hidden: true,
        titlePlaceholder: "Titulo del video",
        urlPlaceholder: "URL de YouTube",
        defaults: {},
    },
    music: {
        label: "Spotify",
        description: "Insertar cancion o album",
        icon: Music,
        iconName: "music",
        colorClass: "bg-emerald-500 text-white",
        badgeClass:
            "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
        hidden: true,
        titlePlaceholder: "Titulo de la cancion",
        urlPlaceholder: "URL de Spotify",
        defaults: {},
    },
    twitter: {
        label: "Twitter",
        description: "Enlace a Twitter",
        icon: Link,
        iconName: "link",
        colorClass: "bg-sky-500 text-white",
        badgeClass:
            "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
        hidden: true,
        titlePlaceholder: "Titulo del tweet",
        urlPlaceholder: "URL del Tweet",
        defaults: {},
    },
    classic: {
        label: "Enlace",
        description: "Link a cualquier URL",
        icon: Link,
        iconName: "link",
        colorClass: "bg-orange-500 text-white",
        badgeClass:
            "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
        hidden: true,
        titlePlaceholder: "Titulo del enlace",
        urlPlaceholder: "https://ejemplo.com",
        defaults: {},
    },
    contact: {
        label: "Contacto",
        description: "Formulario de contacto",
        icon: Mail,
        iconName: "mail",
        colorClass: "bg-sky-500 text-white",
        badgeClass:
            "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
        hidden: true,
        titlePlaceholder: "Contacto",
        defaults: {},
    },
};

/**
 * Get configuration for a block type with fallback
 */
export function getBlockConfig(type: BlockType | string): BlockTypeConfig {
    return BLOCK_TYPES[type as BlockType] || BLOCK_TYPES.link;
}

/**
 * Get visible block types for the selector (excludes hidden)
 */
export function getVisibleBlockTypes(): BlockType[] {
    return (Object.keys(BLOCK_TYPES) as BlockType[]).filter(
        (type) => !BLOCK_TYPES[type].hidden
    );
}

/**
 * Create default values for a new block
 */
export function createBlockDefaults(type: BlockType): Partial<LinkBlock> {
    const config = getBlockConfig(type);
    return {
        ...config.defaults,
        icon: { type: "lucide", name: config.iconName },
    };
}

/**
 * Check if a block type should show URL input
 */
export function shouldShowUrlInput(type: BlockType): boolean {
    return !getBlockConfig(type).hideUrlInput;
}
