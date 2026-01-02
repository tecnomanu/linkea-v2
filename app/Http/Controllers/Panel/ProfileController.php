<?php

namespace App\Http\Controllers\Panel;

use App\Constants\ResponseMessages;
use App\Http\Controllers\Controller;
use App\Http\Requests\Profile\ChangePasswordRequest;
use App\Models\User;
use App\Services\ImageService;
use App\Services\UserService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * Handles user profile updates from Panel (Inertia).
 * Returns redirects instead of JSON for Inertia forms.
 */
class ProfileController extends Controller
{
    public function __construct(
        protected UserService $userService,
        protected ImageService $imageService
    ) {}

    /**
     * Update user profile information (name, email).
     * OAuth users cannot change their email.
     */
    public function update(Request $request): RedirectResponse
    {
        /** @var User $user */
        $user = Auth::user();

        // Build validation rules - email is only editable for non-OAuth users
        $rules = [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
        ];

        $messages = [
            'first_name.required' => 'El nombre es obligatorio.',
            'last_name.required' => 'El apellido es obligatorio.',
        ];

        // Only allow email change for non-OAuth users
        if (!$user->is_oauth_user) {
            $rules['email'] = 'required|email|max:255|unique:users,email,' . $user->id;
            $messages['email.required'] = 'El correo electrónico es obligatorio.';
            $messages['email.email'] = 'El correo electrónico no es válido.';
            $messages['email.unique'] = 'Este correo electrónico ya está en uso.';
        }

        $request->validate($rules, $messages);

        // Build update data
        $updateData = [
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
        ];

        // Only update email for non-OAuth users (prevents injection attacks)
        if (!$user->is_oauth_user && $request->has('email')) {
            $updateData['email'] = $request->email;
        }

        $user->update($updateData);

        return back()->with('success', 'Perfil actualizado correctamente.');
    }

    /**
     * Update user password.
     * OAuth users cannot change password (they don't have one).
     */
    public function updatePassword(ChangePasswordRequest $request): RedirectResponse
    {
        /** @var User $user */
        $user = Auth::user();

        // OAuth users cannot change password
        if ($user->is_oauth_user) {
            return back()->withErrors(['current_password' => 'Los usuarios de Google/Apple no pueden cambiar la contraseña.']);
        }

        // Verify current password
        if (!$this->userService->verifyPassword($user, $request->current_password)) {
            return back()->withErrors(['current_password' => 'La contraseña actual es incorrecta.']);
        }

        $this->userService->changePassword($user, $request->password);

        return back()->with('success', 'Contraseña actualizada correctamente.');
    }

    /**
     * Update user avatar (receives base64 from ImageUploader).
     */
    public function updateAvatar(Request $request): RedirectResponse
    {
        $request->validate([
            'avatar' => 'required|string',
            'type' => 'nullable|string',
        ], [
            'avatar.required' => 'Seleccioná una imagen.',
        ]);

        /** @var User $user */
        $user = Auth::user();

        // Save from base64 (same as Design tab)
        $savedAvatar = $this->imageService->saveAvatar([
            'base64_image' => $request->avatar,
            'type' => 'image/' . ($request->type ?? 'png'),
        ], $user->id);

        if ($savedAvatar) {
            $user->update(['avatar' => $savedAvatar['image']]);
            return back()->with('success', 'Imagen actualizada correctamente.');
        }

        return back()->withErrors(['avatar' => 'Error al guardar la imagen.']);
    }
}

