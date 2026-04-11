<?php

namespace App\Jobs;

use App\Models\Photo;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
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
        $context = ['photo_id' => $this->photo->id, 'filename' => $this->photo->filename, 'attempt' => $this->attempts()];

        Log::info('ProcessUploadedPhoto: starting', $context);

        Log::info('ProcessUploadedPhoto: downloading original from Spaces', $context);
        $originalContents = Storage::disk('spaces')->get($this->photo->original_path);

        if ($originalContents === null) {
            throw new \RuntimeException("Original file not found in Spaces: {$this->photo->original_path}");
        }

        Log::info('ProcessUploadedPhoto: downloaded original', array_merge($context, ['bytes' => strlen($originalContents)]));

        $manager = new ImageManager(new Driver);

        $webPath = $this->variantPath($this->photo->original_path, 'web');
        $thumbnailPath = $this->variantPath($this->photo->original_path, 'thumbnails');

        Log::info('ProcessUploadedPhoto: creating thumbnail', $context);
        $thumbImage = $manager->read($originalContents);
        $thumbImage->scaleDown(width: 400);
        $thumbJpeg = $thumbImage->toJpeg(quality: 80)->toString();
        Storage::disk('spaces')->put($thumbnailPath, $thumbJpeg, 'public');
        unset($thumbImage, $thumbJpeg);
        Log::info('ProcessUploadedPhoto: thumbnail uploaded', $context);

        Log::info('ProcessUploadedPhoto: creating web version', $context);
        $webImage = $manager->read($originalContents);
        $webImage->scaleDown(width: 1920);
        $webJpeg = $webImage->toJpeg(quality: 85)->toString();
        Storage::disk('spaces')->put($webPath, $webJpeg, 'public');
        unset($webImage, $webJpeg, $originalContents);
        Log::info('ProcessUploadedPhoto: web version uploaded', $context);

        $this->photo->update([
            'web_path' => $webPath,
            'thumbnail_path' => $thumbnailPath,
        ]);

        Log::info('ProcessUploadedPhoto: completed', $context);
    }

    public function failed(\Throwable $exception): void
    {
        Log::error('ProcessUploadedPhoto: failed', [
            'photo_id' => $this->photo->id,
            'filename' => $this->photo->filename,
            'error' => $exception->getMessage(),
            'trace' => $exception->getTraceAsString(),
        ]);

        report($exception);
    }

    private function variantPath(string $originalPath, string $variant): string
    {
        return str_replace('/originals/', "/{$variant}/", $originalPath);
    }
}
