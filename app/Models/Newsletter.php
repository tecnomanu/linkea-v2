<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Newsletter extends Model
{
    use HasFactory, SoftDeletes, HasUuids;

    protected $fillable = [
        'subject',
        'message',
        'status',
        'sent',
        'mongo_id',
    ];

    protected $casts = [
        'sent' => 'boolean',
    ];

    protected $appends = ['viewed_count'];

    // Accessors

    /**
     * Total view count across all users.
     */
    public function getViewedCountAttribute(): int
    {
        return $this->users->sum('pivot.viewed_count') ?? 0;
    }

    // Relationships

    /**
     * Users who received this newsletter.
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'newsletter_user')
            ->withPivot(['date', 'sent', 'viewed_count', 'ip'])
            ->withTimestamps();
    }

    // Scopes

    /**
     * Get sent newsletters.
     */
    public function scopeSent($query)
    {
        return $query->where('sent', true);
    }

    /**
     * Get draft newsletters.
     */
    public function scopeDraft($query)
    {
        return $query->where('sent', false);
    }
}
