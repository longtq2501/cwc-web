<?php

namespace App\Http\Controllers;

use App\Models\Collector;
use App\Models\RecyclingEnterprise;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'full_name' => ['required', 'string', 'max:150'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'phone' => ['nullable', 'string', 'max:20', 'unique:users,phone'],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
            'ward_id' => ['nullable', 'integer', 'exists:wards,id'],
            'role' => ['nullable', 'string', 'in:citizen,enterprise,collector'],
        ]);

        $roleName = $request->input('role', 'citizen');
        $roleId = Role::query()->where('name', $roleName)->value('id');

        if (!$roleId) {
            throw ValidationException::withMessages([
                'role' => ["Role {$roleName} is not seeded yet."],
            ]);
        }

        $user = User::query()->create([
            'role_id' => $roleId,
            'full_name' => $validated['full_name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'password_hash' => Hash::make($validated['password']),
            'ward_id' => $validated['ward_id'] ?? null,
            'is_active' => true,
            'is_deleted' => false,
        ]);

        // Auto-create profiles based on role
        if ($roleName === 'enterprise') {
            RecyclingEnterprise::query()->create([
                'user_id' => $user->id,
                'enterprise_name' => $user->full_name,
                'status' => 'pending', // Admins need to approve
            ]);
        } elseif ($roleName === 'collector') {
            // Find the first enterprise to assign to this collector (for testing/demo)
            $firstEnterprise = RecyclingEnterprise::query()->first();
            
            Collector::query()->create([
                'user_id' => $user->id,
                'enterprise_id' => $firstEnterprise ? $firstEnterprise->id : 1, // Fallback to ID 1
                'status' => 'active',
            ]);
        }

        $user->load('role');
        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'message' => 'Registered successfully',
            'token' => $token,
            'user' => $this->userPayload($user),
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::query()
            ->where('email', $credentials['email'])
            ->where('is_active', true)
            ->where('is_deleted', false)
            ->first();

        if (!$user || !Hash::check($credentials['password'], $user->password_hash)) {
            return response()->json([
                'message' => 'Invalid credentials',
            ], 401);
        }

        $user->load('role');
        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'user' => $this->userPayload($user),
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->load('role');

        return response()->json([
            'user' => $this->userPayload($user),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()?->currentAccessToken()?->delete();

        return response()->json([
            'message' => 'Logged out',
        ]);
    }

    private function userPayload(User $user): array
    {
        return [
            'id' => $user->id,
            'full_name' => $user->full_name,
            'email' => $user->email,
            'phone' => $user->phone,
            'role' => $user->role?->name,
            'ward_id' => $user->ward_id,
            'is_active' => (bool) $user->is_active,
        ];
    }
}
