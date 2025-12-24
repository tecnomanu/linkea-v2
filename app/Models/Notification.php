<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Notification extends Model
{
    use HasFactory, SoftDeletes, HasUuids;

    protected $fillable = [
        'title',
        'text',
        'type',
        'icon',
        'data',
    ];

    protected $casts = [
        'icon' => 'array',
        'data' => 'array',
    ];

    protected $appends = ['message'];

    // Accessors

    /**
     * Alias for text field (backwards compatibility).
     */
    public function getMessageAttribute(): ?string
    {
        return $this->text;
    }

    // Relationships

    /**
     * Users who received this notification.
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'notification_user')
            ->withPivot(['read', 'viewed'])
            ->withTimestamps();
    }

    // Scopes

    /**
     * Get unread notifications for a user.
     */
    public function scopeUnreadFor($query, string $userId)
    {
        return $query->whereHas('users', function ($q) use ($userId) {
            $q->where('user_id', $userId)->where('read', false);
        });
    }

    /**
     * Get unviewed notifications for a user.
     */
    public function scopeUnviewedFor($query, string $userId)
    {
        return $query->whereHas('users', function ($q) use ($userId) {
            $q->where('user_id', $userId)->where('viewed', false);
        });
    }
}
