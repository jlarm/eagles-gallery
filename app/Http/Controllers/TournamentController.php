<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTournamentRequest;
use App\Models\AnalyticsEvent;
use App\Models\Tournament;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class TournamentController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Tournaments/Create');
    }

    public function store(StoreTournamentRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $tournament = Tournament::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
        ]);

        return redirect()->route('tournaments.manage', $tournament);
    }

    public function manage(Tournament $tournament): Response
    {
        return Inertia::render('Tournaments/Manage', [
            'tournament' => $tournament->load('albums.coverPhoto'),
        ]);
    }

    public function destroy(Tournament $tournament): RedirectResponse
    {
        $tournament->delete();

        return redirect()->route('dashboard');
    }

    public function publish(Tournament $tournament): RedirectResponse
    {
        $tournament->publish();

        return back();
    }

    public function unpublish(Tournament $tournament): RedirectResponse
    {
        $tournament->unpublish();

        return back();
    }

    public function show(Tournament $tournament): Response
    {
        abort_if(! $tournament->isPublished(), 404);

        AnalyticsEvent::record(AnalyticsEvent::TOURNAMENT_VIEW, AnalyticsEvent::TRACKABLE_TOURNAMENT, $tournament->id);

        return Inertia::render('Tournaments/Show', [
            'tournament' => $tournament->load([
                'albums' => fn ($q) => $q->published()->orderBy('date'),
                'albums.coverPhoto',
            ]),
        ]);
    }
}
