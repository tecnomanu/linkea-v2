<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\Contracts\UserRepository;
use Illuminate\Support\Facades\Hash;

/**
 * Service for user-related operations.
 */
class UserService
{
    public function __construct(
        protected UserRepository $userRepository,
        protected ImageService $imageService
    ) {}

    /**
     * Get user by ID with relations.
     */
    public function getWithRelations(string $userId, array $relations = ['company', 'roles']): ?User
    {
        $user = $this->userRepository->find($userId);

        if ($user) {
            $user->load($relations);
        }

        return $user;
    }

    /**
     * Update user profile data.
     */
    public function updateProfile(User $user, array $data): User
    {
        // Filter out protected fields
        $allowedFields = ['name', 'first_name', 'last_name', 'birthday', 'avatar'];
        $filteredData = array_intersect_key($data, array_flip($allowedFields));

        // Handle avatar upload if base64
        if (isset($filteredData['avatar']) && is_array($filteredData['avatar'])) {
            $savedAvatar = $this->imageService->saveAvatar($filteredData['avatar'], $user->id);
            if ($savedAvatar) {
                $filteredData['avatar'] = $savedAvatar['image'];
            } else {
                unset($filteredData['avatar']);
            }
        }

        $user->update($filteredData);

        return $user->fresh();
    }

    /**
     * Update user settings.
     */
    public function updateSettings(User $user, array $settings): User
    {
        $currentSettings = $user->settings ?? [];
        $user->settings = array_merge($currentSettings, $settings);
        $user->save();

        return $user;
    }

    /**
     * Change user password.
     */
    public function changePassword(User $user, string $newPassword): bool
    {
        $user->password = Hash::make($newPassword);
        return $user->save();
    }

    /**
     * Verify current password.
     */
    public function verifyPassword(User $user, string $password): bool
    {
        return Hash::check($password, $user->password);
    }

    /**
     * Check if user has specific role.
     */
    public function hasRole(User $user, string $role): bool
    {
        return $user->hasRole($role);
    }

    /**
     * Get user's primary landing.
     */
    public function getPrimaryLanding(User $user): ?\App\Models\Landing
    {
        return $user->landings()->first();
    }
}
