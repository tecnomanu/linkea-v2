<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LinkResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->text,
            'url' => $this->link,
            'type' => $this->type,
            'isEnabled' => (bool) $this->state,
            'order' => (int) $this->order,
            'clicks' => (int) ($this->visited ?? 0),
            'icon' => $this->icon,
            'sparklineData' => $this->when(
                isset($this->sparklineData),
                $this->sparklineData
            ),
            // Config fields (flattened for frontend)
            'headerSize' => $this->config['header_size'] ?? null,
            'showInlinePlayer' => $this->config['show_inline_player'] ?? false,
            'autoPlay' => $this->config['auto_play'] ?? false,
            'startMuted' => $this->config['start_muted'] ?? false,
            'playerSize' => $this->config['player_size'] ?? null,
            'phoneNumber' => $this->config['phone_number'] ?? null,
            'predefinedMessage' => $this->config['predefined_message'] ?? null,
        ];
    }
}

