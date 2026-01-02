<?php

namespace App\Models;

use App\Notifications\ResetPasswordNotification;
use App\Support\Helpers\StorageHelper;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Sanctum\HasApiTokens;

use Illuminate\Database\Eloquent\Concerns\HasUuids;

class User extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes, HasUuids, HasApiTokens;

    protected $fillable = [
        "name",
        "first_name",
        "last_name",
        "email",
        "birthday",
        "avatar",
        "settings",
        "capability",
        "password",
        "company_id",
        "mautic_id",
        "sendernet_id",
        "verified_at",
        "verification_code",
        "mongo_id",
        "google_id",
        "apple_id"
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'verification_code'
    ];

    protected $casts = [
        'verified_at' => 'datetime',
        'birthday' => 'date',
        'settings' => 'array',
        'capability' => 'array',
        'avatar' => 'array', // JSON with 'image' and 'thumb' paths
    ];

    protected $appends = ['text', 'role_name', 'status', 'is_oauth_user', 'avatar_url', 'avatar_thumb'];
    // Accessors

    /**
     * Get avatar main image URL.
     */
    public function getAvatarUrlAttribute(): ?string
    {
        $avatar = $this->avatar;
        if (!$avatar) return null;

        $path = is_array($avatar) ? ($avatar['image'] ?? null) : $avatar;
        return $path ? StorageHelper::url($path) : null;
    }

    /**
     * Get thumbnail URL for avatar. Falls back to main image if no thumb.
     */
    public function getAvatarThumbAttribute(): ?string
    {
        $avatar = $this->avatar;
        if (!$avatar) return null;

        $path = is_array($avatar) ? ($avatar['thumb'] ?? $avatar['image'] ?? null) : $avatar;
        return $path ? StorageHelper::url($path) : null;
    }

    public function getTextAttribute()
    {
        return $this->first_name . " " . $this->last_name;
    }

    public function getStatusAttribute()
    {
        return $this->verified_at ? 'verify' : 'pending';
    }

    /**
     * Check if user registered via OAuth (Google/Apple).
     * OAuth users cannot change their email.
     */
    public function getIsOAuthUserAttribute(): bool
    {
        return !empty($this->google_id) || !empty($this->apple_id);
    }

    public function getRoleNameAttribute()
    {
        // Use collection access ->roles to utilize eager loading
        // ->roles() would force a new query
        $role = $this->roles->first();
        return $role ? $role->type : null;
    }

    // Relationships
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'user_role');
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function landings()
    {
        return $this->hasMany(Landing::class);
    }

    public function notifications()
    {
        return $this->belongsToMany(Notification::class, 'notification_user')
            ->withPivot(['read', 'viewed'])
            ->withTimestamps();
    }

    public function newsletters()
    {
        return $this->belongsToMany(Newsletter::class, 'newsletter_user')
            ->withPivot(['date', 'sent', 'viewed_count', 'ip'])
            ->withTimestamps();
    }

    // Helpers
    public function hasRole($role)
    {
        return $this->roles()->where('type', $role)->exists();
    }

    /**
     * Send the password reset notification.
     * Override to use our custom Spanish notification.
     */
    public function sendPasswordResetNotification($token): void
    {
        $this->notify(new ResetPasswordNotification($token));
    }
}
