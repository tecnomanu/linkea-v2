<?php

namespace App\Http\Controllers\Panel;

use App\Http\Controllers\Controller;
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

    public function profile(): Response|RedirectResponse
    {
        return $this->renderView('profile');
    }

    public function ai(): Response|RedirectResponse
    {
        return $this->renderView('ai');
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

        $links = $landing
            ? $this->linkService->getBlockLinksWithStats($landing->id)
            : collect();

        $socialLinks = $landing
            ? $this->linkService->getSocialLinks($landing->id)
            : collect();

        // Get dashboard stats only for dashboard tab (lazy load for performance)
        $dashboardStats = ($activeTab === 'dashboard' && $landing)
            ? $this->statisticsService->getLandingDashboardStats($landing->id)
            : null;

        return Inertia::render('Panel/Dashboard', [
            'landing' => $landing,
            'links' => $links,
            'socialLinks' => $socialLinks,
            'auth' => ['user' => $user],
            'activeTab' => $activeTab,
            'dashboardStats' => $dashboardStats,
        ]);
    }
}
