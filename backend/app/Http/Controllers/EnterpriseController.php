<?php

namespace App\Http\Controllers;

use App\Models\CollectionAssignment;
use App\Models\Collector;
use App\Models\Notification;
use App\Models\RecyclingEnterprise;
use App\Models\WasteReport;
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

    public function pendingReports(Request $request): JsonResponse
    {
        $enterprise = RecyclingEnterprise::query()->where('user_id', $request->user()->id)->first();

        if (!$enterprise) {
            return response()->json(['message' => 'Enterprise profile not found'], 422);
        }

        $reports = WasteReport::query()
            ->where('status', 'pending')
            ->where('is_deleted', false)
            ->orderBy('created_at')
            ->paginate(10);

        return response()->json($reports);
    }

    public function acceptReport(Request $request, int $reportId): JsonResponse
    {
        $enterprise = RecyclingEnterprise::query()->where('user_id', $request->user()->id)->first();

        if (!$enterprise) {
            return response()->json(['message' => 'Enterprise profile not found'], 422);
        }

        $report = WasteReport::query()->where('id', $reportId)->where('is_deleted', false)->first();
        if (!$report) {
            return response()->json(['message' => 'Report not found'], 404);
        }

        if ($report->status !== 'pending') {
            return response()->json(['message' => 'Only pending reports can be accepted'], 422);
        }

        $assignment = DB::transaction(function () use ($report, $enterprise) {
            $report->update(['status' => 'accepted']);

            $this->notifyUser(
                $report->citizen_id,
                'Report accepted',
                'Your report #'.$report->id.' has been accepted by an enterprise.',
                'report_status',
                $report->id
            );

            return CollectionAssignment::query()->create([
                'report_id' => $report->id,
                'enterprise_id' => $enterprise->id,
                'status' => 'accepted',
                'accepted_at' => now(),
            ]);
        });

        return response()->json([
            'message' => 'Report accepted',
            'assignment' => $assignment,
        ]);
    }

    public function rejectReport(Request $request, int $reportId): JsonResponse
    {
        $validated = $request->validate([
            'reason' => ['required', 'string', 'max:500'],
        ]);

        $report = WasteReport::query()->where('id', $reportId)->where('is_deleted', false)->first();
        if (!$report) {
            return response()->json(['message' => 'Report not found'], 404);
        }

        if ($report->status !== 'pending') {
            return response()->json(['message' => 'Only pending reports can be rejected'], 422);
        }

        $report->update([
            'status' => 'rejected',
            'rejected_reason' => $validated['reason'],
        ]);

        $this->notifyUser(
            $report->citizen_id,
            'Report rejected',
            'Your report #'.$report->id.' was rejected. Reason: '.$validated['reason'],
            'report_status',
            $report->id
        );

        return response()->json([
            'message' => 'Report rejected',
            'report' => $report,
        ]);
    }

    public function assignCollector(Request $request, int $reportId): JsonResponse
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
            ->where('report_id', $reportId)
            ->where('enterprise_id', $enterprise->id)
            ->first();

        if (!$assignment) {
            return response()->json(['message' => 'Assignment not found'], 404);
        }

        $report = WasteReport::query()->where('id', $reportId)->first();

        DB::transaction(function () use ($assignment, $collector, $report) {
            $assignment->update([
                'collector_id' => $collector->id,
                'status' => 'assigned',
                'assigned_at' => now(),
            ]);

            $report?->update(['status' => 'assigned']);

            if ($report) {
                $this->notifyUser(
                    $report->citizen_id,
                    'Collector assigned',
                    'A collector has been assigned to your report #'.$report->id.'.',
                    'assignment',
                    $assignment->id
                );
            }

            if ($collector->user_id) {
                $this->notifyUser(
                    $collector->user_id,
                    'New collection task',
                    'You were assigned to report #'.($report?->id ?? $assignment->report_id).'.',
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
            ->with(['report', 'collector'])
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
