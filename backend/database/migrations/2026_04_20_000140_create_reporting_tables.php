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
        Schema::create('waste_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('citizen_id');
            $table->unsignedTinyInteger('waste_type_id');
            $table->unsignedInteger('ward_id');
            $table->string('address_detail', 500);
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->text('description')->nullable();
            $table->decimal('estimated_weight_kg', 8, 2)->nullable();
            $table->enum('status', ['pending', 'accepted', 'rejected', 'assigned', 'on_the_way', 'collected', 'confirmed', 'cancelled'])->default('pending');
            $table->string('rejected_reason', 500)->nullable();
            $table->boolean('is_valid_report')->nullable();
            $table->boolean('is_correct_type')->nullable();
            $table->unsignedInteger('points_awarded')->default(0);
            $table->unsignedTinyInteger('ai_suggested_type')->nullable();
            $table->decimal('ai_confidence', 5, 2)->nullable();
            $table->boolean('is_deleted')->default(false);
            $table->timestamps();

            $table->foreign('citizen_id')->references('id')->on('users');
            $table->foreign('waste_type_id')->references('id')->on('waste_types');
            $table->foreign('ward_id')->references('id')->on('wards');
            $table->foreign('ai_suggested_type')->references('id')->on('waste_types');

            $table->index(['ward_id', 'status'], 'idx_report_ward_status');
            $table->index(['citizen_id', 'created_at'], 'idx_report_citizen');
        });

        Schema::create('report_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('report_id');
            $table->string('image_url', 500);
            $table->boolean('is_primary')->default(false);
            $table->timestamp('uploaded_at')->useCurrent();

            $table->foreign('report_id')->references('id')->on('waste_reports')->cascadeOnDelete();
        });

        Schema::create('collection_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('report_id')->unique();
            $table->foreignId('enterprise_id');
            $table->foreignId('collector_id')->nullable();
            $table->enum('status', ['accepted', 'assigned', 'on_the_way', 'collected', 'failed'])->default('accepted');
            $table->timestamp('accepted_at')->nullable();
            $table->timestamp('assigned_at')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('collected_at')->nullable();
            $table->decimal('actual_weight_kg', 8, 2)->nullable();
            $table->text('collector_note')->nullable();
            $table->string('proof_image_url', 500)->nullable();
            $table->string('failed_reason', 500)->nullable();
            $table->timestamps();

            $table->foreign('report_id')->references('id')->on('waste_reports');
            $table->foreign('enterprise_id')->references('id')->on('recycling_enterprises');
            $table->foreign('collector_id')->references('id')->on('collectors');

            $table->index(['collector_id', 'status'], 'idx_assign_collector');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('collection_assignments');
        Schema::dropIfExists('report_images');
        Schema::dropIfExists('waste_reports');
    }
};
