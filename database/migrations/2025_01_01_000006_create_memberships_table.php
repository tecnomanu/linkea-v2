<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('memberships', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('type');
            $table->string('mongo_id', 24)->nullable()->unique();
            $table->timestamps();
            $table->softDeletes();
        });

        // Add membership_id to companies if not exists, since we missed it in create_companies
        // Actually, companies table structure is already set in 000001, but we didn't add membership_id.
        // We can add it here.
        Schema::table('companies', function (Blueprint $table) {
            $table->foreignUuid('membership_id')->nullable()->constrained('memberships')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->dropForeign(['membership_id']);
            $table->dropColumn('membership_id');
        });
        Schema::dropIfExists('memberships');
    }
};
