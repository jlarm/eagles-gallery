<?php

namespace App\Jobs;

use App\Models\Photo;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

class ProcessUploadedPhoto implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public int $timeout = 120;

    public array $backoff = [10, 30, 60];

    public function __construct(public readonly Photo $photo) {}

    public function handle(): void
    {
        $originalContents = Storage::disk('spaces')->get($this->photo->original_path);

        $manager = new ImageManager(new Driver);

        $webPath = $this->variantPath($this->photo->original_path, 'web');
        $thumbnailPath = $this->variantPath($this->photo->original_path, 'thumbnails');

        // Thumbnail first — free it before loading the web version
        $thumbImage = $manager->read($originalContents);
        $thumbImage->scaleDown(width: 400);
        Storage::disk('spaces')->put($thumbnailPath, $thumbImage->toJpeg(quality: 80)->toString(), 'public');
        unset($thumbImage);

        // Web version — re-read from the already-fetched original
        $webImage = $manager->read($originalContents);
        $webImage->scaleDown(width: 1920);
        Storage::disk('spaces')->put($webPath, $webImage->toJpeg(quality: 85)->toString(), 'public');
        unset($webImage, $originalContents);

        $this->photo->update([
            'web_path' => $webPath,
            'thumbnail_path' => $thumbnailPath,
        ]);
    }

    public function failed(\Throwable $exception): void
    {
        report($exception);
    }

    private function variantPath(string $originalPath, string $variant): string
    {
        return str_replace('/originals/', "/{$variant}/", $originalPath);
    }
}
