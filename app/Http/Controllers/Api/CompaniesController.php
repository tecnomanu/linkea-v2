<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Traits\RESTActions;

class CompaniesController extends Controller
{
    const MODEL = Company::class;
    use RESTActions;
}
