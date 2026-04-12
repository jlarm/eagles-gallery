<?php

use App\Models\Album;
use App\Models\Photo;
use App\Models\Tournament;
use App\Models\User;

it('requires auth to create an album', function () {
    $this->get('/albums/create')->assertRedirect('/login');
    $this->post('/albums', [])->assertRedirect('/login');
});

it('shows the create album form with tournaments', function () {
    Tournament::factory()->count(2)->create();

    $this->actingAs(User::factory()->create())
        ->get('/albums/create')
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('Albums/Create')
            ->has('tournaments', 2)
        );
});

it('creates a standalone album and redirects', function () {
    $this->actingAs(User::factory()->create())
        ->post('/albums', [
            'opponent' => 'Riverside High',
            'date' => '2025-03-15',
        ])
        ->assertRedirect();

    $album = Album::first();
    expect($album->opponent)->toBe('Riverside High');
    expect($album->tournament_id)->toBeNull();
    expect($album->slug)->toBe('riverside-high-2025-03-15');
});

it('creates an album linked to a tournament', function () {
    $tournament = Tournament::factory()->create();

    $this->actingAs(User::factory()->create())
        ->post('/albums', [
            'tournament_id' => $tournament->id,
            'opponent' => 'Westside',
            'date' => '2025-04-01',
        ])
        ->assertRedirect();

    expect(Album::first()->tournament_id)->toBe($tournament->id);
});

it('validates required album fields', function (array $data, string $field) {
    $this->actingAs(User::factory()->create())
        ->post('/albums', $data)
        ->assertInvalid([$field]);
})->with([
    'missing opponent' => [['date' => '2025-01-01'], 'opponent'],
    'missing date' => [['opponent' => 'Rival'], 'date'],
    'invalid date' => [['opponent' => 'Rival', 'date' => 'not-a-date'], 'date'],
]);

it('shows an album with its photos paginated', function () {
    $album = Album::factory()->published()->has(Photo::factory()->count(4))->create();

    $this->get("/albums/{$album->id}")
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('Albums/Show')
            ->where('album.id', $album->id)
            ->has('photos.data', 4)
            ->where('photos.total', 4)
            ->where('photos.per_page', 20)
        );
});

it('paginates album photos at 20 per page', function () {
    $album = Album::factory()->published()->has(Photo::factory()->count(25))->create();

    $this->get("/albums/{$album->id}")
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->where('photos.total', 25)
            ->where('photos.last_page', 2)
            ->has('photos.data', 20)
        );

    $this->get("/albums/{$album->id}?page=2")
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->has('photos.data', 5)
            ->where('photos.current_page', 2)
        );
});

it('returns 404 for a draft album', function () {
    $album = Album::factory()->create(); // draft by default

    $this->get("/albums/{$album->id}")->assertNotFound();
});

it('publishes an album', function () {
    $album = Album::factory()->create();

    $this->actingAs(User::factory()->create())
        ->post("/manage/albums/{$album->id}/publish")
        ->assertRedirect();

    expect($album->fresh()->published_at)->not->toBeNull();
});

it('unpublishes an album', function () {
    $album = Album::factory()->published()->create();

    $this->actingAs(User::factory()->create())
        ->post("/manage/albums/{$album->id}/unpublish")
        ->assertRedirect();

    expect($album->fresh()->published_at)->toBeNull();
});

it('requires auth to publish or unpublish an album', function () {
    $album = Album::factory()->create();

    $this->post("/manage/albums/{$album->id}/publish")->assertRedirect('/login');
    $this->post("/manage/albums/{$album->id}/unpublish")->assertRedirect('/login');
});
