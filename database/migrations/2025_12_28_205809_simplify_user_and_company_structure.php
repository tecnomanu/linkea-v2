<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Simplify User and Company structure:
 * 
 * - User: Remove unique constraint from username (login is via email or landing slug)
 * - Company: Remove unique constraint from slug (it's just a display name now)
 * 
 * The only unique slug that matters is the Landing slug (the Linkea URL handle).
 */
return new class extends Migration
{
    public function up(): void
    {
        // Make username nullable and remove unique constraint
        Schema::table('users', function (Blueprint $table) {
            // First drop the unique index
            $table->dropUnique(['username']);
        });

        Schema::table('users', function (Blueprint $table) {
            // Make nullable (user might not have username anymore)
            $table->string('username')->nullable()->change();
        });

        // Remove unique constraint from company slug
        Schema::table('companies', function (Blueprint $table) {
            // Drop the unique index on slug
            $table->dropUnique(['slug']);
        });

        Schema::table('companies', function (Blueprint $table) {
            // Make slug nullable (it's just a display name now)
            $table->string('slug')->nullable()->change();
        });
    }

    public function down(): void
    {
        // Restore unique constraints
        Schema::table('users', function (Blueprint $table) {
            $table->string('username')->nullable(false)->change();
            $table->unique(['username']);
        });

        Schema::table('companies', function (Blueprint $table) {
            $table->string('slug')->nullable(false)->change();
            $table->unique(['slug']);
        });
    }
};
