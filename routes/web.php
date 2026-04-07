<?php

use App\Http\Controllers\AlbumController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\PhotoController;
use App\Http\Controllers\TournamentController;
use Illuminate\Support\Facades\Route;

Route::get('/', [GalleryController::class, 'home'])->name('home');

Route::get('/gallery', [GalleryController::class, 'index'])->name('gallery.index');

Route::post('/analytics/track', [AnalyticsController::class, 'track'])
    ->name('analytics.track')
    ->middleware('throttle:60,1');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Static routes must come before wildcard routes
    Route::get('/tournaments/create', [TournamentController::class, 'create'])->name('tournaments.create');
    Route::post('/tournaments', [TournamentController::class, 'store'])->name('tournaments.store');
    Route::get('/manage/tournaments/{tournament}', [TournamentController::class, 'manage'])->name('tournaments.manage');
    Route::delete('/manage/tournaments/{tournament}', [TournamentController::class, 'destroy'])->name('tournaments.destroy');

    Route::get('/albums/create', [AlbumController::class, 'create'])->name('albums.create');
    Route::post('/albums', [AlbumController::class, 'store'])->name('albums.store');
    Route::get('/manage/albums/{album}', [AlbumController::class, 'manage'])->name('albums.manage');
    Route::delete('/manage/albums/{album}', [AlbumController::class, 'destroy'])->name('albums.destroy');

    Route::post('/albums/{album}/photos/presign', [PhotoController::class, 'presign'])->name('albums.photos.presign');
    Route::post('/albums/{album}/photos/reorder', [PhotoController::class, 'reorder'])->name('albums.photos.reorder');
    Route::post('/albums/{album}/photos', [PhotoController::class, 'store'])->name('albums.photos.store');
    Route::post('/albums/{album}/photos/{photo}/cover', [PhotoController::class, 'setCover'])->name('albums.photos.cover');
    Route::delete('/albums/{album}/photos/{photo}', [PhotoController::class, 'destroy'])->name('albums.photos.destroy');
});

// Wildcard routes registered last so they don't shadow static paths
Route::get('/albums/{album}', [AlbumController::class, 'show'])->name('albums.show');
Route::get('/albums/{album}/photos/{photo}/download', [PhotoController::class, 'download'])->name('albums.photos.download');
Route::get('/tournaments/{tournament}', [TournamentController::class, 'show'])->name('tournaments.show');

require __DIR__.'/settings.php';
