<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('provinces', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name', 100);
            $table->string('code', 10)->unique();
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('districts', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('province_id');
            $table->string('name', 100);
            $table->string('code', 10)->unique();
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('province_id')->references('id')->on('provinces')->cascadeOnDelete();
        });

        Schema::create('wards', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('district_id');
            $table->string('name', 100);
            $table->string('code', 10)->unique();
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('district_id')->references('id')->on('districts')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wards');
        Schema::dropIfExists('districts');
        Schema::dropIfExists('provinces');
    }
};
