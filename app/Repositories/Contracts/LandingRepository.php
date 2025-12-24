<?php

namespace App\Repositories\Contracts;

interface LandingRepository extends BaseRepository
{
    public function findBySlug($slug);
    public function findByDomain($domain);
    public function getByUserId($userId);
}
