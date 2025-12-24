<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Traits\RESTActions;

class UsersController extends Controller
{
    const MODEL = User::class;
    use RESTActions;
}
