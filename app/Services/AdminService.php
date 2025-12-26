<?php

namespace App\Services;

use App\Models\Company;
use App\Models\Landing;
use App\Models\Link;
use App\Models\Newsletter;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;

/**
 * Service for admin dashboard and management operations.
 */
class AdminService
{
    /**
     * Get dashboard statistics.
     */
    public function getDashboardStats(): array
    {
        return [
            'totalLandings' => Landing::count(),
            'totalUsers' => User::count(),
            'totalCompanies' => Company::count(),
            'totalNewsletters' => Newsletter::count(),
            'totalClicks' => Link::sum('visited') ?? 0,
            'recentActivity' => [], // TODO: Implement activity log
        ];
    }

    /**
     * Get paginated landings with filters.
     */
    public function getLandingsPaginated(Request $request): LengthAwarePaginator
    {
        $query = Landing::with(['user:id,name,email', 'company:id,name'])
            ->withCount('links')
            ->withSum('links as total_clicks', 'visited');

        $this->applySearch($query, $request->get('search'), ['name', 'slug', 'domain_name']);
        $this->applySorting($query, $request);

        return $query->paginate($request->get('per_page', 10));
    }

    /**
     * Get paginated users with filters.
     */
    public function getUsersPaginated(Request $request): LengthAwarePaginator
    {
        $query = User::with(['company:id,name', 'roles:id,name,type'])
            ->withCount('landings');

        $this->applySearch($query, $request->get('search'), ['name', 'email', 'first_name', 'last_name']);
        $this->applySorting($query, $request);

        return $query->paginate($request->get('per_page', 10));
    }

    /**
     * Get paginated companies with filters.
     */
    public function getCompaniesPaginated(Request $request): LengthAwarePaginator
    {
        $query = Company::withCount(['users', 'landings']);

        $this->applySearch($query, $request->get('search'), ['name', 'email']);
        $this->applySorting($query, $request);

        return $query->paginate($request->get('per_page', 10));
    }

    /**
     * Get paginated newsletters with filters.
     */
    public function getNewslettersPaginated(Request $request): LengthAwarePaginator
    {
        $query = Newsletter::withCount('users as recipients_count');

        if ($search = $request->get('search')) {
            $query->where('subject', 'like', "%{$search}%");
        }

        $this->applySorting($query, $request);

        return $query->paginate($request->get('per_page', 10));
    }

    /**
     * Get newsletter with recipients and stats.
     */
    public function getNewsletterWithStats(Newsletter $newsletter): array
    {
        $newsletter->load(['users:id,name,email']);

        $recipients = $newsletter->users->map(function ($user) {
            return [
                'id' => $user->pivot->id ?? $user->id,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ],
                'sent' => (bool) $user->pivot->sent,
                'viewed_count' => $user->pivot->viewed_count ?? 0,
                'ip' => $user->pivot->ip,
                'date' => $user->pivot->date,
            ];
        });

        $sentCount = $recipients->filter(fn($r) => $r['sent'])->count();
        $viewedCount = $recipients->sum('viewed_count');

        return array_merge($newsletter->toArray(), [
            'recipients' => $recipients,
            'recipients_count' => $recipients->count(),
            'sent_count' => $sentCount,
            'viewed_count' => $viewedCount,
        ]);
    }

    /**
     * Create newsletter.
     */
    public function createNewsletter(array $data): Newsletter
    {
        return Newsletter::create($data);
    }

    /**
     * Update newsletter.
     */
    public function updateNewsletter(Newsletter $newsletter, array $data): Newsletter
    {
        $newsletter->update($data);
        return $newsletter->fresh();
    }

    /**
     * Send newsletter to all users.
     */
    public function sendNewsletter(Newsletter $newsletter): void
    {
        $newsletter->update(['sent' => true]);
        // TODO: Queue actual email sending via job
    }

    /**
     * Get paginated notifications with filters.
     */
    public function getNotificationsPaginated(Request $request): LengthAwarePaginator
    {
        $query = Notification::withCount('users as recipients_count')
            ->withCount(['users as read_count' => function ($q) {
                $q->where('notification_user.read', true);
            }]);

        if ($search = $request->get('search')) {
            $query->where('title', 'like', "%{$search}%");
        }

        $this->applySorting($query, $request);

        return $query->paginate($request->get('per_page', 10));
    }

    /**
     * Create notification.
     */
    public function createNotification(array $data): Notification
    {
        return Notification::create($data);
    }

    /**
     * Update notification.
     */
    public function updateNotification(Notification $notification, array $data): Notification
    {
        $notification->update($data);
        return $notification->fresh();
    }

    /**
     * Send notification to all users.
     */
    public function sendNotificationToAll(Notification $notification): void
    {
        $users = User::all();
        
        foreach ($users as $user) {
            if (!$notification->users()->where('user_id', $user->id)->exists()) {
                $notification->users()->attach($user->id, [
                    'read' => false,
                    'viewed' => false,
                ]);
            }
        }
    }

    /**
     * Apply search filter to query.
     */
    protected function applySearch($query, ?string $search, array $fields): void
    {
        if (!$search) {
            return;
        }

        $query->where(function ($q) use ($search, $fields) {
            foreach ($fields as $field) {
                $q->orWhere($field, 'like', "%{$search}%");
            }
        });
    }

    /**
     * Apply sorting to query.
     */
    protected function applySorting($query, Request $request): void
    {
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        $query->orderBy($sortField, $sortDirection);
    }
}

