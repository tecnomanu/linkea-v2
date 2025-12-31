<?php

namespace App\Http\Controllers;

use App\Http\Middleware\HandleSeoMeta;
use App\Http\Resources\PublicLandingResource;
use App\Models\Landing;
use App\Services\LandingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;
use Inertia\Inertia;

class SystemRouterController extends Controller
{
    public function __construct(
        protected LandingService $landingService
    ) {}

    public function health()
    {
        return response("UP");
    }

    /**
     * Serve the llm.txt file for AI agents context.
     */
    public function llmContext()
    {
        $filePath = public_path('llm.txt');

        if (file_exists($filePath)) {
            return response()->file($filePath, [
                'Content-Type' => 'text/plain; charset=UTF-8',
            ]);
        }

        return response("# Linkea.ar - No llm.txt found", 404)
            ->header('Content-Type', 'text/plain');
    }

    public function privacy()
    {
        return Inertia::render('Privacy')->withViewData([
            'seo' => HandleSeoMeta::buildMeta([
                'title' => 'Politica de Privacidad - Linkea',
                'description' => 'Conoce nuestra politica de privacidad y como protegemos tus datos en Linkea.',
                'url' => config('app.url') . '/privacy',
                'type' => 'website',
            ]),
        ]);
    }

    public function sitemap()
    {
        $landings = $this->landingService->getAllVerified();

        $contents = View::make('sitemap', [
            'landings' => $landings,
        ]);

        return response($contents)->header('Content-Type', 'text/xml');
    }

    public function landingView(Request $request, $slug = null)
    {
        $path = $slug ?? $request->path();
        if ($path === '/') $path = '';

        $landing = $this->landingService->findBySlugOrDomainWithLinks($path);

        if ($landing) {
            $resource = new PublicLandingResource($landing);
            $data = $resource->resolve();

            // Build SEO meta for crawlers
            $seoImage = $data['seoImage'] ?? null;
            if ($seoImage && !str_starts_with($seoImage, 'http')) {
                $seoImage = config('app.url') . $seoImage;
            }

            $isPrivate = $data['isPrivate'] ?? false;
            $handle = $data['slug'] ?? $data['domain_name'] ?? $path;

            return Inertia::render('LandingView', [
                'landing' => $data,
            ])->withViewData([
                'seo' => HandleSeoMeta::buildMeta([
                    'title' => ($data['seoTitle'] ?? $data['name'] ?? 'Landing') . ' | Linkea',
                    'description' => $data['seoDescription'] ?? "Links de {$data['name']} - Creado con Linkea",
                    'image' => $seoImage,
                    'url' => config('app.url') . '/' . $handle,
                    'type' => 'profile',
                    'robots' => $isPrivate ? 'noindex, nofollow' : 'index, follow',
                ]),
            ]);
        }

        // Fallback to Angular app if exists
        if (file_exists(public_path('index.html'))) {
            return response()->file(public_path('index.html'));
        }

        return abort(404, 'Landing not found');
    }
}
