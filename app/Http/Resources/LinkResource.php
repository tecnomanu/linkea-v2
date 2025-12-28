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

            // Media specific
            'mediaDisplayMode' => $this->config['media_display_mode'] ?? null,

            // Calendar specific
            'calendarProvider' => $this->config['calendar_provider'] ?? null,
            'calendarDisplayMode' => $this->config['calendar_display_mode'] ?? null,

            // Email specific
            'emailAddress' => $this->config['email_address'] ?? null,
            'emailSubject' => $this->config['email_subject'] ?? null,
            'emailBody' => $this->config['email_body'] ?? null,

            // Map specific
            'mapAddress' => $this->config['map_address'] ?? null,
            'mapQuery' => $this->config['map_query'] ?? null,
            'mapZoom' => $this->config['map_zoom'] ?? null,
            'mapDisplayMode' => $this->config['map_display_mode'] ?? null,
            'mapShowAddress' => $this->config['map_show_address'] ?? false,
        ];
    }
}
