<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Role extends Model
{
    use SoftDeletes, HasUuids;

    protected $fillable = ["name", "type"];

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_role');
    }
}
