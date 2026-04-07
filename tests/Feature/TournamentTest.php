<?php

use App\Models\Album;
use App\Models\Tournament;
use App\Models\User;

it('requires auth to create a tournament', function () {
    $this->get('/tournaments/create')->assertRedirect('/login');
    $this->post('/tournaments', ['name' => 'Test'])->assertRedirect('/login');
});

it('shows the create tournament form', function () {
    $this->actingAs(User::factory()->create())
        ->get('/tournaments/create')
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page->component('Tournaments/Create'));
});

it('creates a tournament and redirects to its page', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/tournaments', ['name' => 'Spring Invitational'])
        ->assertRedirect();

    $tournament = Tournament::first();
    expect($tournament)->not->toBeNull();
    expect($tournament->name)->toBe('Spring Invitational');
    expect($tournament->slug)->toBe('spring-invitational');
});

it('validates tournament name is required', function () {
    $this->actingAs(User::factory()->create())
        ->post('/tournaments', ['name' => ''])
        ->assertInvalid(['name']);
});

it('shows a tournament with its albums', function () {
    $tournament = Tournament::factory()->create();
    Album::factory()->for($tournament)->count(3)->create();

    $this->get("/tournaments/{$tournament->id}")
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('Tournaments/Show')
            ->where('tournament.id', $tournament->id)
            ->has('tournament.albums', 3)
        );
});
