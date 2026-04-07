<?php

use App\Models\Album;
use App\Models\Tournament;

it('shows the gallery index', function () {
    Tournament::factory()->create();
    Album::factory()->create();

    $this->get('/gallery')
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('Gallery/Index')
            ->has('tournaments', 1)
            ->has('standaloneAlbums', 1)
        );
});

it('separates tournament albums from standalone albums', function () {
    $tournament = Tournament::factory()->create();
    Album::factory()->for($tournament)->create();
    $standalone = Album::factory()->create();

    $this->get('/gallery')
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->where('tournaments.0.id', $tournament->id)
            ->where('standaloneAlbums.0.id', $standalone->id)
        );
});
