<?php

namespace App\Repositories\Eloquent;

use App\Models\Landing;
use App\Repositories\Contracts\LandingRepository;

class EloquentLandingRepository extends AbstractEloquentRepository implements LandingRepository
{
    public function __construct(Landing $model)
    {
        parent::__construct($model);
    }

    public function findBySlug($slug)
    {
        return $this->model->where('slug', $slug)->first();
    }

    public function findByDomain($domain)
    {
        return $this->model->where('domain_name', $domain)->first();
    }

    public function getByUserId($userId)
    {
        return $this->model->where('user_id', $userId)->get();
    }
}
