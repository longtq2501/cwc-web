<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\CitizenReportController;
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
        Route::get('/reports', [CitizenReportController::class, 'index']);
        Route::get('/reports/{reportId}', [CitizenReportController::class, 'show']);
        Route::post('/reports', [CitizenReportController::class, 'store']);
        Route::post('/reports/{reportId}/cancel', [CitizenReportController::class, 'cancel']);
        Route::post('/reports/{reportId}/confirm', [CitizenReportController::class, 'confirmCollected']);
        Route::get('/points/history', [CitizenReportController::class, 'pointHistory']);
        Route::get('/leaderboard', [CitizenReportController::class, 'leaderboard']);
    });

    Route::prefix('enterprise')->middleware('role:enterprise')->group(function (): void {
        Route::get('/collectors', [EnterpriseController::class, 'collectors']);
        Route::get('/reports/pending', [EnterpriseController::class, 'pendingReports']);
        Route::post('/reports/{reportId}/accept', [EnterpriseController::class, 'acceptReport']);
        Route::post('/reports/{reportId}/reject', [EnterpriseController::class, 'rejectReport']);
        Route::post('/reports/{reportId}/assign', [EnterpriseController::class, 'assignCollector']);
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
