<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LandingStatistic extends Model
{
    protected $fillable = [
        'landing_id',
        'date',
        'views',
    ];

    protected $casts = [
        'date' => 'date',
        'views' => 'integer',
    ];

    public function landing(): BelongsTo
    {
        return $this->belongsTo(Landing::class);
    }
}

