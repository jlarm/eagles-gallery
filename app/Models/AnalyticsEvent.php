<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['event_type', 'trackable_type', 'trackable_id', 'created_at'])]
class AnalyticsEvent extends Model
{
    public const TOURNAMENT_VIEW = 'tournament_view';

    public const GAME_VIEW = 'game_view';

    public const PHOTO_VIEW = 'photo_view';

    public const DOWNLOAD = 'download';

    public const TRACKABLE_TOURNAMENT = 'tournament';

    public const TRACKABLE_ALBUM = 'album';

    public const TRACKABLE_PHOTO = 'photo';

    public $timestamps = false;

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
            'trackable_id' => 'integer',
        ];
    }

    public static function record(string $eventType, string $trackableType, int $trackableId): void
    {
        static::create([
            'event_type' => $eventType,
            'trackable_type' => $trackableType,
            'trackable_id' => $trackableId,
        ]);
    }
}
