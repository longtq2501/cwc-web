<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\PointRule;
use App\Models\RecyclingEnterprise;
use App\Models\WasteRequest;
use App\Models\User;
use App\Models\Complaint;
use App\Models\Role;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function overview(): JsonResponse
    {
        return response()->json([
            'data' => [
                'total_requests' => WasteRequest::query()->count(),
                'pending_requests' => WasteRequest::query()->where('status', 'pending')->count(),
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
            'condition_type' => ['required', 'in:valid_request,correct_classification,fast_collection,first_request_of_day,other'],
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

    public function users(): JsonResponse
    {
        $users = User::query()->with('role')->paginate(20);
        return response()->json($users);
    }

    public function updateUserRole(Request $request, int $userId): JsonResponse
    {
        $validated = $request->validate([
            'role_id' => ['required', 'integer', 'exists:roles,id'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $user = User::query()->find($userId);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->update([
            'role_id' => $validated['role_id'],
            'is_active' => $validated['is_active'] ?? $user->is_active,
        ]);

        return response()->json([
            'message' => 'User role updated',
            'data' => $user->fresh('role'),
        ]);
    }

    public function complaints(): JsonResponse
    {
        $complaints = Complaint::query()
            ->with(['citizen', 'request'])
            ->orderByRaw("FIELD(status, 'pending') DESC")
            ->orderByDesc('created_at')
            ->paginate(15);

        return response()->json($complaints);
    }

    public function resolveComplaint(Request $request, int $complaintId): JsonResponse
    {
        $validated = $request->validate([
            'resolution_notes' => ['required', 'string'],
        ]);

        $complaint = Complaint::query()->find($complaintId);
        if (!$complaint) {
            return response()->json(['message' => 'Complaint not found'], 404);
        }

        $complaint->update([
            'status' => 'resolved',
            'resolution_notes' => $validated['resolution_notes'],
            'resolved_at' => now(),
            'resolved_by' => $request->user()->id,
        ]);

        Notification::query()->create([
            'user_id' => $complaint->citizen_id,
            'title' => 'Complaint Resolved',
            'body' => 'Your complaint regarding request #'.$complaint->request_id.' has been resolved. Note: '.$validated['resolution_notes'],
            'type' => 'system',
            'ref_id' => $complaint->id,
            'is_read' => false,
            'created_at' => now(),
        ]);

        return response()->json([
            'message' => 'Complaint resolved',
            'data' => $complaint,
        ]);
    }
}
