<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('link_statistics', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('link_id')->constrained('links')->cascadeOnDelete();
            $table->date('date');
            $table->integer('visits')->default(0);
            $table->timestamps();

            // Index for fast queries
            $table->index(['link_id', 'date']);
            $table->unique(['link_id', 'date']); // One record per link per day
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('link_statistics');
    }
};
