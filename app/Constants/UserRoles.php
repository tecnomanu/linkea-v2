<?php

namespace App\Constants;

/**
 * User role type constants.
 */
final class UserRoles
{
    public const ROOT = 'root';
    public const ADMIN = 'admin';
    public const USER = 'user';

    public const ALL = [
        self::ROOT,
        self::ADMIN,
        self::USER,
    ];

    /**
     * Roles with administrative privileges
     */
    public const PRIVILEGED = [
        self::ROOT,
        self::ADMIN,
    ];

    public static function isValid(string $role): bool
    {
        return in_array($role, self::ALL, true);
    }

    public static function isPrivileged(string $role): bool
    {
        return in_array($role, self::PRIVILEGED, true);
    }
}

