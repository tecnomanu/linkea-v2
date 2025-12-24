<?php

namespace App\Repositories\Contracts;

interface UserRepository extends BaseRepository
{
    public function findByEmail($email);
    public function findByUsername($username);
}
