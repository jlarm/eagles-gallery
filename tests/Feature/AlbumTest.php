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

it('shows an album with its photos', function () {
    $album = Album::factory()->has(Photo::factory()->count(4))->create();

    $this->get("/albums/{$album->id}")
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('Albums/Show')
            ->where('album.id', $album->id)
            ->has('album.photos', 4)
        );
});
