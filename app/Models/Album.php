<?php

namespace App\Models;

use Database\Factories\AlbumFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable(['tournament_id', 'opponent', 'date', 'slug'])]
class Album extends Model
{
    /** @use HasFactory<AlbumFactory> */
    use HasFactory;

    protected static function booted(): void
    {
        static::deleting(function (Album $album): void {
            // Photos are cascade-deleted at DB level so their Eloquent events won't fire.
            // Clean up photo analytics manually before the cascade happens.
            AnalyticsEvent::where('trackable_type', AnalyticsEvent::TRACKABLE_PHOTO)
                ->whereIn('trackable_id', $album->photos()->pluck('id'))
                ->delete();

            AnalyticsEvent::where('trackable_type', AnalyticsEvent::TRACKABLE_ALBUM)
                ->where('trackable_id', $album->id)
                ->delete();
        });
    }

    protected function casts(): array
    {
        return [
            'date' => 'date',
        ];
    }

    public function tournament(): BelongsTo
    {
        return $this->belongsTo(Tournament::class);
    }

    public function photos(): HasMany
    {
        return $this->hasMany(Photo::class)->orderBy('sort_order');
    }

    public function coverPhoto(): HasOne
    {
        return $this->hasOne(Photo::class)->where('is_cover', true);
    }

    public function isStandalone(): bool
    {
        return $this->tournament_id === null;
    }
}
