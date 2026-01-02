<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Link extends Model
{
    use HasFactory, SoftDeletes, HasUuids;

    protected $fillable = [
        "slug",
        "state",
        "text",
        "group",
        "type",
        "link",
        "icon",
        "image",
        "order",
        "options",
        "config",
        "landing_id",
        "visited",
        "mongo_id"
    ];

    protected $casts = [
        'state' => 'boolean',
        'icon' => 'array',
        'image' => 'array',
        'options' => 'array',
        'config' => 'array',
        'visited' => 'integer',
        'order' => 'integer',
    ];

    // Relationships
    public function landing()
    {
        return $this->belongsTo(Landing::class);
    }

    public function statistics()
    {
        return $this->hasMany(LinkStatistic::class);
    }
}
