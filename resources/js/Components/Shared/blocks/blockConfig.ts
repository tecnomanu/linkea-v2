/**
 * Block Configuration - Single source of truth for all block types
 *
 * This file contains ONLY configuration data. Icon utilities are in hooks/useBlockIcon.ts
 *
 * When adding a new block type:
 * 1. Add entry to BLOCK_TYPES below
 * 2. Add validation in hooks/useLinkValidation.ts
 * 3. Create config component in configs/
 * 4. Create renderer in blocks/
 * 5. Update backend SaveLinksRequest.php
 */

import { IconType } from "@/constants/icons";
import { renderBlockTypeIcon as renderBlockTypeIconFromHook } from "@/hooks/useBlockIcon";
import { BlockType, LinkBlock } from "@/types";
import React from "react";
import {
    AtSign,
    Calendar,
    Clapperboard,
    Ghost,
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
} from "lucide-react";

/**
 * Configuration interface for a block type
 */
export interface BlockTypeConfig {
    // Display
    label: string;
    description: string;

    // Icon configuration
    icon: LucideIcon; // Lucide component for React rendering
    iconName: string; // Name for serialization/SVG lookup
    iconCategory: IconType | "lucide"; // Where to find the icon

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
        description: "Link clasico a cualquier sitio web",
        icon: Link,
        iconName: "link",
        iconCategory: "lucide",
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
        label: "Encabezado",
        description: "Organiza tu pagina con secciones",
        icon: Type,
        iconName: "type",
        iconCategory: "lucide",
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
        description: "Boton directo a tu chat",
        icon: MessageCircle,
        iconName: "whatsapp",
        iconCategory: "brands",
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
        label: "YouTube",
        description: "Embebe videos con reproductor",
        icon: Video,
        iconName: "youtube",
        iconCategory: "brands",
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
        description: "Reproductor integrado de musica",
        icon: Music,
        iconName: "spotify",
        iconCategory: "brands",
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
        iconName: "mastodon",
        iconCategory: "brands",
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
        description: "Agenda reuniones con Calendly o Cal.com",
        icon: Calendar,
        iconName: "calendar",
        iconCategory: "lucide",
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
        description: "Boton de contacto con email prellenado",
        icon: Mail,
        iconName: "mail",
        iconCategory: "lucide",
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
        description: "Muestra tu ubicacion con Google Maps",
        icon: MapPin,
        iconName: "map-pin",
        iconCategory: "lucide",
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
        iconName: "vimeo",
        iconCategory: "brands",
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
        description: "Embebe videos de TikTok",
        icon: Clapperboard,
        iconName: "tiktok",
        iconCategory: "brands",
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
        iconName: "soundcloud",
        iconCategory: "brands",
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
        description: "Muestra tu canal en vivo",
        icon: Tv,
        iconName: "twitch",
        iconCategory: "brands",
        colorClass: "bg-purple-600 text-white",
        badgeClass:
            "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
        titlePlaceholder: "Canal de Twitch",
        urlPlaceholder: "URL o nombre del canal",
        defaults: {
            title: "Mi Canal de Twitch",
            url: "",
            showInlinePlayer: true,
        },
    },

    // Social (hidden from selector, used for social bar)
    social: {
        label: "Icono Social",
        description: "Enlace a red social",
        icon: Link,
        iconName: "link",
        iconCategory: "lucide",
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
        iconCategory: "lucide",
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
        iconCategory: "lucide",
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
        iconName: "youtube",
        iconCategory: "brands",
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
        iconName: "spotify",
        iconCategory: "brands",
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
        iconName: "twitter",
        iconCategory: "brands",
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
        iconCategory: "lucide",
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
        iconCategory: "lucide",
        colorClass: "bg-sky-500 text-white",
        badgeClass:
            "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
        hidden: true,
        titlePlaceholder: "Contacto",
        defaults: {},
    },
};

// ============================================================================
// Helper Functions
// ============================================================================

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
 * Icon is saved as { type: iconCategory, name: iconName }
 */
export function createBlockDefaults(type: BlockType): Partial<LinkBlock> {
    const config = getBlockConfig(type);
    return {
        ...config.defaults,
        icon: { type: config.iconCategory, name: config.iconName },
    };
}

/**
 * Check if a block type should show URL input
 */
export function shouldShowUrlInput(type: BlockType): boolean {
    return !getBlockConfig(type).hideUrlInput;
}

// ============================================================================
// Web Features (for home page)
// ============================================================================

/**
 * Block types to show in web home features section
 * Ordered by marketing importance
 */
export const WEB_FEATURED_BLOCK_TYPES: BlockType[] = [
    "youtube",
    "twitch",
    "spotify",
    "calendar",
    "whatsapp",
    "map",
    "link",
    "email",
    "header",
];

/**
 * Generate feature data for web home from config
 */
export function getWebFeatures() {
    return WEB_FEATURED_BLOCK_TYPES.map((type) => {
        const config = getBlockConfig(type);
        return {
            id: type,
            title: config.label,
            desc: config.description,
            icon: config.icon,
            iconName: config.iconName,
            iconCategory: config.iconCategory,
            colorClass: config.colorClass,
        };
    });
}

// ============================================================================
// Icon Rendering
// ============================================================================

/**
 * Render the default icon for a block type
 * Convenience wrapper that looks up the config automatically
 *
 * @param type - Block type
 * @param size - Icon size in pixels
 * @param className - Additional CSS classes
 * @param forceWhite - Force white color (for colored backgrounds)
 */
export function renderBlockTypeIcon(
    type: BlockType,
    size = 24,
    className = "",
    forceWhite = true
): React.ReactNode {
    const config = getBlockConfig(type);
    return renderBlockTypeIconFromHook(
        {
            iconCategory: config.iconCategory,
            iconName: config.iconName,
            icon: config.icon,
            label: config.label,
        },
        size,
        className,
        forceWhite
    );
}

