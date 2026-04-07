<?php

namespace App\Http\Controllers;

use App\Models\Album;
use App\Models\AnalyticsEvent;
use App\Models\Photo;
use App\Models\Tournament;
use Carbon\CarbonInterface;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $since14 = now()->subDays(14)->startOfDay();
        $since30 = now()->subDays(30)->startOfDay();

        return Inertia::render('Dashboard', [
            'stats' => $this->stats($since30),
            'activityChart' => $this->activityChart($since14),
            'topTournaments' => $this->topItems(AnalyticsEvent::TRACKABLE_TOURNAMENT, AnalyticsEvent::TOURNAMENT_VIEW, $since14),
            'topGames' => $this->topGames($since14),
            'topDownloads' => $this->topItems(AnalyticsEvent::TRACKABLE_PHOTO, AnalyticsEvent::DOWNLOAD, $since14),
        ]);
    }

    /** @return array<string, int> */
    private function stats(CarbonInterface $since): array
    {
        return [
            'total_photos' => Photo::count(),
            'total_albums' => Album::count(),
            'total_tournaments' => Tournament::count(),
            'downloads_30d' => AnalyticsEvent::where('event_type', AnalyticsEvent::DOWNLOAD)
                ->where('created_at', '>=', $since)
                ->count(),
            'photo_views_30d' => AnalyticsEvent::where('event_type', AnalyticsEvent::PHOTO_VIEW)
                ->where('created_at', '>=', $since)
                ->count(),
            'game_views_30d' => AnalyticsEvent::where('event_type', AnalyticsEvent::GAME_VIEW)
                ->where('created_at', '>=', $since)
                ->count(),
        ];
    }

    /**
     * Returns daily counts per event type for the last 14 days.
     *
     * @return array<int, array{date: string, tournament_view: int, game_view: int, photo_view: int, download: int}>
     */
    private function activityChart(CarbonInterface $since): array
    {
        $rows = AnalyticsEvent::where('created_at', '>=', $since)
            ->select(
                DB::raw('DATE(created_at) as date'),
                'event_type',
                DB::raw('COUNT(*) as count'),
            )
            ->groupBy('date', 'event_type')
            ->orderBy('date')
            ->get()
            ->groupBy('date');

        $days = collect();
        for ($i = 13; $i >= 0; $i--) {
            $days->push(now()->subDays($i)->format('Y-m-d'));
        }

        return $days->map(function (string $date) use ($rows) {
            $byType = $rows->get($date, collect())->keyBy('event_type');

            return [
                'date' => $date,
                'tournament_view' => (int) ($byType->get('tournament_view')?->count ?? 0),
                'game_view' => (int) ($byType->get('game_view')?->count ?? 0),
                'photo_view' => (int) ($byType->get('photo_view')?->count ?? 0),
                'download' => (int) ($byType->get('download')?->count ?? 0),
            ];
        })->values()->all();
    }

    /**
     * @return array<int, array{id: int, label: string, count: int}>
     */
    private function topItems(string $trackableType, string $eventType, CarbonInterface $since): array
    {
        $counts = AnalyticsEvent::where('event_type', $eventType)
            ->where('trackable_type', $trackableType)
            ->where('created_at', '>=', $since)
            ->select('trackable_id', DB::raw('COUNT(*) as count'))
            ->groupBy('trackable_id')
            ->orderByDesc('count')
            ->limit(5)
            ->pluck('count', 'trackable_id');

        if ($trackableType === AnalyticsEvent::TRACKABLE_TOURNAMENT) {
            $labels = Tournament::whereIn('id', $counts->keys())->pluck('name', 'id');
        } else {
            $labels = Photo::whereIn('id', $counts->keys())->pluck('filename', 'id');
        }

        return $counts->map(fn ($count, $id) => [
            'id' => $id,
            'label' => $labels->get($id, "#{$id}"),
            'count' => (int) $count,
        ])->values()->all();
    }

    /**
     * @return array<int, array{id: int, label: string, count: int}>
     */
    private function topGames(CarbonInterface $since): array
    {
        $counts = AnalyticsEvent::where('event_type', AnalyticsEvent::GAME_VIEW)
            ->where('trackable_type', 'album')
            ->where('created_at', '>=', $since)
            ->select('trackable_id', DB::raw('COUNT(*) as count'))
            ->groupBy('trackable_id')
            ->orderByDesc('count')
            ->limit(5)
            ->pluck('count', 'trackable_id');

        $albums = Album::whereIn('id', $counts->keys())->get()->keyBy('id');

        return $counts->map(fn ($count, $id) => [
            'id' => $id,
            'label' => $albums->has($id) ? 'vs '.$albums[$id]->opponent : "#{$id}",
            'count' => (int) $count,
        ])->values()->all();
    }
}
