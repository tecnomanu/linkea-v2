<?php

namespace App\Http\Controllers\Panel;

use App\Http\Controllers\Controller;
use App\Http\Resources\PanelLandingResource;
use App\Services\LandingService;
use App\Services\LinkService;
use App\Services\StatisticsService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PanelController extends Controller
{
    public function __construct(
        protected LandingService $landingService,
        protected LinkService $linkService,
        protected StatisticsService $statisticsService
    ) {}

    public function index(): Response|RedirectResponse
    {
        return $this->renderView('dashboard');
    }

    public function links(): Response|RedirectResponse
    {
        return $this->renderView('links');
    }

    public function design(): Response|RedirectResponse
    {
        return $this->renderView('appearance');
    }

    public function settings(): Response|RedirectResponse
    {
        return $this->renderView('settings');
    }

    /**
     * Profile page - Handles authenticated user profile (NOT landing)
     * Separated from main Dashboard as it doesn't need landing data or preview.
     */
    public function profile(): Response|RedirectResponse
    {
        $user = auth()->user();

        if (!$user) {
            return redirect()->route('login');
        }

        // Eager load roles to ensure role_name accessor works
        $user->load('roles');

        return Inertia::render('Panel/Profile', [
            'auth' => ['user' => $user],
        ]);
    }

    protected function renderView(string $activeTab): Response|RedirectResponse
    {
        $user = auth()->user();

        if (!$user) {
            return redirect()->route('login');
        }

        // Eager load roles to ensure role_name accessor works
        $user->load('roles');

        $landings = $this->landingService->getByUserId($user->id);
        $landing = $landings->first();

        // OPTIMIZATION: Single query for all links, then separate by group in memory
        // Only load stats for the 'links' tab where sparklines are visible
        $shouldLoadStats = $activeTab === 'links';

        $allLinks = $landing
            ? ($shouldLoadStats
                ? $this->linkService->getAllLinksWithStats($landing->id)
                : $this->linkService->getForLanding($landing->id))
            : collect();

        // Separate links and socials from the same collection (zero additional queries)
        $links = $allLinks->where('group', 'links')->values();
        $socialLinks = $allLinks->where('group', 'socials')->values();

        // Get dashboard stats only for dashboard tab (lazy load for performance)
        // OPTIMIZATION: Stats are now cached for 5 minutes
        $dashboardStats = ($activeTab === 'dashboard' && $landing)
            ? $this->statisticsService->getLandingDashboardStats($landing->id)
            : null;

        // Transform landing data using PanelLandingResource for consistency
        // The Resource includes links and socialLinks already transformed
        $landingData = $landing
            ? PanelLandingResource::withLinks($landing, $links, $socialLinks)
            : null;

        return Inertia::render('Panel/Dashboard', [
            'landing' => $landingData,
            'auth' => ['user' => $user],
            'activeTab' => $activeTab,
            'dashboardStats' => $dashboardStats,
        ]);
    }
}
