<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('newsletters', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('subject')->nullable();
            $table->longText('message')->nullable();
            $table->string('status')->default('draft');
            $table->boolean('sent')->default(false);
            $table->string('mongo_id', 24)->nullable()->unique();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('newsletter_user', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('newsletter_id')->constrained('newsletters')->cascadeOnDelete();
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
            $table->timestamp('date')->nullable();
            $table->boolean('sent')->default(false);
            $table->integer('viewed_count')->default(0);
            $table->string('ip')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('newsletter_user');
        Schema::dropIfExists('newsletters');
    }
};
