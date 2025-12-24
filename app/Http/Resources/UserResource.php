<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'username' => $this->username,
            'email' => $this->email,
            'avatar' => $this->avatar,
            'birthday' => $this->birthday?->format('Y-m-d'),
            'status' => $this->status,
            'role_name' => $this->role_name,
            'verified_at' => $this->verified_at?->toISOString(),
            'settings' => $this->settings,
            'created_at' => $this->created_at?->toISOString(),

            // Relations (when loaded)
            'company' => new CompanyResource($this->whenLoaded('company')),
            'roles' => $this->whenLoaded('roles', fn() => $this->roles->pluck('name')),
        ];
    }
}
