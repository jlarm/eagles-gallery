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
            'path' => 'photos/'.$filename,
            'sort_order' => fake()->numberBetween(0, 100),
        ];
    }
}
