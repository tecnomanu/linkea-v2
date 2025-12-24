import { LinkBlock } from "@/types";

/**
 * URL validation patterns
 */
const URL_PATTERNS = {
    // Standard URL (http/https)
    http: /^https?:\/\/.+/i,
    // Email link
    mailto: /^mailto:.+@.+\..+/i,
    // Phone link
    tel: /^tel:\+?[\d\s-]+/i,
    // YouTube URL
    youtube:
        /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|v\/|.+\?v=)?([a-zA-Z0-9_-]{11})/i,
    // Spotify URL
    spotify:
        /^(https?:\/\/)?(open\.)?spotify\.com\/(track|album|playlist|artist|episode|show)\/[a-zA-Z0-9]+/i,
    // WhatsApp API URL
    whatsapp: /^https?:\/\/(api\.)?wa\.me\/.+/i,
};

/**
 * Phone number validation (international format)
 * Accepts: +XXXXXXXXXXX, XXXXXXXXXXX (with or without leading +)
 * Min 8 digits, max 15 digits (ITU-T E.164 standard)
 */
const PHONE_PATTERN = /^\+?[1-9]\d{7,14}$/;

/**
 * Hook for validating link data
 */
export const useLinkValidation = () => {
    /**
     * Validates a URL based on common patterns
     * @param url - The URL to validate
     * @returns true if the URL is valid
     */
    const validateUrl = (url: string): boolean => {
        if (!url || url.trim().length === 0) return false;

        const trimmedUrl = url.trim();

        // Check standard protocols
        if (
            URL_PATTERNS.http.test(trimmedUrl) ||
            URL_PATTERNS.mailto.test(trimmedUrl) ||
            URL_PATTERNS.tel.test(trimmedUrl)
        ) {
            return true;
        }

        // Check if it looks like a domain without protocol
        // e.g., "example.com" or "www.example.com"
        const domainPattern = /^(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]*\.[a-zA-Z]{2,}/;
        if (domainPattern.test(trimmedUrl)) {
            return true;
        }

        return false;
    };

    /**
     * Validates a YouTube URL
     * @param url - The URL to validate
     * @returns true if it's a valid YouTube URL
     */
    const validateYoutubeUrl = (url: string): boolean => {
        if (!url) return false;
        return URL_PATTERNS.youtube.test(url.trim());
    };

    /**
     * Validates a Spotify URL
     * @param url - The URL to validate
     * @returns true if it's a valid Spotify URL
     */
    const validateSpotifyUrl = (url: string): boolean => {
        if (!url) return false;
        return URL_PATTERNS.spotify.test(url.trim());
    };

    /**
     * Validates a phone number (international format)
     * @param phone - The phone number to validate
     * @returns true if the phone number is valid
     */
    const validatePhone = (phone: string): boolean => {
        if (!phone) return false;
        // Remove spaces and dashes for validation
        const cleanPhone = phone.replace(/[\s-]/g, "");
        return PHONE_PATTERN.test(cleanPhone);
    };

    /**
     * Checks if a link has the minimum required data to be displayed
     * @param link - The LinkBlock to validate
     * @returns true if the link is complete and valid
     */
    const isLinkComplete = (link: LinkBlock): boolean => {
        // Title is always required (at least 1 character)
        if (!link.title || link.title.trim().length === 0) {
            return false;
        }

        // Validate based on link type
        switch (link.type) {
            case "header":
            case "heading":
                // Headers only need a title
                return true;

            case "whatsapp":
                // WhatsApp needs a valid phone number
                return validatePhone(link.phoneNumber || "");

            case "video":
            case "youtube":
                // YouTube needs a valid YouTube URL
                return validateYoutubeUrl(link.url);

            case "music":
            case "spotify":
                // Spotify needs a valid Spotify URL
                return validateSpotifyUrl(link.url);

            case "link":
            case "button":
            case "classic":
            case "social":
            case "twitter":
            case "mastodon":
            default:
                // Standard links need a valid URL
                return validateUrl(link.url);
        }
    };

    /**
     * Gets validation error message for a link
     * @param link - The LinkBlock to check
     * @returns Error message or null if valid
     */
    const getValidationError = (link: LinkBlock): string | null => {
        if (!link.title || link.title.trim().length === 0) {
            return "El titulo es requerido";
        }

        switch (link.type) {
            case "header":
            case "heading":
                return null;

            case "whatsapp":
                if (!link.phoneNumber) {
                    return "Numero de telefono requerido";
                }
                if (!validatePhone(link.phoneNumber)) {
                    return "Formato de telefono invalido (ej: +5491112345678)";
                }
                return null;

            case "video":
            case "youtube":
                if (!link.url) {
                    return "URL de YouTube requerida";
                }
                if (!validateYoutubeUrl(link.url)) {
                    return "URL de YouTube invalida";
                }
                return null;

            case "music":
            case "spotify":
                if (!link.url) {
                    return "URL de Spotify requerida";
                }
                if (!validateSpotifyUrl(link.url)) {
                    return "URL de Spotify invalida";
                }
                return null;

            default:
                if (!link.url) {
                    return "URL requerida";
                }
                if (!validateUrl(link.url)) {
                    return "URL invalida (debe comenzar con https://)";
                }
                return null;
        }
    };

    /**
     * Normalizes a URL by adding https:// if missing
     * @param url - The URL to normalize
     * @returns Normalized URL
     */
    const normalizeUrl = (url: string): string => {
        if (!url) return "";
        const trimmed = url.trim();

        // Already has protocol
        if (/^(https?|mailto|tel):\/?\/?/i.test(trimmed)) {
            return trimmed;
        }

        // Looks like a domain, add https://
        if (/^(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]*\.[a-zA-Z]{2,}/.test(trimmed)) {
            return `https://${trimmed}`;
        }

        return trimmed;
    };

    return {
        validateUrl,
        validateYoutubeUrl,
        validateSpotifyUrl,
        validatePhone,
        isLinkComplete,
        getValidationError,
        normalizeUrl,
    };
};

// Export individual functions for non-hook usage
export const validateUrl = (url: string): boolean => {
    if (!url || url.trim().length === 0) return false;
    const trimmedUrl = url.trim();
    if (
        URL_PATTERNS.http.test(trimmedUrl) ||
        URL_PATTERNS.mailto.test(trimmedUrl) ||
        URL_PATTERNS.tel.test(trimmedUrl)
    ) {
        return true;
    }
    const domainPattern = /^(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]*\.[a-zA-Z]{2,}/;
    return domainPattern.test(trimmedUrl);
};

export const validatePhone = (phone: string): boolean => {
    if (!phone) return false;
    const cleanPhone = phone.replace(/[\s-]/g, "");
    return PHONE_PATTERN.test(cleanPhone);
};

export const isLinkComplete = (link: LinkBlock): boolean => {
    if (!link.title || link.title.trim().length === 0) return false;

    switch (link.type) {
        case "header":
        case "heading":
            return true;
        case "whatsapp":
            return validatePhone(link.phoneNumber || "");
        case "video":
        case "youtube":
            return URL_PATTERNS.youtube.test(link.url || "");
        case "music":
        case "spotify":
            return URL_PATTERNS.spotify.test(link.url || "");
        default:
            return validateUrl(link.url);
    }
};

