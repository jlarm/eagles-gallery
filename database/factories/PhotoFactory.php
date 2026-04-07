<?php

namespace Database\Factories;

use App\Models\Album;
use App\Models\Photo;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Photo>
 */
class PhotoFactory extends Factory
{
    public function definition(): array
    {
        $filename = fake()->uuid().'.jpg';

        return [
            'album_id' => Album::factory(),
            'filename' => $filename,
            'original_path' => 'photos/originals/'.$filename,
            'web_path' => 'photos/web/'.$filename,
            'thumbnail_path' => 'photos/thumbnails/'.$filename,
            'sort_order' => fake()->numberBetween(0, 100),
            'is_cover' => false,
        ];
    }

    public function unprocessed(): static
    {
        return $this->state(fn (array $attributes) => [
            'web_path' => null,
            'thumbnail_path' => null,
        ]);
    }
}
