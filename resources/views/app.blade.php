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
        --}}
        @php
            $seo = $seo ?? [];
            $seoTitle = $seo['title'] ?? config('app.name', 'Linkea');
            $seoDescription = $seo['description'] ?? 'Crea tu pagina de links personalizada gratis. Comparte todos tus enlaces en un solo lugar con Linkea.';
            $seoImage = $seo['image'] ?? url('/assets/images/meta_tag_image.jpg');
            $seoUrl = $seo['url'] ?? url()->current();
            $seoType = $seo['type'] ?? 'website';
            $seoRobots = $seo['robots'] ?? 'index, follow';
            $seoCanonical = $seo['canonical'] ?? $seoUrl;
            
            // Ensure absolute URLs
            if (!str_starts_with($seoImage, 'http')) {
                $seoImage = url($seoImage);
            }
        @endphp

        <title>{{ $seoTitle }}</title>
        <meta name="description" content="{{ $seoDescription }}">
        <meta name="robots" content="{{ $seoRobots }}">

        {{-- Open Graph / Facebook --}}
        <meta property="og:type" content="{{ $seoType }}">
        <meta property="og:site_name" content="Linkea">
        <meta property="og:locale" content="es_AR">
        <meta property="og:url" content="{{ $seoUrl }}">
        <meta property="og:title" content="{{ $seoTitle }}">
        <meta property="og:description" content="{{ $seoDescription }}">
        <meta property="og:image" content="{{ $seoImage }}">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="630">

        {{-- Twitter Card --}}
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ $seoTitle }}">
        <meta name="twitter:description" content="{{ $seoDescription }}">
        <meta name="twitter:image" content="{{ $seoImage }}">

        {{-- Canonical URL --}}
        <link rel="canonical" href="{{ $seoCanonical }}">
        
        {{-- Favicons --}}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
        <link rel="shortcut icon" href="/favicon-32x32.png">
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
        
        {{-- Theme color for mobile browsers --}}
        <meta name="theme-color" content="#f97316">
        <meta name="msapplication-TileColor" content="#f97316">
        
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
