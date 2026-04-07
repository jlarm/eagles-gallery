<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAlbumRequest;
use App\Models\Album;
use App\Models\AnalyticsEvent;
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

        return redirect()->route('albums.manage', $album);
    }

    public function manage(Album $album): Response
    {
        $album->load(['tournament', 'coverPhoto']);

        $album->setRelation('photos', $album->photos()->addSelect([
            'view_count' => AnalyticsEvent::selectRaw('count(*)')
                ->whereColumn('trackable_id', 'photos.id')
                ->where('event_type', AnalyticsEvent::PHOTO_VIEW)
                ->where('trackable_type', AnalyticsEvent::TRACKABLE_PHOTO),
        ])->get());

        return Inertia::render('Albums/Manage', [
            'album' => $album,
        ]);
    }

    public function destroy(Album $album): RedirectResponse
    {
        $tournamentId = $album->tournament_id;
        $album->delete();

        if ($tournamentId) {
            return redirect()->route('tournaments.manage', $tournamentId);
        }

        return redirect()->route('dashboard');
    }

    public function show(Album $album): Response
    {
        AnalyticsEvent::record(AnalyticsEvent::GAME_VIEW, AnalyticsEvent::TRACKABLE_ALBUM, $album->id);

        return Inertia::render('Albums/Show', [
            'album' => $album->load(['tournament', 'photos', 'coverPhoto']),
        ]);
    }
}
