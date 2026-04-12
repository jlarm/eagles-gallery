<?php

use App\Models\Album;
use App\Models\Tournament;
use App\Models\User;

it('shows the gallery index', function () {
    Tournament::factory()->published()->create();
    Album::factory()->published()->create();

    $this->get('/gallery')
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('Gallery/Index')
            ->has('tournaments', 1)
            ->has('standaloneAlbums', 1)
        );
});

it('separates tournament albums from standalone albums', function () {
    $tournament = Tournament::factory()->published()->create();
    Album::factory()->published()->for($tournament)->create();
    $standalone = Album::factory()->published()->create();

    $this->get('/gallery')
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->where('tournaments.0.id', $tournament->id)
            ->where('standaloneAlbums.0.id', $standalone->id)
        );
});

it('hides draft tournaments and standalone albums from guests', function () {
    Tournament::factory()->create(); // draft
    Album::factory()->create(); // draft standalone

    $this->get('/gallery')
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->has('tournaments', 0)
            ->has('standaloneAlbums', 0)
        );
});

it('shows draft tournaments and standalone albums to authenticated users', function () {
    Tournament::factory()->create(); // draft
    Album::factory()->create(); // draft standalone

    $this->actingAs(User::factory()->create())
        ->get('/gallery')
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->has('tournaments', 1)
            ->has('standaloneAlbums', 1)
        );
});
