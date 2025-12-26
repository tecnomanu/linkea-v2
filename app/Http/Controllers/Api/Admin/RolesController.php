<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\RoleResource;
use App\Models\User;
use App\Services\RoleService;
use App\Traits\HasApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RolesController extends Controller
{
    use HasApiResponse;

    public function __construct(
        protected RoleService $roleService
    ) {}

    /**
     * Get paginated roles with filtering based on user permissions.
     */
    public function all(Request $request): JsonResponse
    {
        /** @var User|null $user */
        $user = Auth::user();

        if (!$user) {
            return $this->unauthorized();
        }

        $roles = $this->roleService->getPaginatedForUser($user, $request);

        return $this->success([
            'data' => RoleResource::collection($roles),
            'meta' => [
                'current_page' => $roles->currentPage(),
                'last_page' => $roles->lastPage(),
                'per_page' => $roles->perPage(),
                'total' => $roles->total(),
            ],
        ]);
    }

    /**
     * Get single role.
     */
    public function get(string $id): JsonResponse
    {
        $role = $this->roleService->find($id);

        if (!$role) {
            return $this->notFound();
        }

        return $this->success(new RoleResource($role));
    }

    /**
     * Create new role.
     */
    public function add(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:50',
        ]);

        $role = $this->roleService->create($data);

        return $this->created(new RoleResource($role));
    }

    /**
     * Update role.
     */
    public function put(Request $request, string $id): JsonResponse
    {
        $role = $this->roleService->find($id);

        if (!$role) {
            return $this->notFound();
        }

        $data = $request->validate([
            'name' => 'nullable|string|max:255',
            'type' => 'nullable|string|max:50',
        ]);

        $updated = $this->roleService->update($role, array_filter($data));

        return $this->success(new RoleResource($updated));
    }

    /**
     * Delete role.
     */
    public function remove(string $id): JsonResponse
    {
        $role = $this->roleService->find($id);

        if (!$role) {
            return $this->notFound();
        }

        $this->roleService->delete($role);

        return $this->success(null, 'Role eliminado');
    }
}

