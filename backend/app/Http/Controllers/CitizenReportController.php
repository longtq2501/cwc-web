<?php

namespace App\Http\Controllers;

use App\Models\Leaderboard;
use App\Models\Notification;
use App\Models\PointRule;
use App\Models\PointTransaction;
use App\Models\ReportImage;
use App\Models\WasteReport;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CitizenReportController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $reports = WasteReport::query()
            ->with('images')
            ->where('citizen_id', $request->user()->id)
            ->where('is_deleted', false)
            ->orderByDesc('created_at')
            ->paginate(10);

        return response()->json($reports);
    }

    public function show(Request $request, int $reportId): JsonResponse
    {
        $report = WasteReport::query()
            ->with('images')
            ->where('id', $reportId)
            ->where('citizen_id', $request->user()->id)
            ->where('is_deleted', false)
            ->first();

        if (!$report) {
            return response()->json(['message' => 'Report not found'], 404);
        }

        return response()->json([
            'report' => $report,
            'data' => $report,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'waste_type_id' => ['required', 'integer', 'exists:waste_types,id'],
            'ward_id' => ['required', 'integer', 'exists:wards,id'],
            'address_detail' => ['required', 'string', 'max:500'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'description' => ['nullable', 'string'],
            'estimated_weight_kg' => ['nullable', 'numeric', 'min:0'],
            'image_urls' => ['nullable', 'array', 'min:1'],
            'image_urls.*' => ['required', 'url', 'max:500'],
            'images' => ['nullable', 'array', 'min:1'],
            'images.*' => ['required', 'url', 'max:500'],
        ]);

        $imageUrls = $validated['image_urls'] ?? $validated['images'] ?? [];
        if (count($imageUrls) === 0) {
            return response()->json([
                'message' => 'At least one image URL is required.',
            ], 422);
        }

        $citizenId = $request->user()->id;

        $dailyReportCount = WasteReport::query()
            ->where('citizen_id', $citizenId)
            ->whereDate('created_at', now()->toDateString())
            ->where('is_deleted', false)
            ->count();

        if ($dailyReportCount >= 10) {
            return response()->json([
                'message' => 'Daily limit reached: maximum 10 reports per day.',
            ], 422);
        }

        $report = DB::transaction(function () use ($validated, $citizenId, $imageUrls) {
            $report = WasteReport::query()->create([
                'citizen_id' => $citizenId,
                'waste_type_id' => $validated['waste_type_id'],
                'ward_id' => $validated['ward_id'],
                'address_detail' => $validated['address_detail'],
                'latitude' => $validated['latitude'] ?? null,
                'longitude' => $validated['longitude'] ?? null,
                'description' => $validated['description'] ?? null,
                'estimated_weight_kg' => $validated['estimated_weight_kg'] ?? null,
                'status' => 'pending',
                'is_deleted' => false,
            ]);

            foreach ($imageUrls as $index => $url) {
                ReportImage::query()->create([
                    'report_id' => $report->id,
                    'image_url' => $url,
                    'is_primary' => $index === 0,
                    'uploaded_at' => now(),
                ]);
            }

            return $report->load('images');
        });

        return response()->json([
            'message' => 'Report created successfully',
            'report' => $report,
            'data' => $report,
        ], 201);
    }

    public function cancel(Request $request, int $reportId): JsonResponse
    {
        $report = WasteReport::query()
            ->where('id', $reportId)
            ->where('citizen_id', $request->user()->id)
            ->where('is_deleted', false)
            ->first();

        if (!$report) {
            return response()->json(['message' => 'Report not found'], 404);
        }

        if ($report->status !== 'pending') {
            return response()->json([
                'message' => 'Only pending reports can be cancelled.',
            ], 422);
        }

        $report->update(['status' => 'cancelled']);

        return response()->json([
            'message' => 'Report cancelled successfully',
            'report' => $report,
            'data' => $report,
        ]);
    }

    public function confirmCollected(Request $request, int $reportId): JsonResponse
    {
        $report = WasteReport::query()
            ->where('id', $reportId)
            ->where('citizen_id', $request->user()->id)
            ->where('is_deleted', false)
            ->first();

        if (!$report) {
            return response()->json(['message' => 'Report not found'], 404);
        }

        if ($report->status !== 'collected') {
            return response()->json([
                'message' => 'Only collected reports can be confirmed.',
            ], 422);
        }

        $result = DB::transaction(function () use ($report, $request) {
            $report->update(['status' => 'confirmed']);

            $pointResult = $this->applyPointsForConfirmedReport($report);

            if (($pointResult['awarded_points'] ?? 0) > 0) {
                $this->notifyUser(
                    $request->user()->id,
                    'Points earned',
                    'You earned '.$pointResult['awarded_points'].' points for confirmed report #'.$report->id.'.',
                    'point_earned',
                    $report->id
                );
            }

            return [
                'report' => $report->fresh(),
                'point_summary' => $pointResult,
            ];
        });

        return response()->json([
            'message' => 'Report confirmed successfully',
            'report' => $result['report'],
            'data' => $result['report'],
            'point_summary' => $result['point_summary'],
        ]);
    }

    public function pointHistory(Request $request): JsonResponse
    {
        $history = PointTransaction::query()
            ->where('citizen_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->paginate(20);

        return response()->json($history);
    }

    public function leaderboard(Request $request): JsonResponse
    {
        $wardId = $request->query('ward_id', $request->user()->ward_id);
        $year = (int) $request->query('year', now()->year);
        $month = (int) $request->query('month', now()->month);

        $rows = Leaderboard::query()
            ->where('ward_id', $wardId)
            ->where('period_year', $year)
            ->where('period_month', $month)
            ->orderByDesc('period_points')
            ->orderByDesc('total_points')
            ->limit(20)
            ->get();

        return response()->json([
            'data' => $rows,
            'meta' => [
                'ward_id' => $wardId,
                'period_year' => $year,
                'period_month' => $month,
            ],
        ]);
    }

    private function applyPointsForConfirmedReport(WasteReport $report): array
    {
        $today = now()->toDateString();

        $activeRules = PointRule::query()
            ->where('is_active', true)
            ->whereDate('effective_from', '<=', $today)
            ->where(function ($query) use ($today) {
                $query->whereNull('effective_to')->orWhereDate('effective_to', '>=', $today);
            })
            ->orderBy('id')
            ->get();

        $balance = (int) PointTransaction::query()
            ->where('citizen_id', $report->citizen_id)
            ->orderByDesc('id')
            ->value('balance_after');

        $awardedPoints = 0;
        $appliedRules = [];

        foreach ($activeRules as $rule) {
            if (!$this->ruleApplies($rule, $report)) {
                continue;
            }

            $delta = (int) $rule->points;
            $newBalance = $balance + $delta;
            if ($newBalance < 0) {
                $delta = -$balance;
                $newBalance = 0;
            }

            if ($delta === 0) {
                continue;
            }

            PointTransaction::query()->create([
                'citizen_id' => $report->citizen_id,
                'report_id' => $report->id,
                'rule_id' => $rule->id,
                'points' => $delta,
                'balance_after' => $newBalance,
                'description' => $rule->rule_name,
                'created_at' => now(),
            ]);

            $balance = $newBalance;
            $awardedPoints += $delta;
            $appliedRules[] = [
                'rule_id' => $rule->id,
                'rule_name' => $rule->rule_name,
                'points' => $delta,
            ];
        }

        $report->update([
            'points_awarded' => ($report->points_awarded ?? 0) + $awardedPoints,
        ]);

        $this->upsertLeaderboard($report, $awardedPoints);

        return [
            'awarded_points' => $awardedPoints,
            'balance_after' => $balance,
            'applied_rules' => $appliedRules,
        ];
    }

    private function ruleApplies(PointRule $rule, WasteReport $report): bool
    {
        if ($rule->waste_type_id && (int) $rule->waste_type_id !== (int) $report->waste_type_id) {
            return false;
        }

        return match ($rule->condition_type) {
            'valid_report' => $report->is_valid_report !== false,
            'correct_classification' => $report->is_correct_type !== false,
            'first_report_of_day' => PointTransaction::query()
                ->where('citizen_id', $report->citizen_id)
                ->whereDate('created_at', now()->toDateString())
                ->doesntExist(),
            'fast_collection' => true,
            default => true,
        };
    }

    private function upsertLeaderboard(WasteReport $report, int $awardedPoints): void
    {
        $year = now()->year;
        $month = now()->month;

        $row = Leaderboard::query()->firstOrNew([
            'citizen_id' => $report->citizen_id,
            'ward_id' => $report->ward_id,
            'period_year' => $year,
            'period_month' => $month,
        ]);

        $row->total_points = ($row->total_points ?? 0) + $awardedPoints;
        $row->period_points = ($row->period_points ?? 0) + $awardedPoints;
        $row->total_reports = WasteReport::query()
            ->where('citizen_id', $report->citizen_id)
            ->where('status', 'confirmed')
            ->where('is_deleted', false)
            ->count();
        $row->updated_at = now();
        $row->save();
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
