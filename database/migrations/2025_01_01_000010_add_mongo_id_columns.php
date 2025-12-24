<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Add mongo_id columns to tables for tracking legacy MongoDB ObjectIds.
 * This allows referencing old IDs during migration and maintaining backwards compatibility.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('mongo_id', 24)->nullable()->unique()->after('id');
        });

        Schema::table('companies', function (Blueprint $table) {
            $table->string('mongo_id', 24)->nullable()->unique()->after('id');
        });

        Schema::table('landings', function (Blueprint $table) {
            $table->string('mongo_id', 24)->nullable()->unique()->after('id');
        });

        Schema::table('links', function (Blueprint $table) {
            $table->string('mongo_id', 24)->nullable()->unique()->after('id');
        });

        Schema::table('memberships', function (Blueprint $table) {
            $table->string('mongo_id', 24)->nullable()->unique()->after('id');
        });

        Schema::table('newsletters', function (Blueprint $table) {
            $table->string('mongo_id', 24)->nullable()->unique()->after('id');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('mongo_id');
        });

        Schema::table('companies', function (Blueprint $table) {
            $table->dropColumn('mongo_id');
        });

        Schema::table('landings', function (Blueprint $table) {
            $table->dropColumn('mongo_id');
        });

        Schema::table('links', function (Blueprint $table) {
            $table->dropColumn('mongo_id');
        });

        Schema::table('memberships', function (Blueprint $table) {
            $table->dropColumn('mongo_id');
        });

        Schema::table('newsletters', function (Blueprint $table) {
            $table->dropColumn('mongo_id');
        });
    }
};
