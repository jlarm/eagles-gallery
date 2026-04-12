<?php

namespace App\Http\Controllers;

use App\Models\Album;
use App\Models\AnalyticsEvent;
use App\Models\Tournament;
use Inertia\Inertia;
use Inertia\Response;

class GalleryController extends Controller
{
    public function home(): Response
    {
        return Inertia::render('Home/Index', $this->galleryData());
    }

    public function index(): Response
    {
        return Inertia::render('Gallery/Index', $this->galleryData());
    }

    /** @return array<string, mixed> */
    private function galleryData(): array
    {
        $isGuest = ! auth()->check();

        return [
            'tournaments' => Tournament::when($isGuest, fn ($q) => $q->published())
                ->withCount(['albums' => fn ($q) => $q->when($isGuest, fn ($q) => $q->published())])
                ->addSelect([
                    'view_count' => AnalyticsEvent::selectRaw('count(*)')
                        ->whereColumn('trackable_id', 'tournaments.id')
                        ->where('trackable_type', AnalyticsEvent::TRACKABLE_TOURNAMENT),
                ])
                ->orderBy('name')
                ->get(),
            'standaloneAlbums' => Album::when($isGuest, fn ($q) => $q->published())
                ->with('coverPhoto')
                ->addSelect([
                    '*',
                    'view_count' => AnalyticsEvent::selectRaw('count(*)')
                        ->whereColumn('trackable_id', 'albums.id')
                        ->where('trackable_type', AnalyticsEvent::TRACKABLE_ALBUM),
                ])
                ->whereNull('tournament_id')
                ->orderBy('date', 'desc')
                ->get(),
        ];
    }
}
