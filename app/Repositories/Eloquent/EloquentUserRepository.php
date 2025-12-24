<?php

namespace App\Repositories\Eloquent;

use App\Models\User;
use App\Repositories\Contracts\UserRepository;

class EloquentUserRepository extends AbstractEloquentRepository implements UserRepository
{
    public function __construct(User $model)
    {
        parent::__construct($model);
    }

    public function findByEmail($email)
    {
        return $this->model->where('email', $email)->first();
    }

    public function findByUsername($username)
    {
        return $this->model->where('username', $username)->first();
    }
}
