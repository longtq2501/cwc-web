<?php

namespace App\Http\Controllers;

use App\Models\CollectionAssignment;
use App\Models\Collector;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CollectorController extends Controller
{
    public function tasks(Request $request): JsonResponse
    {
        $collector = Collector::query()->where('user_id', $request->user()->id)->where('is_deleted', false)->first();

        if (!$collector) {
            return response()->json(['message' => 'Collector profile not found'], 422);
        }

        $tasks = CollectionAssignment::query()
            ->with('report')
            ->where('collector_id', $collector->id)
            ->orderByDesc('created_at')
            ->paginate(10);

        return response()->json($tasks);
    }

    public function startTask(Request $request, int $assignmentId): JsonResponse
    {
        $collector = Collector::query()->where('user_id', $request->user()->id)->where('is_deleted', false)->first();

        if (!$collector) {
            return response()->json(['message' => 'Collector profile not found'], 422);
        }

        $assignment = CollectionAssignment::query()->where('id', $assignmentId)->where('collector_id', $collector->id)->first();

        if (!$assignment) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        if (!in_array($assignment->status, ['assigned'], true)) {
            return response()->json(['message' => 'Task must be assigned before starting'], 422);
        }

        DB::transaction(function () use ($assignment) {
            $assignment->update([
                'status' => 'on_the_way',
                'started_at' => now(),
            ]);

            $report = $assignment->report;
            $report?->update(['status' => 'on_the_way']);

            if ($report) {
                $this->notifyUser(
                    $report->citizen_id,
                    'Collector is on the way',
                    'Collector started moving to your report #'.$report->id.'.',
                    'report_status',
                    $report->id
                );
            }
        });

        return response()->json([
            'message' => 'Task started',
            'assignment' => $assignment->fresh(),
        ]);
    }

    public function markCollected(Request $request, int $assignmentId): JsonResponse
    {
        $validated = $request->validate([
            'actual_weight_kg' => ['nullable', 'numeric', 'min:0'],
            'proof_image_url' => ['required', 'url', 'max:500'],
            'collector_note' => ['nullable', 'string'],
        ]);

        $collector = Collector::query()->where('user_id', $request->user()->id)->where('is_deleted', false)->first();

        if (!$collector) {
            return response()->json(['message' => 'Collector profile not found'], 422);
        }

        $assignment = CollectionAssignment::query()->where('id', $assignmentId)->where('collector_id', $collector->id)->first();

        if (!$assignment) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        if (!in_array($assignment->status, ['assigned', 'on_the_way'], true)) {
            return response()->json(['message' => 'Task cannot be marked collected from current status'], 422);
        }

        DB::transaction(function () use ($assignment, $validated) {
            $assignment->update([
                'status' => 'collected',
                'collected_at' => now(),
                'actual_weight_kg' => $validated['actual_weight_kg'] ?? null,
                'proof_image_url' => $validated['proof_image_url'],
                'collector_note' => $validated['collector_note'] ?? null,
            ]);

            $report = $assignment->report;
            $report?->update(['status' => 'collected']);

            if ($report) {
                $this->notifyUser(
                    $report->citizen_id,
                    'Waste collected',
                    'Your report #'.$report->id.' has been marked collected. Please confirm when ready.',
                    'report_status',
                    $report->id
                );
            }
        });

        return response()->json([
            'message' => 'Task marked as collected',
            'assignment' => $assignment->fresh(),
        ]);
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
