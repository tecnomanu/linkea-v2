<?php

namespace App\Traits;

use Illuminate\Http\Response;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Request;

trait RESTActions
{
    public function all()
    {
        try {
            $m = self::MODEL;
            $data = $m::all();
            return $this->respond(Response::HTTP_OK, $data);
        } catch (\Exception $e) {
            return response()->json(["error" => $e->getMessage()], 500);
        }
    }

    public function get($id)
    {
        try {
            $m = self::MODEL;
            $model = $m::find($id);
            if (is_null($model)) {
                return $this->respond(Response::HTTP_NOT_FOUND);
            }
            // Logic for relationships?
            // Legacy: if($model && method_exists($model, 'getRelationshipsAttributes')) $model->getRelationshipsAttributes();
            if (method_exists($model, 'getRelationshipsAttributes')) {
                $model->getRelationshipsAttributes();
            }
            return $this->respond(Response::HTTP_OK, $model);
        } catch (\Exception $e) {
            return response()->json(["error" => $e->getMessage()], 500);
        }
    }

    public function add(Request $request)
    {
        // ... (Usually handled by specific controllers like register? But for generic CRUD)
        // Legacy RESTActions had `add` method calling `saveItem`.
        // Let's implement generic add if needed.
        // Legacy code for `add`:
        /*
            public function add(Request $request) {
                try {
                    $m = self::MODEL;
                    $rules = $m::$rules ?? [];
                    Helpers::validate($request, $rules);
                    $data = $request->all();
                    $model = $m::create($data); // saveItem logic?
                    return $this->respond(Response::HTTP_CREATED, $model);
                } ...
            }
        */
        // I will implement basic add.
        return $this->respond(Response::HTTP_NOT_IMPLEMENTED);
    }

    public function put(Request $request, $id)
    {
        return $this->respond(Response::HTTP_NOT_IMPLEMENTED);
    }

    // Stub methods that were in legacy RESTActions if strictly needed, mostly used by specific controllers overriding them.
    // Legacy `LandingsController` overrides `get`, `put`.
    // `LinksController` uses `createOrUpdate` instead of `add/put`.
    // So generic `add/put` might not be used heavily, but `remove/destroy` is used by `LinksController`.

    public function remove($id)
    {
        try {
            $m = self::MODEL;
            $model = $m::find($id);
            if (is_null($model)) {
                return $this->respond(Response::HTTP_NOT_FOUND);
            }
            $model->delete();
            return $this->respond(Response::HTTP_NO_CONTENT);
        } catch (\Exception $e) {
            return response()->json(["error" => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $m = self::MODEL;
            $model = $m::withTrashed()->find($id);
            if (is_null($model)) {
                return $this->respond(Response::HTTP_NOT_FOUND);
            }
            $model->forceDelete();
            return $this->respond(Response::HTTP_NO_CONTENT);
        } catch (\Exception $e) {
            return response()->json(["error" => $e->getMessage()], 500);
        }
    }

    protected function respond($status, $data = [])
    {
        return response()->json($data, $status);
    }

    protected function isUnauthorized()
    {
        return response()->json('Access Unauthorized.', 401);
    }
}
