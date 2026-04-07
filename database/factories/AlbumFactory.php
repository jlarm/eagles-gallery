<?php

namespace Database\Factories;

use App\Models\Album;
use App\Models\Tournament;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Album>
 */
class AlbumFactory extends Factory
{
    public function definition(): array
    {
        $opponent = fake()->city();
        $date = fake()->dateTimeBetween('-2 years')->format('Y-m-d');

        return [
            'tournament_id' => null,
            'opponent' => $opponent,
            'date' => $date,
            'slug' => Str::slug($opponent.'-'.$date),
        ];
    }

    public function forTournament(): static
    {
        return $this->state(fn (array $attributes) => [
            'tournament_id' => Tournament::factory(),
        ]);
    }
}
