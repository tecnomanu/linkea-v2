<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Company extends Model
{
    use SoftDeletes, HasUuids;

    protected $fillable = ["name", "owner_id", "membership_id", "mongo_id"];

    protected $appends = ['text'];

    // Accessors
    public function getTextAttribute()
    {
        return $this->name;
    }

    // Relationships
    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function landings()
    {
        return $this->hasMany(Landing::class);
    }

    public function membership()
    {
        return $this->belongsTo(Membership::class);
    }
}
