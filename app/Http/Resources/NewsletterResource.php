<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NewsletterResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'subject' => $this->subject,
            'message' => $this->message,
            'status' => $this->status,
            'sent' => (bool) $this->sent,
            'viewed_count' => $this->viewed_count,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),

            // Relations (when loaded)
            'users' => $this->whenLoaded('users', function () {
                return $this->users->map(fn($user) => [
                    'id' => $user->id,
                    'name' => $user->text,
                    'email' => $user->email,
                    'sent' => (bool) $user->pivot->sent,
                    'viewed_count' => (int) $user->pivot->viewed_count,
                    'date' => $user->pivot->date,
                ]);
            }),
        ];
    }
}

