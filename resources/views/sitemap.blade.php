<?= '<?xml version="1.0" encoding="UTF-8"?>'; ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    {{-- Main pages --}}
    <url>
        <loc>{{ config('app.url', 'https://linkea.ar') }}</loc>
        <lastmod>{{ Carbon\Carbon::now()->tz('UTC')->toAtomString() }}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>{{ config('app.url', 'https://linkea.ar') }}/auth/register</loc>
        <lastmod>{{ Carbon\Carbon::now()->tz('UTC')->toAtomString() }}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>{{ config('app.url', 'https://linkea.ar') }}/auth/login</loc>
        <lastmod>{{ Carbon\Carbon::now()->tz('UTC')->toAtomString() }}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>{{ config('app.url', 'https://linkea.ar') }}/privacy</loc>
        <lastmod>{{ Carbon\Carbon::now()->tz('UTC')->toAtomString() }}</lastmod>
        <changefreq>yearly</changefreq>
        <priority>0.3</priority>
    </url>
    
    {{-- Public landing pages (verified only) --}}
    @foreach ($landings as $landing)
    @if($landing->slug)
    <url>
        <loc>{{ config('app.url', 'https://linkea.ar') }}/{{ $landing->slug }}</loc>
        <lastmod>{{ $landing->updated_at->tz('UTC')->toAtomString() }}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
    </url>
    @endif
    @endforeach
</urlset>
