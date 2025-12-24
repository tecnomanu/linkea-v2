<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\CompanyResource;
use App\Models\Company;
use App\Traits\HasApiResponse;
use App\Traits\RESTActions;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CompaniesController extends Controller
{
    use RESTActions, HasApiResponse;

    const MODEL = Company::class;

    /**
     * Get all companies paginated.
     */
    public function all(Request $request): JsonResponse
    {
        $perPage = (int) $request->get('per_page', 10);
        $order = $request->get('order', 'desc');
        $orderBy = $request->get('order_by', 'created_at');
        $search = $request->get('q');

        $query = Company::query()
            ->with('owner')
            ->orderBy($orderBy, $order)
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('slug', 'like', "%{$search}%");
                });
            });

        $companies = $query->paginate($perPage);

        return $this->success([
            'data' => CompanyResource::collection($companies),
            'meta' => [
                'current_page' => $companies->currentPage(),
                'last_page' => $companies->lastPage(),
                'per_page' => $companies->perPage(),
                'total' => $companies->total(),
            ],
        ]);
    }
}

