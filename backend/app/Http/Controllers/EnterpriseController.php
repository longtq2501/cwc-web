<?php

namespace App\Http\Controllers;

use App\Models\CollectionAssignment;
use App\Models\Collector;
use App\Models\Notification;
use App\Models\RecyclingEnterprise;
use App\Models\WasteRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EnterpriseController extends Controller
{
    public function collectors(Request $request): JsonResponse
    {
        $enterprise = RecyclingEnterprise::query()->where('user_id', $request->user()->id)->first();

        if (!$enterprise) {
            return response()->json(['message' => 'Enterprise profile not found'], 422);
        }

        $collectors = Collector::query()
            ->where('enterprise_id', $enterprise->id)
            ->where('is_deleted', false)
            ->get();

        return response()->json([
            'data' => $collectors,
        ]);
    }

    public function pendingRequests(Request $request): JsonResponse
    {
        $enterprise = RecyclingEnterprise::query()->where('user_id', $request->user()->id)->first();

        if (!$enterprise) {
            return response()->json(['message' => 'Enterprise profile not found'], 422);
        }

        $requests = WasteRequest::query()
            ->where('status', 'pending')
            ->where('is_deleted', false)
            ->orderBy('created_at')
            ->paginate(10);

        return response()->json($requests);
    }

    public function acceptRequest(Request $request, int $requestId): JsonResponse
    {
        $enterprise = RecyclingEnterprise::query()->where('user_id', $request->user()->id)->first();

        if (!$enterprise) {
            return response()->json(['message' => 'Enterprise profile not found'], 422);
        }

        $wasteRequest = WasteRequest::query()->where('id', $requestId)->where('is_deleted', false)->first();
        if (!$wasteRequest) {
            return response()->json(['message' => 'Request not found'], 404);
        }

        if ($wasteRequest->status !== 'pending') {
            return response()->json(['message' => 'Only pending requests can be accepted'], 422);
        }

        $assignment = DB::transaction(function () use ($wasteRequest, $enterprise) {
            $wasteRequest->update(['status' => 'accepted']);

            $this->notifyUser(
                $wasteRequest->citizen_id,
                'Request accepted',
                'Your request #'.$wasteRequest->id.' has been accepted by an enterprise.',
                'report_status',
                $wasteRequest->id
            );

            return CollectionAssignment::query()->create([
                'request_id' => $wasteRequest->id,
                'enterprise_id' => $enterprise->id,
                'status' => 'accepted',
                'accepted_at' => now(),
            ]);
        });

        return response()->json([
            'message' => 'Request accepted',
            'assignment' => $assignment,
        ]);
    }

    public function rejectRequest(Request $request, int $requestId): JsonResponse
    {
        $validated = $request->validate([
            'reason' => ['required', 'string', 'max:500'],
        ]);

        $wasteRequest = WasteRequest::query()->where('id', $requestId)->where('is_deleted', false)->first();
        if (!$wasteRequest) {
            return response()->json(['message' => 'Request not found'], 404);
        }

        if ($wasteRequest->status !== 'pending') {
            return response()->json(['message' => 'Only pending requests can be rejected'], 422);
        }

        $wasteRequest->update([
            'status' => 'rejected',
            'rejected_reason' => $validated['reason'],
        ]);

        $this->notifyUser(
            $wasteRequest->citizen_id,
            'Request rejected',
            'Your request #'.$wasteRequest->id.' was rejected. Reason: '.$validated['reason'],
            'report_status',
            $wasteRequest->id
        );

        return response()->json([
            'message' => 'Request rejected',
            'request' => $wasteRequest,
        ]);
    }

    public function assignCollector(Request $request, int $requestId): JsonResponse
    {
        $validated = $request->validate([
            'collector_id' => ['required', 'integer', 'exists:collectors,id'],
        ]);

        $enterprise = RecyclingEnterprise::query()->where('user_id', $request->user()->id)->first();
        if (!$enterprise) {
            return response()->json(['message' => 'Enterprise profile not found'], 422);
        }

        $collector = Collector::query()
            ->where('id', $validated['collector_id'])
            ->where('enterprise_id', $enterprise->id)
            ->where('is_deleted', false)
            ->first();

        if (!$collector) {
            return response()->json(['message' => 'Collector not found in your enterprise'], 422);
        }

        $assignment = CollectionAssignment::query()
            ->where('request_id', $requestId)
            ->where('enterprise_id', $enterprise->id)
            ->first();

        if (!$assignment) {
            return response()->json(['message' => 'Assignment not found'], 404);
        }

        $wasteRequest = WasteRequest::query()->where('id', $requestId)->first();

        DB::transaction(function () use ($assignment, $collector, $wasteRequest) {
            $assignment->update([
                'collector_id' => $collector->id,
                'status' => 'assigned',
                'assigned_at' => now(),
            ]);

            $wasteRequest?->update(['status' => 'assigned']);

            if ($wasteRequest) {
                $this->notifyUser(
                    $wasteRequest->citizen_id,
                    'Collector assigned',
                    'A collector has been assigned to your request #'.$wasteRequest->id.'.',
                    'assignment',
                    $assignment->id
                );
            }

            if ($collector->user_id) {
                $this->notifyUser(
                    $collector->user_id,
                    'New collection task',
                    'You were assigned to request #'.($wasteRequest?->id ?? $assignment->request_id).'.',
                    'assignment',
                    $assignment->id
                );
            }
        });

        return response()->json([
            'message' => 'Collector assigned',
            'assignment' => $assignment->fresh(),
        ]);
    }

    public function assignments(Request $request): JsonResponse
    {
        $enterprise = RecyclingEnterprise::query()->where('user_id', $request->user()->id)->first();
        if (!$enterprise) {
            return response()->json(['message' => 'Enterprise profile not found'], 422);
        }

        $assignments = CollectionAssignment::query()
            ->with(['request', 'collector'])
            ->where('enterprise_id', $enterprise->id)
            ->orderByDesc('created_at')
            ->paginate(10);

        return response()->json($assignments);
    }

    private function notifyUser(int $userId, string $title, string $body, string $type, ?int $refId = null): void
    {
        Notification::query()->create([
            'user_id' => $userId,
            'title' => $title,
            'body' => $body,
            'type' => $type,
            'ref_id' => $refId,
            'is_read' => false,
            'created_at' => now(),
        ]);
    }
}
