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
        Schema::create('complaints', function (Blueprint $table) {
            $table->id();
            $table->foreignId('citizen_id');
            $table->foreignId('request_id');
            $table->foreignId('assignment_id')->nullable();
            $table->enum('complaint_type', ['complaint', 'compliment', 'suggestion']);
            $table->text('content');
            $table->enum('status', ['pending', 'processing', 'resolved', 'rejected'])->default('pending');
            $table->foreignId('resolved_by')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->text('resolution_note')->nullable();
            $table->boolean('is_deleted')->default(false);
            $table->timestamps();

            $table->foreign('citizen_id')->references('id')->on('users');
            $table->foreign('request_id')->references('id')->on('waste_requests');
            $table->foreign('assignment_id')->references('id')->on('collection_assignments');
            $table->foreign('resolved_by')->references('id')->on('users');
        });

        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id');
            $table->string('title', 255);
            $table->text('body');
            $table->enum('type', ['report_status', 'point_earned', 'assignment', 'system', 'feedback']);
            $table->unsignedBigInteger('ref_id')->nullable();
            $table->boolean('is_read')->default(false);
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->index(['user_id', 'is_read', 'created_at'], 'idx_notif_user_unread');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('complaints');
    }
};
