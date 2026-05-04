<?php

namespace App\Http\Controllers;

use App\Models\CollectionAssignment;
use App\Models\Collector;
use App\Models\Notification;
use App\Models\RecyclingEnterprise;
use App\Models\WasteRequest;
use App\Models\PointRule;
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

        // Priority logic: High weight first, then oldest first
        $requests = WasteRequest::query()
            ->with(['images', 'wasteType'])
            ->where('status', 'pending')
            ->where('is_deleted', false)
            ->whereIn('ward_id', function ($query) use ($enterprise) {
                $query->select('ward_id')
                    ->from('enterprise_service_areas')
                    ->where('enterprise_id', $enterprise->id);
            })
            ->orderByDesc('estimated_weight_kg') // High volume first
            ->orderBy('created_at', 'asc')       // Then oldest first
            ->paginate(10);

        // Append a priority label for the frontend to use
        $requests->getCollection()->transform(function ($req) {
            $daysPending = $req->created_at->diffInDays(now());
            $weight = $req->estimated_weight_kg ?? 0;
            
            if ($weight >= 50 || $daysPending >= 3) {
                $req->priority_label = 'High';
            } elseif ($weight >= 10 || $daysPending >= 1) {
                $req->priority_label = 'Medium';
            } else {
                $req->priority_label = 'Low';
            }
            return $req;
        });

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

    public function profile(Request $request): JsonResponse
    {
        $enterprise = RecyclingEnterprise::query()->where('user_id', $request->user()->id)->first();

        if (!$enterprise) {
            return response()->json(['message' => 'Enterprise profile not found'], 404);
        }

        $capabilities = DB::table('enterprise_capabilities')->where('enterprise_id', $enterprise->id)->get();
        $serviceAreas = DB::table('enterprise_service_areas')->where('enterprise_id', $enterprise->id)->pluck('ward_id');

        return response()->json([
            'profile' => $enterprise,
            'capabilities' => $capabilities,
            'service_areas' => $serviceAreas,
        ]);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'enterprise_name' => 'sometimes|string|max:200',
            'description' => 'nullable|string',
            'address' => 'nullable|string|max:500',
            'logo_url' => 'nullable|url|max:500',
            'capabilities' => 'array',
            'capabilities.*.waste_type_id' => 'required|integer',
            'capabilities.*.max_capacity_kg' => 'nullable|numeric',
            'capabilities.*.notes' => 'nullable|string|max:500',
            'service_areas' => 'array',
            'service_areas.*' => 'integer',
        ]);

        $enterprise = RecyclingEnterprise::query()->where('user_id', $request->user()->id)->first();

        if (!$enterprise) {
            return response()->json(['message' => 'Enterprise profile not found'], 404);
        }

        DB::transaction(function () use ($enterprise, $validated) {
            $enterprise->update(array_filter([
                'enterprise_name' => $validated['enterprise_name'] ?? null,
                'description' => $validated['description'] ?? null,
                'address' => $validated['address'] ?? null,
                'logo_url' => $validated['logo_url'] ?? null,
            ]));

            if (isset($validated['capabilities'])) {
                DB::table('enterprise_capabilities')->where('enterprise_id', $enterprise->id)->delete();
                $caps = array_map(function ($c) use ($enterprise) {
                    return [
                        'enterprise_id' => $enterprise->id,
                        'waste_type_id' => $c['waste_type_id'],
                        'max_capacity_kg' => $c['max_capacity_kg'] ?? null,
                        'notes' => $c['notes'] ?? null,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }, $validated['capabilities']);
                DB::table('enterprise_capabilities')->insert($caps);
            }

            if (isset($validated['service_areas'])) {
                DB::table('enterprise_service_areas')->where('enterprise_id', $enterprise->id)->delete();
                $areas = array_map(function ($ward_id) use ($enterprise) {
                    return [
                        'enterprise_id' => $enterprise->id,
                        'ward_id' => $ward_id,
                        'created_at' => now(),
                    ];
                }, $validated['service_areas']);
                DB::table('enterprise_service_areas')->insert($areas);
            }
        });

        return response()->json(['message' => 'Profile updated successfully']);
    }

    public function pointRules(Request $request): JsonResponse
    {
        $rules = PointRule::query()->where('created_by', $request->user()->id)->get();
        return response()->json($rules);
    }

    public function createPointRule(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'waste_type_id' => 'nullable|integer',
            'rule_name' => 'required|string|max:200',
            'description' => 'nullable|string|max:500',
            'condition_type' => 'required|in:valid_request,correct_classification,fast_collection,first_request_of_day,other',
            'points' => 'required|integer',
            'is_active' => 'boolean',
            'effective_from' => 'required|date',
            'effective_to' => 'nullable|date|after_or_equal:effective_from',
        ]);

        $rule = PointRule::query()->create(array_merge($validated, [
            'created_by' => $request->user()->id,
        ]));

        return response()->json(['message' => 'Point rule created successfully', 'rule' => $rule], 201);
    }

    public function reports(Request $request): JsonResponse
    {
        $enterprise = RecyclingEnterprise::query()->where('user_id', $request->user()->id)->first();

        if (!$enterprise) {
            return response()->json(['message' => 'Enterprise profile not found'], 404);
        }

        // Get total collected waste grouped by type and month
        $stats = DB::table('waste_requests')
            ->join('collection_assignments', 'waste_requests.id', '=', 'collection_assignments.request_id')
            ->where('collection_assignments.enterprise_id', $enterprise->id)
            ->where('waste_requests.status', 'collected')
            ->selectRaw('waste_requests.waste_type_id, DATE_FORMAT(waste_requests.collected_at, "%Y-%m") as month, SUM(waste_requests.estimated_weight_kg) as total_weight')
            ->groupBy('waste_requests.waste_type_id', 'month')
            ->orderBy('month', 'desc')
            ->get();

        return response()->json([
            'reports' => $stats,
            'summary' => [
                'total_collected_kg' => $stats->sum('total_weight'),
                'total_requests' => WasteRequest::query()
                    ->join('collection_assignments', 'waste_requests.id', '=', 'collection_assignments.request_id')
                    ->where('collection_assignments.enterprise_id', $enterprise->id)
                    ->where('waste_requests.status', 'collected')
                    ->count(),
            ]
        ]);
    }
}
