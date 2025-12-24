<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LinkStatistic extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'link_id',
        'date',
        'visits',
    ];

    protected $casts = [
        'date' => 'date',
        'visits' => 'integer',
    ];

    /**
     * Get the link that owns the statistic
     */
    public function link()
    {
        return $this->belongsTo(Link::class);
    }
}
