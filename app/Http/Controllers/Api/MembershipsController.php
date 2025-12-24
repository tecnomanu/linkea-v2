<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Membership;
use App\Traits\RESTActions;

class MembershipsController extends Controller
{
    const MODEL = Membership::class;
    use RESTActions;
}
