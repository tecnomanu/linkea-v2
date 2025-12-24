<?php

namespace App\Http\Controllers\Api;

use App\Constants\UserRoles;
use App\Http\Controllers\Controller;
use App\Http\Resources\RoleResource;
use App\Models\Role;
use App\Models\User;
use App\Traits\HasApiResponse;
use App\Traits\RESTActions;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RolesController extends Controller
{
    use RESTActions, HasApiResponse;

    const MODEL = Role::class;

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

        $roles = $query->paginate($perPage);

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
}
