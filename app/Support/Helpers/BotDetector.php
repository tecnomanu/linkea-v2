<?php

namespace App\Support\Helpers;

use Illuminate\Http\Request;

/**
 * Helper class to detect bots, crawlers, and automated traffic.
 * Used to filter out non-human views from statistics.
 */
class BotDetector
{
    /**
     * Common bot User-Agent patterns.
     * Includes search engines, social media crawlers, SEO tools, and monitoring services.
     */
    private const BOT_PATTERNS = [
        // Search engine crawlers
        'googlebot',
        'bingbot',
        'slurp',           // Yahoo
        'duckduckbot',
        'baiduspider',
        'yandexbot',
        'sogou',
        'exabot',
        'ia_archiver',     // Alexa

        // Social media crawlers
        'facebookexternalhit',
        'facebot',
        'twitterbot',
        'linkedinbot',
        'pinterest',
        'whatsapp',
        'telegrambot',
        'discordbot',
        'slackbot',

        // SEO and analytics tools
        'semrushbot',
        'ahrefsbot',
        'mj12bot',         // Majestic
        'dotbot',
        'petalbot',
        'serpstatbot',
        'seokicks',
        'blexbot',

        // Monitoring and uptime services
        'uptimerobot',
        'pingdom',
        'statuscake',
        'site24x7',
        'newrelicpinger',
        'datadog',

        // Generic bot patterns
        'bot',
        'spider',
        'crawler',
        'scraper',
        'headless',
        'phantom',
        'selenium',
        'puppeteer',
        'playwright',
        'curl',
        'wget',
        'python-requests',
        'python-urllib',
        'go-http-client',
        'java/',
        'libwww',
        'httpclient',

        // Preview generators
        'preview',
        'thumbnail',
        'snapshot',

        // Feed readers
        'feedfetcher',
        'feedly',
        'newsblur',

        // Other known bots
        'applebot',
        'archive.org_bot',
        'coccocbot',
        'seznambot',
        'rogerbot',
        'screaming frog',
    ];

    /**
     * Check if the request is from a bot.
     */
    public static function isBot(Request $request): bool
    {
        $userAgent = strtolower($request->userAgent() ?? '');

        // Empty User-Agent is suspicious
        if (empty($userAgent)) {
            return true;
        }

        // Check against bot patterns
        foreach (self::BOT_PATTERNS as $pattern) {
            if (str_contains($userAgent, $pattern)) {
                return true;
            }
        }

        // Additional heuristics

        // Very short User-Agent strings are suspicious
        if (strlen($userAgent) < 20) {
            return true;
        }

        // Missing Accept-Language header (most real browsers send this)
        if (!$request->header('Accept-Language')) {
            return true;
        }

        return false;
    }

    /**
     * Check if the request is from a human (not a bot).
     */
    public static function isHuman(Request $request): bool
    {
        return !self::isBot($request);
    }

    /**
     * Get a simple reason why request was flagged as bot.
     * Useful for debugging.
     */
    public static function getBotReason(Request $request): ?string
    {
        $userAgent = strtolower($request->userAgent() ?? '');

        if (empty($userAgent)) {
            return 'empty_user_agent';
        }

        foreach (self::BOT_PATTERNS as $pattern) {
            if (str_contains($userAgent, $pattern)) {
                return "pattern_match:{$pattern}";
            }
        }

        if (strlen($userAgent) < 20) {
            return 'short_user_agent';
        }

        if (!$request->header('Accept-Language')) {
            return 'missing_accept_language';
        }

        return null;
    }
}
