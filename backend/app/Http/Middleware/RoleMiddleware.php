<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return new JsonResponse([
                'message' => 'Unauthorized',
            ], 401);
        }

        $roleName = $user->role?->name;

        if (!$roleName || !in_array($roleName, $roles, true)) {
            return new JsonResponse([
                'message' => 'Forbidden',
            ], 403);
        }

        return $next($request);
    }
}
