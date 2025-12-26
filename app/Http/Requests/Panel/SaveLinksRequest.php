<?php

namespace App\Http\Requests\Panel;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SaveLinksRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'links' => 'present|array',
            'links.*.id' => 'nullable|string',
            'links.*.title' => 'nullable|string|max:255',  // Nullable for social links
            'links.*.url' => 'nullable|string|max:2048',   // Nullable for headers
            'links.*.type' => ['required', 'string', Rule::in([
                // Standard link types
                'link',
                'button',
                'classic',
                // Headers
                'header',
                'heading',
                // Social
                'social',
                // Embeds
                'youtube',
                'spotify',
                'soundcloud',
                'tiktok',
                'twitch',
                'vimeo',
                // Messaging
                'whatsapp',
                'email',
                // Scheduling & Leads
                'calendar',
                // Contact & Forms
                'map',
                'contact',
                // Legacy/other
                'mastodon',
                'twitter',
                'video',
                'music'
            ])],
            'links.*.isEnabled' => 'boolean',
            'links.*.order' => 'required|integer|min:0',
            'links.*.icon' => 'nullable|array',
            'links.*.headerSize' => 'nullable|string|in:small,medium,large',
            'links.*.mediaDisplayMode' => 'nullable|string|in:button,preview,both',
            'links.*.showInlinePlayer' => 'nullable|boolean',
            'links.*.autoPlay' => 'nullable|boolean',
            'links.*.startMuted' => 'nullable|boolean',
            'links.*.playerSize' => 'nullable|string',
            'links.*.phoneNumber' => 'nullable|string|max:20',
            'links.*.predefinedMessage' => 'nullable|string|max:1000',
            // Calendar specific
            'links.*.calendarProvider' => 'nullable|string|in:calendly,cal,acuity,other',
            'links.*.calendarDisplayMode' => 'nullable|string|in:button,inline',
            // Email specific
            'links.*.emailAddress' => 'nullable|email|max:255',
            'links.*.emailSubject' => 'nullable|string|max:255',
            'links.*.emailBody' => 'nullable|string|max:1000',
            // Map specific
            'links.*.mapAddress' => 'nullable|string|max:500',
            'links.*.mapQuery' => 'nullable|string|max:500',
            'links.*.mapZoom' => 'nullable|integer|min:1|max:21',
            'links.*.mapDisplayMode' => 'nullable|string|in:button,inline',
            'links.*.mapShowAddress' => 'nullable|boolean',
            // Video embeds
            'links.*.videoId' => 'nullable|string|max:255',
            // SoundCloud
            'links.*.soundcloudUrl' => 'nullable|string|max:2048',
        ];
    }

    public function messages(): array
    {
        return [
            'links.*.title.required' => 'Each link must have a title',
            'links.*.url.required' => 'Each link must have a URL',
            'links.*.type.required' => 'Each link must have a type',
            'links.*.type.in' => 'Invalid link type provided',
        ];
    }

    /**
     * Transform frontend data structure to backend format
     */
    public function toServiceFormat(): array
    {
        return collect($this->validated()['links'] ?? [])->map(function ($link, $index) {
            return [
                'id' => $link['id'] ?? null,
                'text' => $link['title'],
                'link' => $link['url'],
                'type' => $link['type'],
                'state' => $link['isEnabled'] ?? true,
                'order' => $link['order'] ?? $index,
                'group' => $link['type'] === 'social' ? 'socials' : 'links',
                'icon' => $link['icon'] ?? null,
                'config' => $this->extractConfig($link),
            ];
        })->toArray();
    }

    protected function extractConfig(array $link): ?array
    {
        $config = array_filter([
            'header_size' => $link['headerSize'] ?? null,
            'media_display_mode' => $link['mediaDisplayMode'] ?? null,
            'show_inline_player' => $link['showInlinePlayer'] ?? null,
            'auto_play' => $link['autoPlay'] ?? null,
            'start_muted' => $link['startMuted'] ?? null,
            'player_size' => $link['playerSize'] ?? null,
            'phone_number' => $link['phoneNumber'] ?? null,
            'predefined_message' => $link['predefinedMessage'] ?? null,
            // Calendar specific
            'calendar_provider' => $link['calendarProvider'] ?? null,
            'calendar_display_mode' => $link['calendarDisplayMode'] ?? null,
            // Email specific
            'email_address' => $link['emailAddress'] ?? null,
            'email_subject' => $link['emailSubject'] ?? null,
            'email_body' => $link['emailBody'] ?? null,
            // Map specific
            'map_address' => $link['mapAddress'] ?? null,
            'map_query' => $link['mapQuery'] ?? null,
            'map_zoom' => $link['mapZoom'] ?? null,
            'map_display_mode' => $link['mapDisplayMode'] ?? null,
            'map_show_address' => $link['mapShowAddress'] ?? null,
            // Video embeds
            'video_id' => $link['videoId'] ?? null,
            // SoundCloud
            'soundcloud_url' => $link['soundcloudUrl'] ?? null,
        ], fn($v) => $v !== null);

        return empty($config) ? null : $config;
    }
}
