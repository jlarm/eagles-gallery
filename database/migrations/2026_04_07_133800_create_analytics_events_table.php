<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('analytics_events', function (Blueprint $table) {
            $table->id();
            $table->string('event_type', 30)->index(); // tournament_view, game_view, photo_view, download
            $table->string('trackable_type', 30);      // tournament, album, photo
            $table->unsignedBigInteger('trackable_id');
            $table->timestamp('created_at')->useCurrent()->index();

            $table->index(['trackable_type', 'trackable_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('analytics_events');
    }

    // No updated_at — events are immutable
};
