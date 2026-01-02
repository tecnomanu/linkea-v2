<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        {{-- 
            Minimal blade for public landing pages.
            Uses a separate, smaller JS bundle (landing.tsx instead of app.tsx).
            No shared props beyond what the landing needs.
        --}}
        @php
            use App\Constants\SeoDefaults;
            
            $seo = $seo ?? [];
            $seoTitle = $seo['title'] ?? SeoDefaults::DEFAULT_TITLE;
            $seoDescription = $seo['description'] ?? SeoDefaults::DEFAULT_DESCRIPTION;
            $seoImage = $seo['image'] ?? SeoDefaults::imageUrl(SeoDefaults::DEFAULT_OG_IMAGE);
            $seoUrl = $seo['url'] ?? url()->current();
            $seoType = $seo['type'] ?? 'profile';
            $seoRobots = $seo['robots'] ?? 'index, follow';
            $seoCanonical = $seo['canonical'] ?? $seoUrl;
        @endphp

        <title inertia>{{ $seoTitle }}</title>
        <meta name="description" content="{{ $seoDescription }}">
        <meta name="robots" content="{{ $seoRobots }}">

        {{-- Open Graph --}}
        <meta property="og:type" content="{{ $seoType }}">
        <meta property="og:site_name" content="{{ SeoDefaults::SITE_NAME }}">
        <meta property="og:locale" content="{{ SeoDefaults::LOCALE }}">
        <meta property="og:url" content="{{ $seoUrl }}">
        <meta property="og:title" content="{{ $seoTitle }}">
        <meta property="og:description" content="{{ $seoDescription }}">
        <meta property="og:image" content="{{ $seoImage }}">
        <meta property="og:image:width" content="{{ SeoDefaults::OG_IMAGE_WIDTH }}">
        <meta property="og:image:height" content="{{ SeoDefaults::OG_IMAGE_HEIGHT }}">

        {{-- Twitter Card --}}
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ $seoTitle }}">
        <meta name="twitter:description" content="{{ $seoDescription }}">
        <meta name="twitter:image" content="{{ $seoImage }}">

        {{-- Canonical URL --}}
        <link rel="canonical" href="{{ $seoCanonical }}">
        
        {{-- Favicons --}}
        <link rel="icon" type="image/png" sizes="32x32" href="{{ SeoDefaults::FAVICON }}">
        <link rel="shortcut icon" href="{{ SeoDefaults::FAVICON }}">
        <link rel="apple-touch-icon" sizes="180x180" href="{{ SeoDefaults::APPLE_TOUCH_ICON }}">
        
        {{-- Theme color --}}
        <meta name="theme-color" content="{{ SeoDefaults::THEME_COLOR }}">
        
        {{-- Fonts - Optimized async loading --}}
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Inter:wght@300;400;500;600;700&display=swap">
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
        <noscript>
            <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        </noscript>

        {{-- Minimal scripts - no @routes needed for public landings --}}
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/landing.tsx'])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
