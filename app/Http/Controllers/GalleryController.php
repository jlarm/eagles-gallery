<?php

namespace App\Http\Controllers;

use App\Models\Album;
use App\Models\Tournament;
use Inertia\Inertia;
use Inertia\Response;

class GalleryController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Gallery/Index', [
            'tournaments' => Tournament::withCount('albums')->orderBy('name')->get(),
            'standaloneAlbums' => Album::with('coverPhoto')
                ->whereNull('tournament_id')
                ->orderBy('date', 'desc')
                ->get(),
        ]);
    }
}
