<?php

namespace App\Http\Controllers;

use App\Jobs\ProcessUploadedPhoto;
use App\Models\Photo;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Artisan;

class QueueController extends Controller
{
    public function retryFailed(): RedirectResponse
    {
        Artisan::call('queue:retry', ['id' => ['all']]);

        return redirect()->route('dashboard')->with('success', 'All failed jobs queued for retry.');
    }

    public function clearFailed(): RedirectResponse
    {
        Artisan::call('queue:flush');

        return redirect()->route('dashboard')->with('success', 'Failed jobs cleared.');
    }

    public function retryStuckPhoto(Photo $photo): RedirectResponse
    {
        ProcessUploadedPhoto::dispatch($photo);

        return redirect()->route('dashboard')->with('success', "Re-queued \"{$photo->filename}\" for processing.");
    }
}
