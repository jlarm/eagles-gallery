<?php

namespace App\Models;

use Database\Factories\AlbumFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\Storage;

#[Fillable(['tournament_id', 'opponent', 'date', 'slug', 'published_at'])]
class Album extends Model
{
    /** @use HasFactory<AlbumFactory> */
    use HasFactory;

    protected static function booted(): void
    {
        static::deleting(function (Album $album): void {
            $photos = $album->photos()->get(['id', 'original_path', 'web_path', 'thumbnail_path']);

            // Photos are cascade-deleted at DB level so their Eloquent events won't fire.
            // Clean up photo analytics manually before the cascade happens.
            AnalyticsEvent::where('trackable_type', AnalyticsEvent::TRACKABLE_PHOTO)
                ->whereIn('trackable_id', $photos->pluck('id'))
                ->delete();

            AnalyticsEvent::where('trackable_type', AnalyticsEvent::TRACKABLE_ALBUM)
                ->where('trackable_id', $album->id)
                ->delete();

            $paths = $photos->flatMap(fn (Photo $photo) => array_filter([
                $photo->original_path,
                $photo->web_path,
                $photo->thumbnail_path,
            ]))->all();

            Storage::disk('spaces')->delete($paths);
        });
    }

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'published_at' => 'datetime',
        ];
    }

    public function scopePublished(Builder $query): void
    {
        $query->whereNotNull('published_at');
    }

    public function isPublished(): bool
    {
        return $this->published_at !== null;
    }

    public function publish(): void
    {
        $this->update(['published_at' => now()]);
    }

    public function unpublish(): void
    {
        $this->update(['published_at' => null]);
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
