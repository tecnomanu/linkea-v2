<?php

namespace App\Constants;

/**
 * Block/Link type constants used throughout the application.
 * Maps to legacy blockTypes.constants.ts
 */
final class BlockTypes
{
    // Standard links
    public const LINK = 'link';
    public const BUTTON = 'button';
    public const CLASSIC = 'classic';

    // Headers
    public const HEADER = 'header';
    public const HEADING = 'heading';

    // Social
    public const SOCIAL = 'social';

    // Embeds
    public const YOUTUBE = 'youtube';
    public const SPOTIFY = 'spotify';
    public const SOUNDCLOUD = 'soundcloud';
    public const TIKTOK = 'tiktok';
    public const TWITCH = 'twitch';

    // Messaging
    public const WHATSAPP = 'whatsapp';
    public const EMAIL = 'email';          // TODO: implement full block

    // Scheduling & Leads
    public const CALENDAR = 'calendar';    // Calendly, Cal.com, Acuity, etc.

    // Contact & Forms
    public const MAP = 'map';              // TODO: implement full block
    public const CONTACT = 'contact';      // TODO: implement full block

    // Legacy/other
    public const MASTODON = 'mastodon';
    public const TWITTER = 'twitter';
    public const VIDEO = 'video';
    public const MUSIC = 'music';
    public const VIMEO = 'vimeo';          // TODO: implement full block

    /**
     * All valid block types
     */
    public const ALL = [
        self::LINK,
        self::BUTTON,
        self::CLASSIC,
        self::HEADER,
        self::HEADING,
        self::SOCIAL,
        self::YOUTUBE,
        self::SPOTIFY,
        self::SOUNDCLOUD,
        self::TIKTOK,
        self::TWITCH,
        self::VIMEO,
        self::WHATSAPP,
        self::EMAIL,
        self::CALENDAR,
        self::MAP,
        self::CONTACT,
        self::MASTODON,
        self::TWITTER,
        self::VIDEO,
        self::MUSIC,
    ];

    /**
     * Types that require a URL
     */
    public const REQUIRES_URL = [
        self::LINK,
        self::BUTTON,
        self::CLASSIC,
        self::SOCIAL,
        self::YOUTUBE,
        self::SPOTIFY,
        self::SOUNDCLOUD,
        self::TIKTOK,
        self::TWITCH,
        self::VIMEO,
        self::CALENDAR,  // Calendar URL (Calendly, Cal.com, etc.)
        self::MASTODON,
        self::TWITTER,
    ];

    /**
     * Types that are embeddable media
     */
    public const EMBEDDABLE = [
        self::YOUTUBE,
        self::SPOTIFY,
        self::SOUNDCLOUD,
        self::TIKTOK,
        self::TWITCH,
        self::VIMEO,
        self::CALENDAR,  // Calendar can be embedded inline
        self::MAP,       // Maps are embedded
    ];

    public static function isValid(string $type): bool
    {
        return in_array($type, self::ALL, true);
    }

    public static function requiresUrl(string $type): bool
    {
        return in_array($type, self::REQUIRES_URL, true);
    }

    public static function isEmbeddable(string $type): bool
    {
        return in_array($type, self::EMBEDDABLE, true);
    }
}

