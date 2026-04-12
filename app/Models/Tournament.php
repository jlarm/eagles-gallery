<?php

namespace App\Models;

use Database\Factories\TournamentFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'slug', 'published_at'])]
class Tournament extends Model
{
    /** @use HasFactory<TournamentFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
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

    protected static function booted(): void
    {
        static::deleting(function (Tournament $tournament): void {
            AnalyticsEvent::where('trackable_type', AnalyticsEvent::TRACKABLE_TOURNAMENT)
                ->where('trackable_id', $tournament->id)
                ->delete();

            // Delete via Eloquent so each album's deleting hook fires (file & analytics cleanup).
            $tournament->albums()->each(fn (Album $album) => $album->delete());
        });
    }

    public function albums(): HasMany
    {
        return $this->hasMany(Album::class)->orderBy('date');
    }
}
