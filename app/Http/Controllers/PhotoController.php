<?php

namespace App\Http\Controllers;

use App\Http\Requests\PresignPhotoRequest;
use App\Http\Requests\StorePhotosRequest;
use App\Jobs\ProcessUploadedPhoto;
use App\Models\Album;
use App\Models\Photo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PhotoController extends Controller
{
    public function presign(PresignPhotoRequest $request, Album $album): JsonResponse
    {
        $validated = $request->validated();
        $extension = pathinfo($validated['filename'], PATHINFO_EXTENSION) ?: 'jpg';
        $path = 'photos/'.$album->id.'/originals/'.Str::uuid().'.'.$extension;

        ['url' => $url, 'headers' => $headers] = Storage::disk('spaces')->temporaryUploadUrl(
            $path,
            now()->addMinutes(15),
            ['ContentType' => $validated['content_type']],
        );

        return response()->json([
            'url' => $url,
            'headers' => $headers,
            'path' => $path,
        ]);
    }

    public function setCover(Album $album, Photo $photo): RedirectResponse
    {
        abort_unless($photo->album_id === $album->id, 404);

        DB::transaction(function () use ($album, $photo) {
            $album->photos()->update(['is_cover' => false]);

            if (! $photo->is_cover) {
                $photo->update(['is_cover' => true]);
            }
        });

        return redirect()->route('albums.show', $album);
    }

    public function store(StorePhotosRequest $request, Album $album): RedirectResponse
    {
        foreach ($request->validated()['photos'] as $confirmed) {
            $photo = $album->photos()->create([
                'filename' => $confirmed['filename'],
                'original_path' => $confirmed['path'],
            ]);

            ProcessUploadedPhoto::dispatch($photo);
        }

        return redirect()->route('albums.show', $album);
    }

    public function destroy(Album $album, Photo $photo): RedirectResponse
    {
        abort_unless($photo->album_id === $album->id, 404);

        $paths = array_filter([
            $photo->original_path,
            $photo->web_path,
            $photo->thumbnail_path,
        ]);

        $photo->delete();

        Storage::disk('spaces')->delete($paths);

        return redirect()->route('albums.show', $album);
    }
}
