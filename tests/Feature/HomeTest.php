<?php

use App\Models\Album;
use App\Models\Tournament;

it('renders the home page with gallery data', function () {
    Tournament::factory()->published()->create();
    Album::factory()->published()->create();

    $this->get('/')
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('Home/Index')
            ->has('tournaments', 1)
            ->has('standaloneAlbums', 1)
        );
});

it('separates tournament albums from standalone albums on home page', function () {
    $tournament = Tournament::factory()->published()->create();
    Album::factory()->published()->for($tournament)->create();
    $standalone = Album::factory()->published()->create();

    $this->get('/')
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('Home/Index')
            ->has('tournaments', 1)
            ->has('standaloneAlbums', 1)
            ->where('standaloneAlbums.0.id', $standalone->id)
        );
});
