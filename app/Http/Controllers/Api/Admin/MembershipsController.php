<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Membership;
use App\Traits\HasApiResponse;
use App\Traits\RESTActions;

class MembershipsController extends Controller
{
    use RESTActions, HasApiResponse;

    const MODEL = Membership::class;
}

