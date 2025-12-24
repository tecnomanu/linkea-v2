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

    // Legacy/other
    public const MASTODON = 'mastodon';
    public const TWITTER = 'twitter';
    public const VIDEO = 'video';
    public const MUSIC = 'music';

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
        self::WHATSAPP,
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

