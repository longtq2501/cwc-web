<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\PointRule;
use App\Models\RecyclingEnterprise;
use App\Models\WasteReport;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function overview(): JsonResponse
    {
        return response()->json([
            'data' => [
                'total_reports' => WasteReport::query()->count(),
                'pending_reports' => WasteReport::query()->where('status', 'pending')->count(),
                'total_enterprises' => RecyclingEnterprise::query()->count(),
                'pending_enterprises' => RecyclingEnterprise::query()->where('status', 'pending')->count(),
            ],
        ]);
    }

    public function pendingEnterprises(): JsonResponse
    {
        $rows = RecyclingEnterprise::query()
            ->with('user')
            ->where('status', 'pending')
            ->where('is_deleted', false)
            ->orderBy('created_at')
            ->get();

        return response()->json(['data' => $rows]);
    }

    public function approveEnterprise(Request $request, int $enterpriseId): JsonResponse
    {
        $enterprise = RecyclingEnterprise::query()->find($enterpriseId);
        if (!$enterprise) {
            return response()->json(['message' => 'Enterprise not found'], 404);
        }

        $enterprise->update([
            'status' => 'approved',
            'approved_at' => now(),
            'approved_by' => $request->user()->id,
        ]);

        if ($enterprise->user_id) {
            Notification::query()->create([
                'user_id' => $enterprise->user_id,
                'title' => 'Enterprise approved',
                'body' => 'Your enterprise has been approved by admin.',
                'type' => 'system',
                'ref_id' => $enterprise->id,
                'is_read' => false,
                'created_at' => now(),
            ]);
        }

        return response()->json([
            'message' => 'Enterprise approved',
            'data' => $enterprise->fresh(),
        ]);
    }

    public function suspendEnterprise(Request $request, int $enterpriseId): JsonResponse
    {
        $enterprise = RecyclingEnterprise::query()->find($enterpriseId);
        if (!$enterprise) {
            return response()->json(['message' => 'Enterprise not found'], 404);
        }

        $validated = $request->validate([
            'reason' => ['nullable', 'string', 'max:500'],
        ]);

        $enterprise->update([
            'status' => 'suspended',
            'approved_by' => $request->user()->id,
        ]);

        if ($enterprise->user_id) {
            Notification::query()->create([
                'user_id' => $enterprise->user_id,
                'title' => 'Enterprise suspended',
                'body' => $validated['reason'] ?? 'Your enterprise has been suspended by admin.',
                'type' => 'system',
                'ref_id' => $enterprise->id,
                'is_read' => false,
                'created_at' => now(),
            ]);
        }

        return response()->json([
            'message' => 'Enterprise suspended',
            'data' => $enterprise->fresh(),
        ]);
    }

    public function pointRules(): JsonResponse
    {
        $rules = PointRule::query()->orderByDesc('id')->get();
        return response()->json(['data' => $rules]);
    }

    public function createPointRule(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'waste_type_id' => ['nullable', 'integer', 'exists:waste_types,id'],
            'rule_name' => ['required', 'string', 'max:200'],
            'description' => ['nullable', 'string', 'max:500'],
            'condition_type' => ['required', 'in:valid_report,correct_classification,fast_collection,first_report_of_day,other'],
            'points' => ['required', 'integer'],
            'effective_from' => ['required', 'date'],
            'effective_to' => ['nullable', 'date', 'after_or_equal:effective_from'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $rule = PointRule::query()->create([
            'waste_type_id' => $validated['waste_type_id'] ?? null,
            'rule_name' => $validated['rule_name'],
            'description' => $validated['description'] ?? null,
            'condition_type' => $validated['condition_type'],
            'points' => $validated['points'],
            'is_active' => $validated['is_active'] ?? true,
            'effective_from' => $validated['effective_from'],
            'effective_to' => $validated['effective_to'] ?? null,
            'created_by' => $request->user()->id,
        ]);

        return response()->json([
            'message' => 'Point rule created',
            'data' => $rule,
        ], 201);
    }
}
