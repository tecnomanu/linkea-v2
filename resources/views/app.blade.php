<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        {{-- 
            SEO Meta Tags - Rendered server-side for social media crawlers.
            These are required because Facebook, Twitter, etc. don't execute JavaScript.
            React components (SEOHead) will also render these for client-side navigation.
            
            Values come from SeoDefaults::forPage() or SeoDefaults::forLanding()
            passed via withViewData() in controllers.
        --}}
        @php
            use App\Constants\SeoDefaults;
            
            $seo = $seo ?? [];
            $seoTitle = $seo['title'] ?? SeoDefaults::DEFAULT_TITLE;
            $seoDescription = $seo['description'] ?? SeoDefaults::DEFAULT_DESCRIPTION;
            $seoImage = $seo['image'] ?? SeoDefaults::imageUrl(SeoDefaults::DEFAULT_OG_IMAGE);
            $seoUrl = $seo['url'] ?? url()->current();
            $seoType = $seo['type'] ?? 'website';
            $seoRobots = $seo['robots'] ?? 'index, follow';
            $seoCanonical = $seo['canonical'] ?? $seoUrl;
        @endphp

        <title>{{ $seoTitle }}</title>
        <meta name="description" content="{{ $seoDescription }}">
        <meta name="robots" content="{{ $seoRobots }}">

        {{-- Open Graph / Facebook --}}
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
        
        {{-- Theme color for mobile browsers --}}
        <meta name="theme-color" content="{{ SeoDefaults::THEME_COLOR }}">
        <meta name="msapplication-TileColor" content="{{ SeoDefaults::MS_TILE_COLOR }}">
        
        {{-- hreflang - Currently Spanish only --}}
        <link rel="alternate" hreflang="es" href="{{ url()->current() }}">
        <link rel="alternate" hreflang="x-default" href="{{ url()->current() }}">
        
        {{-- Fonts --}}
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

        {{-- Scripts --}}
        @routes
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx'])
        @inertiaHead
        
        {{-- Theme initialization (prevent flash) --}}
        <script>
            const savedTheme = localStorage.getItem('darkMode');
            if (savedTheme === 'true') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        </script>
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
