<?php

use App\Jobs\ProcessUploadedPhoto;
use App\Models\Album;
use App\Models\Photo;
use App\Models\User;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('spaces');
    Queue::fake();
});

// --- Presign endpoint ---

it('requires auth to request a presigned upload url', function () {
    $album = Album::factory()->create();

    $this->postJson("/albums/{$album->id}/photos/presign", [])
        ->assertUnauthorized();
});

it('returns a presigned url and path', function () {
    $album = Album::factory()->create();

    $response = $this->actingAs(User::factory()->create())
        ->postJson("/albums/{$album->id}/photos/presign", [
            'filename' => 'game.jpg',
            'content_type' => 'image/jpeg',
        ])
        ->assertSuccessful()
        ->assertJsonStructure(['url', 'headers', 'path']);

    expect($response->json('path'))->toStartWith('photos/'.$album->id.'/originals/');
});

it('validates presign content type must be an image mime', function (string $mime) {
    $album = Album::factory()->create();

    $this->actingAs(User::factory()->create())
        ->postJson("/albums/{$album->id}/photos/presign", [
            'filename' => 'file.pdf',
            'content_type' => $mime,
        ])
        ->assertInvalid(['content_type']);
})->with(['application/pdf', 'text/plain', 'video/mp4']);

// --- Confirm / store endpoint ---

it('requires auth to confirm uploads', function () {
    $album = Album::factory()->create();

    $this->post("/albums/{$album->id}/photos", [])
        ->assertRedirect('/login');
});

it('creates photo records and dispatches processing jobs after direct upload', function () {
    $album = Album::factory()->create();

    $confirmed = [
        ['filename' => 'game1.jpg', 'path' => 'photos/'.$album->id.'/originals/uuid-1.jpg'],
        ['filename' => 'game2.jpg', 'path' => 'photos/'.$album->id.'/originals/uuid-2.jpg'],
    ];

    $this->actingAs(User::factory()->create())
        ->post("/albums/{$album->id}/photos", ['photos' => $confirmed])
        ->assertRedirect("/albums/{$album->id}");

    expect(Photo::count())->toBe(2);

    Photo::all()->each(function (Photo $photo) use ($album) {
        expect($photo->album_id)->toBe($album->id);
        expect($photo->web_path)->toBeNull();
        expect($photo->thumbnail_path)->toBeNull();
    });

    Queue::assertPushed(ProcessUploadedPhoto::class, 2);
});

it('validates that at least one confirmed photo is required', function () {
    $album = Album::factory()->create();

    $this->actingAs(User::factory()->create())
        ->post("/albums/{$album->id}/photos", ['photos' => []])
        ->assertInvalid(['photos']);
});

it('validates each confirmed photo has a filename and path', function () {
    $album = Album::factory()->create();

    $this->actingAs(User::factory()->create())
        ->post("/albums/{$album->id}/photos", [
            'photos' => [['filename' => '', 'path' => '']],
        ])
        ->assertInvalid(['photos.0.filename', 'photos.0.path']);
});

// --- Delete endpoint ---

it('requires auth to delete a photo', function () {
    $album = Album::factory()->create();
    $photo = Photo::factory()->for($album)->create();

    $this->delete("/albums/{$album->id}/photos/{$photo->id}")
        ->assertRedirect('/login');
});

it('deletes the photo record and all files from storage', function () {
    $album = Album::factory()->create();
    $photo = Photo::factory()->for($album)->create([
        'original_path' => 'photos/1/originals/test.jpg',
        'web_path' => 'photos/1/web/test.jpg',
        'thumbnail_path' => 'photos/1/thumbnails/test.jpg',
    ]);

    Storage::disk('spaces')->put('photos/1/originals/test.jpg', 'data');
    Storage::disk('spaces')->put('photos/1/web/test.jpg', 'data');
    Storage::disk('spaces')->put('photos/1/thumbnails/test.jpg', 'data');

    $this->actingAs(User::factory()->create())
        ->delete("/albums/{$album->id}/photos/{$photo->id}")
        ->assertRedirect("/albums/{$album->id}");

    $this->assertModelMissing($photo);
    Storage::disk('spaces')->assertMissing('photos/1/originals/test.jpg');
    Storage::disk('spaces')->assertMissing('photos/1/web/test.jpg');
    Storage::disk('spaces')->assertMissing('photos/1/thumbnails/test.jpg');
});

it('deletes a photo that only has an original (not yet processed)', function () {
    $album = Album::factory()->create();
    $photo = Photo::factory()->for($album)->create([
        'original_path' => 'photos/1/originals/test.jpg',
        'web_path' => null,
        'thumbnail_path' => null,
    ]);

    Storage::disk('spaces')->put('photos/1/originals/test.jpg', 'data');

    $this->actingAs(User::factory()->create())
        ->delete("/albums/{$album->id}/photos/{$photo->id}")
        ->assertRedirect("/albums/{$album->id}");

    $this->assertModelMissing($photo);
    Storage::disk('spaces')->assertMissing('photos/1/originals/test.jpg');
});

it('returns 404 when photo does not belong to the album', function () {
    $album = Album::factory()->create();
    $otherAlbum = Album::factory()->create();
    $photo = Photo::factory()->for($otherAlbum)->create();

    $this->actingAs(User::factory()->create())
        ->delete("/albums/{$album->id}/photos/{$photo->id}")
        ->assertNotFound();
});
