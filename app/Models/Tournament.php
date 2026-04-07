<?php

namespace App\Models;

use Database\Factories\TournamentFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'slug'])]
class Tournament extends Model
{
    /** @use HasFactory<TournamentFactory> */
    use HasFactory;

    protected static function booted(): void
    {
        static::deleting(function (Tournament $tournament): void {
            AnalyticsEvent::where('trackable_type', AnalyticsEvent::TRACKABLE_TOURNAMENT)
                ->where('trackable_id', $tournament->id)
                ->delete();
        });
    }

    public function albums(): HasMany
    {
        return $this->hasMany(Album::class)->orderBy('date');
    }
}
