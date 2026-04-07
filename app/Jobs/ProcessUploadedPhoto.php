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

    public array $backoff = [10, 30, 60];

    public function __construct(public readonly Photo $photo) {}

    public function handle(): void
    {
        $originalContents = Storage::disk('spaces')->get($this->photo->original_path);

        $manager = new ImageManager(new Driver);
        $image = $manager->read($originalContents);

        $webPath = $this->variantPath($this->photo->original_path, 'web');
        $thumbnailPath = $this->variantPath($this->photo->original_path, 'thumbnails');

        // Web version: max 1920px wide, maintain aspect ratio
        $webImage = clone $image;
        $webImage->scaleDown(width: 1920);
        Storage::disk('spaces')->put($webPath, $webImage->toJpeg(quality: 85)->toString(), 'public');

        // Thumbnail: max 400px wide, maintain aspect ratio
        $thumbImage = clone $image;
        $thumbImage->scaleDown(width: 400);
        Storage::disk('spaces')->put($thumbnailPath, $thumbImage->toJpeg(quality: 80)->toString(), 'public');

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
