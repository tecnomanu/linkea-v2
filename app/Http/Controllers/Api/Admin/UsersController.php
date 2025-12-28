<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Models\Landing;
use App\Services\UserService;
use App\Traits\HasApiResponse;
use App\Traits\RESTActions;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UsersController extends Controller
{
    use RESTActions, HasApiResponse;

    const MODEL = User::class;

    public function __construct(
        protected UserService $userService
    ) {}

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
                        ->orWhere('email', 'like', "%{$search}%");
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

    /**
     * Create a new user.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'first_name' => 'required|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'username' => 'required|string', // Used for landing creation
        ]);

        $user = User::create([
            'email' => strtolower($validated['email']),
            'password' => Hash::make($validated['password']),
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'] ?? '',
            'name' => trim(($validated['first_name'] ?? '') . ' ' . ($validated['last_name'] ?? '')),
            'verified_at' => now(), // Admin creates verified users by default
        ]);

        // Create default landing using 'username' as slug
        // Note: We use the AuthService login in tests, but here we do manual creation as Admin
        // Creating a simple landing for the user
        if (!empty($validated['username'])) {
            // Basic landing creation similar to LandingService but simplified
            $landing = Landing::create([
                'user_id' => $user->id,
                'name' => $user->name,
                'slug' => \App\Support\Helpers\StringHelper::normalizeHandle($validated['username']),
                'domain_name' => \App\Support\Helpers\StringHelper::normalizeHandle($validated['username']),
                'verify' => true,
            ]);
        }

        return $this->created(new UserResource($user));
    }

    /**
     * Update a user.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'email' => ['sometimes', 'email', Rule::unique('users')->ignore($user->id)],
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'password' => 'nullable|string|min:8',
            'name' => 'sometimes|string|max:255',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return $this->success(new UserResource($user));
    }

    /**
     * Soft delete a user.
     */
    public function destroy(string $id): JsonResponse
    {
        $user = User::findOrFail($id);
        $user->delete();

        return $this->success(null, 'User deleted successfully');
    }
}
