<?php

namespace App\Http\Controllers;

use App\Models\Landing;
use App\Support\Helpers\StorageHelper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;
use Inertia\Inertia;

class SystemRouterController extends Controller
{
    public function health()
    {
        return response("UP");
    }

    public function privacy()
    {
        return Inertia::render('Privacy');
    }

    public function sitemap()
    {
        $landings = Landing::all();
        $contents = View::make('sitemap', [
            'landings' => $landings,
        ]);
        return response($contents)->header('Content-Type', 'text/xml');
    }

    public function landingView(Request $request, $slug = null)
    {
        $path = $slug ?? $request->path();
        if ($path === '/') $path = '';

        // Try to find landing by domain_name or slug
        $landing = Landing::where("domain_name", $path)
            ->orWhere("slug", $path)
            ->with(["links" => function ($query) {
                $query->where('state', true)->orderBy('order');
            }])
            ->first();

        if ($landing) {
            // Get social links separately
            $socialLinks = $landing->socials()->where('state', true)->orderBy('order')->get();

            // Render with Inertia for React component
            return Inertia::render('LandingView', [
                'landing' => $landing,
                'links' => $landing->links,
                'socialLinks' => $socialLinks,
                'storageUrl' => StorageHelper::baseUrl(),
            ]);
        } else {
            // Fallback to Angular app if exists
            if (file_exists(public_path('index.html'))) {
                return response()->file(public_path('index.html'));
            }
            return abort(404, 'Landing not found');
        }
    }
}
