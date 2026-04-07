<?php

use App\Models\Album;
use App\Models\AnalyticsEvent;
use App\Models\Photo;
use App\Models\Tournament;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('spaces');
});

it('requires auth to delete a tournament', function () {
    $tournament = Tournament::factory()->create();

    $this->delete("/manage/tournaments/{$tournament->id}")->assertRedirect('/login');
});

it('deletes a tournament and redirects to dashboard', function () {
    $tournament = Tournament::factory()->create();

    $this->actingAs(User::factory()->create())
        ->delete("/manage/tournaments/{$tournament->id}")
        ->assertRedirect(route('dashboard'));

    expect(Tournament::find($tournament->id))->toBeNull();
});

it('deletes all albums and photos when deleting a tournament', function () {
    $tournament = Tournament::factory()->create();
    $album = Album::factory()->for($tournament)->create();
    $photo = Photo::factory()->for($album)->create();

    $this->actingAs(User::factory()->create())
        ->delete("/manage/tournaments/{$tournament->id}");

    expect(Tournament::find($tournament->id))->toBeNull();
    expect(Album::find($album->id))->toBeNull();
    expect(Photo::find($photo->id))->toBeNull();
});

it('deletes all photo files from storage when deleting a tournament', function () {
    $tournament = Tournament::factory()->create();
    $album = Album::factory()->for($tournament)->create();
    $photo = Photo::factory()->for($album)->create();

    Storage::disk('spaces')->put($photo->original_path, 'data');
    Storage::disk('spaces')->put($photo->web_path, 'data');
    Storage::disk('spaces')->put($photo->thumbnail_path, 'data');

    $this->actingAs(User::factory()->create())
        ->delete("/manage/tournaments/{$tournament->id}");

    Storage::disk('spaces')->assertMissing($photo->original_path);
    Storage::disk('spaces')->assertMissing($photo->web_path);
    Storage::disk('spaces')->assertMissing($photo->thumbnail_path);
});

it('cleans up all analytics when deleting a tournament', function () {
    $tournament = Tournament::factory()->create();
    $album = Album::factory()->for($tournament)->create();
    $photo = Photo::factory()->for($album)->create();

    AnalyticsEvent::record(AnalyticsEvent::TOURNAMENT_VIEW, AnalyticsEvent::TRACKABLE_TOURNAMENT, $tournament->id);
    AnalyticsEvent::record(AnalyticsEvent::GAME_VIEW, AnalyticsEvent::TRACKABLE_ALBUM, $album->id);
    AnalyticsEvent::record(AnalyticsEvent::PHOTO_VIEW, AnalyticsEvent::TRACKABLE_PHOTO, $photo->id);

    $this->actingAs(User::factory()->create())
        ->delete("/manage/tournaments/{$tournament->id}");

    expect(AnalyticsEvent::count())->toBe(0);
});
