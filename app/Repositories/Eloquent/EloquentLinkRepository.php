<?php

namespace App\Repositories\Eloquent;

use App\Models\Link;
use App\Repositories\Contracts\LinkRepository;

class EloquentLinkRepository extends AbstractEloquentRepository implements LinkRepository
{
    public function __construct(Link $model)
    {
        parent::__construct($model);
    }

    public function getByLandingId($landingId)
    {
        return $this->model->where('landing_id', $landingId)->orderBy('order', 'asc')->get();
    }
}
