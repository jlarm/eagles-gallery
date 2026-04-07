<?php

namespace App\Models;

use Database\Factories\PhotoFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

#[Fillable(['album_id', 'filename', 'original_path', 'web_path', 'thumbnail_path', 'sort_order', 'is_cover'])]
class Photo extends Model
{
    /** @use HasFactory<PhotoFactory> */
    use HasFactory;

    /** @var array<string, mixed> */
    protected $attributes = [
        'sort_order' => 0,
        'is_cover' => false,
    ];

    /** @var list<string> */
    protected $appends = ['thumbnail_url', 'web_url'];

    protected function casts(): array
    {
        return [
            'is_cover' => 'boolean',
        ];
    }

    protected function thumbnailUrl(): Attribute
    {
        return Attribute::get(fn () => $this->thumbnail_path
            ? Storage::disk('spaces')->url($this->thumbnail_path)
            : null
        );
    }

    protected function webUrl(): Attribute
    {
        return Attribute::get(fn () => $this->web_path
            ? Storage::disk('spaces')->url($this->web_path)
            : null
        );
    }

    public function album(): BelongsTo
    {
        return $this->belongsTo(Album::class);
    }

    public function isProcessed(): bool
    {
        return $this->web_path !== null && $this->thumbnail_path !== null;
    }
}
