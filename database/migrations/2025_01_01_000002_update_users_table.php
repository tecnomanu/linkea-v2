<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('username')->unique()->nullable();
            $table->date('birthday')->nullable();
            $table->string('avatar')->nullable();
            $table->json('settings')->nullable();
            $table->json('capability')->nullable();
            $table->foreignUuid('company_id')->nullable()->constrained('companies');
            $table->string('mautic_id')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->string('verification_code')->nullable();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'first_name',
                'last_name',
                'username',
                'birthday',
                'avatar',
                'settings',
                'capability',
                'company_id',
                'mautic_id',
                'verification_code',
                'deleted_at'
            ]);
        });
    }
};
