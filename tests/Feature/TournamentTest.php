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

it('shows a published tournament with its published albums', function () {
    $tournament = Tournament::factory()->published()->create();
    Album::factory()->published()->for($tournament)->count(2)->create();
    Album::factory()->for($tournament)->create(); // draft album, should not appear

    $this->get("/tournaments/{$tournament->id}")
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('Tournaments/Show')
            ->where('tournament.id', $tournament->id)
            ->has('tournament.albums', 2)
        );
});

it('returns 404 for a draft tournament', function () {
    $tournament = Tournament::factory()->create(); // draft by default

    $this->get("/tournaments/{$tournament->id}")->assertNotFound();
});

it('publishes a tournament', function () {
    $tournament = Tournament::factory()->create();

    $this->actingAs(User::factory()->create())
        ->post("/manage/tournaments/{$tournament->id}/publish")
        ->assertRedirect();

    expect($tournament->fresh()->published_at)->not->toBeNull();
});

it('unpublishes a tournament', function () {
    $tournament = Tournament::factory()->published()->create();

    $this->actingAs(User::factory()->create())
        ->post("/manage/tournaments/{$tournament->id}/unpublish")
        ->assertRedirect();

    expect($tournament->fresh()->published_at)->toBeNull();
});

it('requires auth to publish or unpublish a tournament', function () {
    $tournament = Tournament::factory()->create();

    $this->post("/manage/tournaments/{$tournament->id}/publish")->assertRedirect('/login');
    $this->post("/manage/tournaments/{$tournament->id}/unpublish")->assertRedirect('/login');
});
