<?php

namespace App\Http\Controllers;

use App\Http\Middleware\HandleSeoMeta;
use App\Http\Resources\FeaturedLandingResource;
use App\Services\LandingService;
use Inertia\Inertia;

class WebController extends Controller
{
    public function __construct(
        protected LandingService $landingService
    ) {}

    public function index()
    {
        $featuredLandings = $this->landingService->getFeaturedForHomepage(5);

        // Get stats with fallback in case of DB errors
        try {
            $stats = $this->landingService->getPublicStats();
        } catch (\Throwable) {
            $stats = null;
        }

        return Inertia::render('Web/Home', [
            'featuredLandings' => FeaturedLandingResource::collection($featuredLandings)->resolve(),
            'stats' => $stats,
        ])->withViewData([
            'seo' => HandleSeoMeta::buildMeta([
                'title' => 'Linkea - Todos tus enlaces en un solo lugar | Link in Bio Argentina',
                'description' => 'Crea tu pagina de links personalizada gratis. Comparte todos tus enlaces en un solo lugar con Linkea, la mejor alternativa argentina a Linktree. 100% gratis, sin limites.',
                'image' => '/assets/images/meta_tag_image.jpg',
                'url' => config('app.url'),
                'type' => 'website',
            ]),
        ]);
    }

    /**
     * Gallery page - shows all public landings with search and pagination.
     */
    public function gallery()
    {
        $search = request()->query('search');
        $page = (int) request()->query('page', 1);

        $result = $this->landingService->getAllPublicLandings(30, $search);

        return Inertia::render('Web/Gallery', [
            'landings' => FeaturedLandingResource::collection($result['data'])->resolve(),
            'meta' => $result['meta'],
            'filters' => [
                'search' => $search,
            ],
        ])->withViewData([
            'seo' => HandleSeoMeta::buildMeta([
                'title' => 'Galeria de Linkeas - Descubre perfiles inspiradores',
                'description' => 'Explora la galeria de Linkea y descubre perfiles creativos de la comunidad. Inspira tu propio diseno viendo los mejores ejemplos de link in bio.',
                'image' => '/assets/images/meta_tag_image.jpg',
                'url' => config('app.url') . '/gallery',
                'type' => 'website',
            ]),
        ]);
    }
}
