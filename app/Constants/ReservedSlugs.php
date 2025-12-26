<?php

namespace App\Constants;

/**
 * Reserved slugs that cannot be used as usernames or landing slugs.
 * These include system routes, common words, and offensive terms.
 */
final class ReservedSlugs
{
    /**
     * System and route reserved words.
     */
    public const SYSTEM = [
        // Routes
        'admin',
        'api',
        'auth',
        'login',
        'logout',
        'register',
        'panel',
        'dashboard',
        'settings',
        'profile',
        'account',
        'user',
        'users',
        'landing',
        'landings',
        'link',
        'links',
        'design',
        'preview',
        'embed',
        'widget',
        'export',
        'import',
        'download',
        'upload',

        // Legal/Info
        'privacy',
        'terms',
        'tos',
        'about',
        'contact',
        'help',
        'support',
        'faq',
        'blog',
        'news',

        // System
        'root',
        'system',
        'null',
        'undefined',
        'www',
        'mail',
        'email',
        'smtp',
        'ftp',
        'cdn',
        'static',
        'assets',
        'images',
        'css',
        'js',
        'fonts',

        // Brand protection
        'linkea',
        'linktree',
        'beacons',
        'bio',
        'linkinbio',
    ];

    /**
     * Offensive or inappropriate words (basic list).
     */
    public const INAPPROPRIATE = [
        'admin',
        'administrator',
        'moderator',
        'mod',
        'staff',
        'official',
        'verified',
        'security',
        'soporte',
        'ayuda',
    ];

    /**
     * Get all reserved slugs.
     */
    public static function all(): array
    {
        return array_unique(array_merge(
            self::SYSTEM,
            self::INAPPROPRIATE
        ));
    }

    /**
     * Check if a slug is reserved.
     */
    public static function isReserved(string $slug): bool
    {
        return in_array(strtolower($slug), self::all(), true);
    }
}
