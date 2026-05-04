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
        Schema::create('recycling_enterprises', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique();
            $table->string('enterprise_name', 200);
            $table->string('license_number', 100)->nullable()->unique();
            $table->text('description')->nullable();
            $table->string('address', 500)->nullable();
            $table->unsignedInteger('ward_id')->nullable();
            $table->string('logo_url', 500)->nullable();
            $table->enum('status', ['pending', 'approved', 'suspended'])->default('pending');
            $table->timestamp('approved_at')->nullable();
            $table->foreignId('approved_by')->nullable();
            $table->boolean('is_deleted')->default(false);
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('ward_id')->references('id')->on('wards');
            $table->foreign('approved_by')->references('id')->on('users');
        });

        Schema::create('waste_types', function (Blueprint $table) {
            $table->tinyIncrements('id');
            $table->string('name', 100)->unique();
            $table->string('description', 255)->nullable();
            $table->string('icon_url', 500)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('enterprise_capabilities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('enterprise_id');
            $table->unsignedTinyInteger('waste_type_id');
            $table->decimal('max_capacity_kg', 10, 2)->nullable();
            $table->string('notes', 500)->nullable();
            $table->timestamps();

            $table->unique(['enterprise_id', 'waste_type_id'], 'uq_enterprise_waste');
            $table->foreign('enterprise_id')->references('id')->on('recycling_enterprises')->cascadeOnDelete();
            $table->foreign('waste_type_id')->references('id')->on('waste_types');
        });

        Schema::create('enterprise_service_areas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('enterprise_id');
            $table->unsignedInteger('ward_id');
            $table->timestamp('created_at')->useCurrent();

            $table->unique(['enterprise_id', 'ward_id'], 'uq_enterprise_area');
            $table->foreign('enterprise_id')->references('id')->on('recycling_enterprises')->cascadeOnDelete();
            $table->foreign('ward_id')->references('id')->on('wards');
            $table->index('ward_id', 'idx_area_ward');
        });

        Schema::create('collectors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique();
            $table->foreignId('enterprise_id');
            $table->string('vehicle_info', 255)->nullable();
            $table->enum('status', ['active', 'inactive', 'suspended'])->default('active');
            $table->date('joined_at')->nullable();
            $table->boolean('is_deleted')->default(false);
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('enterprise_id')->references('id')->on('recycling_enterprises');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('collectors');
        Schema::dropIfExists('enterprise_service_areas');
        Schema::dropIfExists('enterprise_capabilities');
        Schema::dropIfExists('waste_types');
        Schema::dropIfExists('recycling_enterprises');
    }
};
