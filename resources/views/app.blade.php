<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        {{-- Title handled by Inertia --}}
        <title inertia>{{ config('app.name', 'Linkea') }}</title>

        {{-- 
            SEO Meta Tags are handled by each React page via <Head> component.
            See: SEOHead.tsx, WebLayout.tsx, LandingView.tsx
        --}}

        {{-- 
            Favicons are handled by React components (SEOHead, LandingView)
            This allows per-landing custom favicons using user's logo
        --}}
        
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
