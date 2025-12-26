<?php

namespace App\Services;

use App\Constants\UserRoles;
use App\Models\Role;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;

/**
 * Service for role-related operations.
 */
class RoleService
{
    /**
     * Get paginated roles filtered by user permissions.
     */
    public function getPaginatedForUser(User $user, Request $request): LengthAwarePaginator
    {
        $perPage = (int) $request->get('per_page', 10);
        $order = $request->get('order', 'desc');
        $orderBy = $request->get('order_by', 'id');
        $search = $request->get('q');

        $query = Role::query()
            ->orderBy($orderBy, $order)
            ->when(!$user->hasRole(UserRoles::ROOT), function ($query) use ($user) {
                $query->where('type', '!=', UserRoles::ROOT);
                if ($user->hasRole(UserRoles::USER)) {
                    $query->where('type', '!=', UserRoles::ADMIN);
                }
            })
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('type', 'like', "%{$search}%");
                });
            });

        return $query->paginate($perPage);
    }

    /**
     * Find role by ID.
     */
    public function find(string $id): ?Role
    {
        return Role::find($id);
    }

    /**
     * Create a new role.
     */
    public function create(array $data): Role
    {
        return Role::create($data);
    }

    /**
     * Update a role.
     */
    public function update(Role $role, array $data): Role
    {
        $role->update($data);
        return $role->fresh();
    }

    /**
     * Delete a role.
     */
    public function delete(Role $role): bool
    {
        return $role->delete();
    }
}

