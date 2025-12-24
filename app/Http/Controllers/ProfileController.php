<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function show($slug)
    {
        return Inertia::render('Profile/Show', [
            'slug' => $slug,
        ]);
    }
}
