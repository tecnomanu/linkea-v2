<?php

namespace App\Http\Controllers;

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

        return Inertia::render('Web/Home', [
            'featuredLandings' => $featuredLandings,
        ]);
    }
}
