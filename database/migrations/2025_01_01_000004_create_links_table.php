<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('links', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('landing_id')->constrained('landings')->cascadeOnDelete();
            $table->text('text')->nullable();
            $table->text('link')->nullable();
            $table->boolean('state')->default(true);
            $table->string('slug')->nullable();
            $table->integer('order')->default(0);
            $table->string('type')->default('button');
            $table->string('group')->default('links');
            $table->json('icon')->nullable();
            $table->json('image')->nullable();
            $table->json('options')->nullable();
            $table->json('config')->nullable();
            $table->integer('visited')->default(0);
            $table->string('mongo_id', 24)->nullable()->unique();
            $table->timestamps();
            $table->softDeletes();

            // Performance indexes
            $table->index(['landing_id', 'group', 'order']);
            $table->index(['landing_id', 'state']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('links');
    }
};
