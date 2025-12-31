<?php

namespace App\Http\Controllers;

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
        ]);
    }
}
