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
    | Sender.net Email Marketing Integration
    |--------------------------------------------------------------------------
    |
    | Configuration for Sender.net API integration.
    | Get your API token from: https://app.sender.net/settings/tokens
    |
    | Groups are resolved dynamically by name and cached.
    | Available groups: users, newsletter, anonymous
    |
    */
    'sendernet' => [
        'enabled' => env('SENDERNET_ENABLED', true),
        'api_token' => env('SENDERNET_API_TOKEN'),

        // Cache duration for group IDs (in seconds)
        // Default: 24 hours
        'cache_ttl' => env('SENDERNET_CACHE_TTL', 86400),
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

    /*
    |--------------------------------------------------------------------------
    | Groq AI Integration
    |--------------------------------------------------------------------------
    |
    | Groq provides fast LLM inference with OpenAI-compatible API.
    | Get your API key from: https://console.groq.com
    |
    */
    'groq' => [
        'api_key' => env('GROQ_API_KEY'),
    ],

];
