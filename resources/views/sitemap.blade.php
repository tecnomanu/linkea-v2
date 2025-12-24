<?= '<?xml version="1.0" encoding="UTF-8"?>'; ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://linkea.ar</loc>
        <lastmod>{{Carbon\Carbon::now()->tz('UTC')->toAtomString()}}</lastmod>
        <priority>0.9</priority>
    </url>    
    <url>
        <loc>https://linkea.ar/home</loc>
        <lastmod>{{Carbon\Carbon::now()->tz('UTC')->toAtomString()}}</lastmod>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>https://linkea.ar/auth/register</loc>
        <lastmod>{{Carbon\Carbon::now()->tz('UTC')->toAtomString()}}</lastmod>
        <priority>0.9</priority>
    </url>  
    <url>
        <loc>https://linkea.ar/auth/login</loc>
        <lastmod>{{Carbon\Carbon::now()->tz('UTC')->toAtomString()}}</lastmod>
        <priority>0.9</priority>
    </url>       
    @foreach ($landings as $landing)
        <url>
            <loc>{{env("APP_URL", "https://linkea.ar")}}/{{ $landing->domain_name }}</loc>
            <lastmod>{{ $landing->updated_at->tz('UTC')->toAtomString() }}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.8</priority>
        </url>
    @endforeach
</urlset>