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

    public function show(Tournament $tournament): Response
    {
        AnalyticsEvent::record(AnalyticsEvent::TOURNAMENT_VIEW, AnalyticsEvent::TRACKABLE_TOURNAMENT, $tournament->id);

        return Inertia::render('Tournaments/Show', [
            'tournament' => $tournament->load('albums.coverPhoto'),
        ]);
    }
}
