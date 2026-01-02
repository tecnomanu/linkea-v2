<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'mautic' => [
        'enabled' => env('MAUTIC_ENABLED', false),
        'api_url' => env('MAUTIC_APIURL'),
        'username' => env('MAUTIC_USERNAME'),
        'password' => env('MAUTIC_PASSWORD'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Sender.net Configuration
    |--------------------------------------------------------------------------
    |
    | Unified configuration for Sender.net integration.
    | Get your API token from: https://app.sender.net/settings/tokens
    |
    | Uses:
    | - SenderNetService: For subscriber management (add/update/sync users, groups, tags)
    | - Laravel Mail Transport: For transactional emails (weekly reports, notifications)
    |   Configured in config/sender.php - uses the same SENDER_API_KEY
    |
    | To send transactional emails: Mail::mailer('sender')->send(...)
    | To manage subscribers: app(SenderNetService::class)->addSubscriber($user)
    |
    */
    'sendernet' => [
        'enabled' => env('SENDER_ENABLED', true),
        'api_token' => env('SENDER_API_KEY'),

        // Cache duration for group IDs (in seconds)
        // Default: 24 hours
        'cache_ttl' => env('SENDER_CACHE_TTL', 86400),
    ],

    /*
    |--------------------------------------------------------------------------
    | Social Identity Providers
    |--------------------------------------------------------------------------
    */

    'google' => [
        'client_id' => env('GOOGLE_CLIENT_ID'),
        'client_secret' => env('GOOGLE_CLIENT_SECRET'),
        'redirect' => env('GOOGLE_REDIRECT_URL'),
    ],

    'apple' => [
        'client_id' => env('APPLE_CLIENT_ID'),
        'client_secret' => env('APPLE_CLIENT_SECRET'),
        'redirect' => env('APPLE_REDIRECT_URL'),
    ],

];
