<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\CitizenRequestController;
use App\Http\Controllers\CollectorController;
use App\Http\Controllers\EnterpriseController;
use App\Http\Controllers\NotificationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function (): void {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function (): void {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});

Route::middleware('auth:sanctum')->group(function (): void {
    Route::prefix('citizen')->middleware('role:citizen')->group(function (): void {
        Route::get('/requests', [CitizenRequestController::class, 'index']);
        Route::get('/requests/{requestId}', [CitizenRequestController::class, 'show']);
        Route::post('/requests', [CitizenRequestController::class, 'store']);
        Route::post('/requests/{requestId}/cancel', [CitizenRequestController::class, 'cancel']);
        Route::post('/requests/{requestId}/confirm', [CitizenRequestController::class, 'confirmCollected']);
        Route::get('/points/history', [CitizenRequestController::class, 'pointHistory']);
        Route::get('/leaderboard', [CitizenRequestController::class, 'leaderboard']);
        Route::post('/analyze-image', [CitizenRequestController::class, 'analyzeImage']);
    });

    Route::prefix('enterprise')->middleware('role:enterprise')->group(function (): void {
        Route::get('/collectors', [EnterpriseController::class, 'collectors']);
        Route::get('/requests/pending', [EnterpriseController::class, 'pendingRequests']);
        Route::post('/requests/{requestId}/accept', [EnterpriseController::class, 'acceptRequest']);
        Route::post('/requests/{requestId}/reject', [EnterpriseController::class, 'rejectRequest']);
        Route::post('/requests/{requestId}/assign', [EnterpriseController::class, 'assignCollector']);
        Route::get('/assignments', [EnterpriseController::class, 'assignments']);
    });

    Route::prefix('collector')->middleware('role:collector')->group(function (): void {
        Route::get('/tasks', [CollectorController::class, 'tasks']);
        Route::post('/tasks/{assignmentId}/start', [CollectorController::class, 'startTask']);
        Route::post('/tasks/{assignmentId}/collect', [CollectorController::class, 'markCollected']);
    });

    Route::prefix('admin')->middleware('role:admin')->group(function (): void {
        Route::get('/overview', [AdminController::class, 'overview']);
        Route::get('/enterprises/pending', [AdminController::class, 'pendingEnterprises']);
        Route::post('/enterprises/{enterpriseId}/approve', [AdminController::class, 'approveEnterprise']);
        Route::post('/enterprises/{enterpriseId}/suspend', [AdminController::class, 'suspendEnterprise']);
        Route::get('/point-rules', [AdminController::class, 'pointRules']);
        Route::post('/point-rules', [AdminController::class, 'createPointRule']);
    });

    Route::prefix('notifications')->group(function (): void {
        Route::get('/', [NotificationController::class, 'index']);
        Route::post('/read-all', [NotificationController::class, 'markAllRead']);
        Route::post('/{notificationId}/read', [NotificationController::class, 'markRead']);
    });

    Route::get('/dashboard/citizen', function (Request $request) {
        return response()->json([
            'message' => 'Citizen dashboard ready',
            'user_id' => $request->user()->id,
        ]);
    })->middleware('role:citizen');

    Route::get('/dashboard/collector', function (Request $request) {
        return response()->json([
            'message' => 'Collector dashboard ready',
            'user_id' => $request->user()->id,
        ]);
    })->middleware('role:collector');

    Route::get('/dashboard/enterprise', function (Request $request) {
        return response()->json([
            'message' => 'Enterprise dashboard ready',
            'user_id' => $request->user()->id,
        ]);
    })->middleware('role:enterprise');

    Route::get('/dashboard/admin', function (Request $request) {
        return response()->json([
            'message' => 'Admin dashboard ready',
            'user_id' => $request->user()->id,
        ]);
    })->middleware('role:admin');
});
