<?php

use App\Http\Controllers\AlbumController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\PhotoController;
use App\Http\Controllers\TournamentController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'Welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::get('/gallery', [GalleryController::class, 'index'])->name('gallery.index');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'Dashboard')->name('dashboard');

    // Static routes must come before wildcard routes
    Route::get('/tournaments/create', [TournamentController::class, 'create'])->name('tournaments.create');
    Route::post('/tournaments', [TournamentController::class, 'store'])->name('tournaments.store');

    Route::get('/albums/create', [AlbumController::class, 'create'])->name('albums.create');
    Route::post('/albums', [AlbumController::class, 'store'])->name('albums.store');

    Route::post('/albums/{album}/photos/presign', [PhotoController::class, 'presign'])->name('albums.photos.presign');
    Route::post('/albums/{album}/photos/reorder', [PhotoController::class, 'reorder'])->name('albums.photos.reorder');
    Route::post('/albums/{album}/photos', [PhotoController::class, 'store'])->name('albums.photos.store');
    Route::post('/albums/{album}/photos/{photo}/cover', [PhotoController::class, 'setCover'])->name('albums.photos.cover');
    Route::delete('/albums/{album}/photos/{photo}', [PhotoController::class, 'destroy'])->name('albums.photos.destroy');
});

// Wildcard routes registered last so they don't shadow static paths
Route::get('/albums/{album}', [AlbumController::class, 'show'])->name('albums.show');
Route::get('/tournaments/{tournament}', [TournamentController::class, 'show'])->name('tournaments.show');

require __DIR__.'/settings.php';
