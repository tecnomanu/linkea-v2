<?php

namespace App\Models;

use App\Notifications\ResetPasswordNotification;
use App\Support\Helpers\StorageHelper;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Contracts\Auth\CanResetPassword;
use Carbon\Carbon;
use Laravel\Sanctum\HasApiTokens;

use Illuminate\Database\Eloquent\Concerns\HasUuids;

class User extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes, HasUuids, HasApiTokens;

    protected $fillable = [
        "name",
        "first_name",
        "last_name",
        "username",
        "email",
        "birthday",
        "avatar",
        "settings",
        "capability",
        "password",
        "company_id",
        "mautic_id",
        "verified_at",
        "verification_code",
        "mongo_id"
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
    ];

    protected $appends = ['text', 'role_name', 'status'];

    // Accessors

    /**
     * Transform avatar path to full URL (S3 or local).
     */
    protected function avatar(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => StorageHelper::url($value),
            set: fn ($value) => $value,
        );
    }

    public function getTextAttribute()
    {
        return $this->first_name . " " . $this->last_name;
    }

    public function getStatusAttribute()
    {
        return $this->verified_at ? 'verify' : 'pending';
    }

    public function getRoleNameAttribute()
    {
        $role = $this->roles()->first();
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
