<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Landing statistics table for daily view tracking.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('landing_statistics', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('landing_id')->constrained('landings')->cascadeOnDelete();
            $table->date('date');
            $table->unsignedInteger('views')->default(0);
            $table->timestamps();

            // Unique constraint to prevent duplicate entries per day
            $table->unique(['landing_id', 'date']);

            // Index for efficient queries
            $table->index(['landing_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('landing_statistics');
    }
};
