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

it('requires auth to delete an album', function () {
    $album = Album::factory()->create();

    $this->delete("/manage/albums/{$album->id}")->assertRedirect('/login');
});

it('deletes a standalone album and redirects to dashboard', function () {
    $album = Album::factory()->create();

    $this->actingAs(User::factory()->create())
        ->delete("/manage/albums/{$album->id}")
        ->assertRedirect(route('dashboard'));

    expect(Album::find($album->id))->toBeNull();
});

it('deletes a tournament album and redirects to tournament manage page', function () {
    $tournament = Tournament::factory()->create();
    $album = Album::factory()->for($tournament)->create();

    $this->actingAs(User::factory()->create())
        ->delete("/manage/albums/{$album->id}")
        ->assertRedirect(route('tournaments.manage', $tournament));

    expect(Album::find($album->id))->toBeNull();
});

it('deletes all photo files from storage when deleting an album', function () {
    $album = Album::factory()->create();
    $photo = Photo::factory()->for($album)->create();

    Storage::disk('spaces')->put($photo->original_path, 'data');
    Storage::disk('spaces')->put($photo->web_path, 'data');
    Storage::disk('spaces')->put($photo->thumbnail_path, 'data');

    $this->actingAs(User::factory()->create())
        ->delete("/manage/albums/{$album->id}");

    Storage::disk('spaces')->assertMissing($photo->original_path);
    Storage::disk('spaces')->assertMissing($photo->web_path);
    Storage::disk('spaces')->assertMissing($photo->thumbnail_path);
});

it('cleans up photo and album analytics when deleting an album', function () {
    $album = Album::factory()->create();
    $photo = Photo::factory()->for($album)->create();

    AnalyticsEvent::record(AnalyticsEvent::PHOTO_VIEW, AnalyticsEvent::TRACKABLE_PHOTO, $photo->id);
    AnalyticsEvent::record(AnalyticsEvent::GAME_VIEW, AnalyticsEvent::TRACKABLE_ALBUM, $album->id);

    $this->actingAs(User::factory()->create())
        ->delete("/manage/albums/{$album->id}");

    expect(AnalyticsEvent::count())->toBe(0);
});
