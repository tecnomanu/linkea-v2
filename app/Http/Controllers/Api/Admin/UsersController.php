<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Traits\HasApiResponse;
use App\Traits\RESTActions;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UsersController extends Controller
{
    use RESTActions, HasApiResponse;

    const MODEL = User::class;

    /**
     * Get all users paginated.
     */
    public function all(Request $request): JsonResponse
    {
        $perPage = (int) $request->get('per_page', 10);
        $order = $request->get('order', 'desc');
        $orderBy = $request->get('order_by', 'created_at');
        $search = $request->get('q');

        $query = User::query()
            ->with(['company', 'roles'])
            ->orderBy($orderBy, $order)
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('username', 'like', "%{$search}%");
                });
            });

        $users = $query->paginate($perPage);

        return $this->success([
            'data' => UserResource::collection($users),
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
            ],
        ]);
    }
}

