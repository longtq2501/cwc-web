<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $items = Notification::query()
            ->where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->paginate(20);

        return response()->json($items);
    }

    public function markRead(Request $request, int $notificationId): JsonResponse
    {
        $item = Notification::query()
            ->where('id', $notificationId)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$item) {
            return response()->json(['message' => 'Notification not found'], 404);
        }

        $item->update(['is_read' => true]);

        return response()->json([
            'message' => 'Notification marked as read',
            'data' => $item,
        ]);
    }

    public function markAllRead(Request $request): JsonResponse
    {
        Notification::query()
            ->where('user_id', $request->user()->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json([
            'message' => 'All notifications marked as read',
        ]);
    }
}
