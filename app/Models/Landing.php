<?php

namespace App\Models;

use App\Support\Helpers\StorageHelper;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Landing extends Model
{
    use HasFactory, SoftDeletes, HasUuids;

    protected $fillable = [
        'name',
        'slug',
        'logo',
        'verify',
        'domain_name',
        'views',
        'company_id',
        'user_id',
        'template_config',
        'options',
        'mongo_id',
    ];

    protected $casts = [
        'template_config' => 'array',
        'options' => 'array',
        'verify' => 'boolean',
    ];

    protected $appends = ['text'];

    // Accessors

    public function getTextAttribute(): string
    {
        return $this->name ?? '';
    }

    /**
     * Transform logo paths to full URLs (S3 or local).
     */
    protected function logo(): Attribute
    {
        return Attribute::make(
            get: function ($value) {
                $logo = is_string($value) ? json_decode($value, true) : $value;
                return StorageHelper::logoUrls($logo);
            },
            set: fn($value) => is_array($value) ? json_encode($value) : $value,
        );
    }

    // Relationships

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function links(): HasMany
    {
        return $this->hasMany(Link::class)
            ->where('group', 'links')
            ->orderBy('order', 'asc');
    }

    public function socials(): HasMany
    {
        return $this->hasMany(Link::class)
            ->where('group', 'socials')
            ->orderBy('order', 'asc');
    }

    public function allLinks(): HasMany
    {
        return $this->hasMany(Link::class);
    }

    public function statistics(): HasMany
    {
        return $this->hasMany(LandingStatistic::class);
    }
}
