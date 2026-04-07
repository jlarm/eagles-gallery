<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAlbumRequest;
use App\Models\Album;
use App\Models\Tournament;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AlbumController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Albums/Create', [
            'tournaments' => Tournament::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(StoreAlbumRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $album = Album::create([
            'tournament_id' => $validated['tournament_id'] ?? null,
            'opponent' => $validated['opponent'],
            'date' => $validated['date'],
            'slug' => Str::slug($validated['opponent'].'-'.$validated['date']),
        ]);

        return redirect()->route('albums.show', $album);
    }

    public function show(Album $album): Response
    {
        return Inertia::render('Albums/Show', [
            'album' => $album->load(['tournament', 'photos', 'coverPhoto']),
        ]);
    }
}
