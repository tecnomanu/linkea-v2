<?php

namespace App\Repositories\Contracts;

interface LinkRepository extends BaseRepository
{
    public function getByLandingId($landingId);
}
