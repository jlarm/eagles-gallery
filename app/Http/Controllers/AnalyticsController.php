<?php

namespace App\Http\Controllers;

use App\Http\Requests\TrackAnalyticsRequest;
use App\Models\AnalyticsEvent;
use Illuminate\Http\JsonResponse;

class AnalyticsController extends Controller
{
    public function track(TrackAnalyticsRequest $request): JsonResponse
    {
        $validated = $request->validated();

        AnalyticsEvent::record(
            $validated['event_type'],
            AnalyticsEvent::TRACKABLE_PHOTO,
            $validated['trackable_id'],
        );

        return response()->json(['ok' => true]);
    }
}
