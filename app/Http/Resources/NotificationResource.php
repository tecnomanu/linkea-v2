<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'message' => $this->message,
            'type' => $this->type,
            'data' => $this->data,
            'created_at' => $this->created_at?->toISOString(),

            // Pivot data (when loaded via user relationship)
            'read' => $this->whenPivotLoaded('notification_user', fn() => (bool) $this->pivot->read),
            'viewed' => $this->whenPivotLoaded('notification_user', fn() => (bool) $this->pivot->viewed),
        ];
    }
}
