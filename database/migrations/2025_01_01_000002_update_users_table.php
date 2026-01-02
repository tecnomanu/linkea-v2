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
            $table->string('google_id')->nullable()->after('email');
            $table->string('apple_id')->nullable()->after('google_id');
            $table->date('birthday')->nullable();
            $table->json('avatar')->nullable(); // JSON with 'image' and 'thumb' paths
            $table->json('settings')->nullable();
            $table->json('capability')->nullable();
            $table->foreignUuid('company_id')->nullable()->constrained('companies');
            $table->string('mautic_id')->nullable();
            $table->string('sendernet_id')->nullable()->comment('Sender.net subscriber ID');
            $table->timestamp('verified_at')->nullable();
            $table->string('verification_code')->nullable();
            $table->string('mongo_id', 24)->nullable()->unique()->after('id');
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'mongo_id',
                'first_name',
                'last_name',
                'google_id',
                'apple_id',
                'birthday',
                'avatar',
                'settings',
                'capability',
                'company_id',
                'mautic_id',
                'sendernet_id',
                'verified_at',
                'verification_code',
                'deleted_at'
            ]);
        });
    }
};
