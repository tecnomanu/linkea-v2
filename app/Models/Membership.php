<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Membership extends Model
{
    use HasFactory, SoftDeletes, HasUuids;

    protected $fillable = ["name", "type", "price", "features", "mongo_id"];

    protected $casts = [
        'features' => 'array',
        'price' => 'decimal:2',
    ];



    public function getTextAttribute()
    {
        return $this->name;
    }

    //RelationShips
    public function company()
    {
        return $this->hasMany("App\Models\Company");
    }

    //Functions
    public function getRelationshipsAttributes()
    {
        $this->company;
    }
}
