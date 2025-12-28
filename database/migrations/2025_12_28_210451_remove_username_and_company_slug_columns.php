<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Remove username from users and slug from companies.
 * 
 * These columns are no longer needed because:
 * - User login is now via email or landing slug (linkea handle)
 * - Company slug was never used for anything meaningful
 * 
 * The only unique slug that matters is the Landing slug (the Linkea URL handle).
 */
return new class extends Migration
{
    public function up(): void
    {
        // Remove username column from users table
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('username');
        });

        // Remove slug column from companies table
        Schema::table('companies', function (Blueprint $table) {
            $table->dropColumn('slug');
        });
    }

    public function down(): void
    {
        // Restore username column on users table
        Schema::table('users', function (Blueprint $table) {
            $table->string('username')->nullable()->after('last_name');
        });

        // Restore slug column on companies table
        Schema::table('companies', function (Blueprint $table) {
            $table->string('slug')->nullable()->after('name');
        });
    }
};
