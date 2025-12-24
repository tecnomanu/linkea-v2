<?php

namespace App\Http\Controllers\Api\Panel\Legacy;

use App\Constants\LinkGroups;
use App\Constants\ResponseMessages;
use App\Http\Controllers\Controller;
use App\Http\Resources\LinkResource;
use App\Models\Link;
use App\Models\User;
use App\Services\LinkService;
use App\Traits\AuthorizesLanding;
use App\Traits\HasApiResponse;
use App\Traits\RESTActions;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * Legacy controller for Angular wizard compatibility.
 * @deprecated Use Panel/LinkController for new features.
 */
class LinksController extends Controller
{
    use RESTActions, HasApiResponse, AuthorizesLanding;

    const MODEL = Link::class;

    public function __construct(
        protected LinkService $linkService
    ) {}

    public function current(): JsonResponse
    {
        return $this->error('Use landing endpoint to get links', 501);
    }

    public function createOrUpdate(Request $request, string $landingId): JsonResponse
    {
        /** @var User|null $user */
        $user = Auth::user();

        if (!$user) {
            return $this->unauthorized();
        }

        $landing = $this->getAuthorizedLandingByCompany($landingId, $user->company_id);

        if (!$landing) {
            return $this->landingUnauthorizedResponse();
        }

        $linksData = $request->input('links', []);
        $socialsData = $request->input('socials', []);

        $savedLinks = [];
        $savedSocials = [];

        if (!empty($linksData)) {
            $savedLinks = $this->linkService->saveBlockLinks($landing, $this->normalizeLinksData($linksData));
        }

        if (!empty($socialsData)) {
            $savedSocials = $this->linkService->saveSocialLinks($landing, $this->normalizeLinksData($socialsData));
        }

        return $this->success([
            LinkGroups::LINKS => LinkResource::collection(collect($savedLinks)),
            LinkGroups::SOCIALS => LinkResource::collection(collect($savedSocials)),
        ], ResponseMessages::LINKS_SAVED);
    }

    protected function normalizeLinksData(array $links): array
    {
        return collect($links)->map(function ($item, $index) {
            return [
                'id' => $item['id'] ?? null,
                'text' => $item['text'] ?? $item['title'] ?? '',
                'link' => $item['link'] ?? $item['url'] ?? '',
                'type' => $item['type'] ?? 'link',
                'state' => $item['state'] ?? $item['isEnabled'] ?? true,
                'order' => $item['order'] ?? $index,
                'icon' => $item['icon'] ?? null,
                'image' => $item['image'] ?? null,
                'options' => $item['options'] ?? null,
                'config' => $item['config'] ?? null,
            ];
        })->toArray();
    }
}

