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
        Schema::create('point_rules', function (Blueprint $table) {
            $table->id();
            $table->unsignedTinyInteger('waste_type_id')->nullable();
            $table->string('rule_name', 200);
            $table->string('description', 500)->nullable();
            $table->enum('condition_type', ['valid_report', 'correct_classification', 'fast_collection', 'first_report_of_day', 'other']);
            $table->integer('points');
            $table->boolean('is_active')->default(true);
            $table->date('effective_from');
            $table->date('effective_to')->nullable();
            $table->foreignId('created_by');
            $table->timestamps();

            $table->foreign('waste_type_id')->references('id')->on('waste_types');
            $table->foreign('created_by')->references('id')->on('users');
        });

        Schema::create('point_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('citizen_id');
            $table->foreignId('report_id')->nullable();
            $table->foreignId('rule_id')->nullable();
            $table->integer('points');
            $table->integer('balance_after');
            $table->string('description', 255)->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('citizen_id')->references('id')->on('users');
            $table->foreign('report_id')->references('id')->on('waste_reports');
            $table->foreign('rule_id')->references('id')->on('point_rules');

            $table->index(['citizen_id', 'created_at'], 'idx_tx_citizen_time');
        });

        Schema::create('leaderboards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('citizen_id');
            $table->unsignedInteger('ward_id');
            $table->integer('total_points')->default(0);
            $table->unsignedInteger('total_rank')->nullable();
            $table->unsignedSmallInteger('period_year');
            $table->unsignedTinyInteger('period_month');
            $table->integer('period_points')->default(0);
            $table->unsignedInteger('period_rank')->nullable();
            $table->unsignedInteger('total_reports')->default(0);
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();

            $table->unique(['citizen_id', 'ward_id', 'period_year', 'period_month'], 'uq_leaderboard');
            $table->foreign('citizen_id')->references('id')->on('users');
            $table->foreign('ward_id')->references('id')->on('wards');

            $table->index(['ward_id', 'period_year', 'period_month', 'period_points'], 'idx_lb_ward_period');
            $table->index(['ward_id', 'total_points'], 'idx_lb_ward_total');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leaderboards');
        Schema::dropIfExists('point_transactions');
        Schema::dropIfExists('point_rules');
    }
};
