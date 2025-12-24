<?php

namespace App\Constants;

/**
 * Link group constants for categorizing links.
 */
final class LinkGroups
{
    public const LINKS = 'links';
    public const SOCIALS = 'socials';

    public const ALL = [
        self::LINKS,
        self::SOCIALS,
    ];

    public static function isValid(string $group): bool
    {
        return in_array($group, self::ALL, true);
    }
}

