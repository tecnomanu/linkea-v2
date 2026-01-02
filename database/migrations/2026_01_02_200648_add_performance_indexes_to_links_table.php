<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Add composite indexes to optimize common queries:
     * 1. landing_id + group + state: For filtering links/socials by status
     * 2. landing_id + deleted_at: For soft delete queries
     * 3. landing_id + order: For ordered retrieval
     */
    public function up(): void
    {
        Schema::table('links', function (Blueprint $table) {
            // Composite index for group filtering (blocks vs socials) with state
            // Optimizes: WHERE landing_id = ? AND group = ? AND state = ?
            $table->index(['landing_id', 'group', 'state'], 'links_landing_group_state_idx');

            // Composite index for soft delete queries
            // Optimizes: WHERE landing_id = ? AND deleted_at IS NULL
            $table->index(['landing_id', 'deleted_at'], 'links_landing_deleted_idx');

            // Composite index for ordered queries
            // Optimizes: WHERE landing_id = ? ORDER BY order
            $table->index(['landing_id', 'order'], 'links_landing_order_idx');

            // Index on type for filtering (headers, socials, etc.)
            // Optimizes: WHERE type = ? (for analytics)
            $table->index('type', 'links_type_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('links', function (Blueprint $table) {
            $table->dropIndex('links_landing_group_state_idx');
            $table->dropIndex('links_landing_deleted_idx');
            $table->dropIndex('links_landing_order_idx');
            $table->dropIndex('links_type_idx');
        });
    }
};
