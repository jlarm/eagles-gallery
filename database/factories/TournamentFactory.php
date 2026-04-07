<?php

namespace Database\Factories;

use App\Models\Tournament;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Tournament>
 */
class TournamentFactory extends Factory
{
    public function definition(): array
    {
        $name = fake()->words(3, true).' Tournament';

        return [
            'name' => $name,
            'slug' => Str::slug($name),
        ];
    }
}
