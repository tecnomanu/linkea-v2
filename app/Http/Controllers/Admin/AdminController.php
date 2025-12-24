<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Landing;
use App\Models\Link;
use App\Models\Newsletter;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    /**
     * Admin Dashboard with system stats.
     */
    public function index()
    {
        $stats = [
            'totalLandings' => Landing::count(),
            'totalUsers' => User::count(),
            'totalCompanies' => Company::count(),
            'totalNewsletters' => Newsletter::count(),
            'totalClicks' => Link::sum('visited') ?? 0,
            'recentActivity' => [], // TODO: Implement activity log
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
        ]);
    }

    /**
     * List all landings with pagination.
     */
    public function landings(Request $request)
    {
        $query = Landing::with(['user:id,name,email', 'company:id,name'])
            ->withCount('links')
            ->withSum('links as total_clicks', 'visited');

        // Search filter
        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%")
                    ->orWhere('domain_name', 'like', "%{$search}%");
            });
        }

        // Sorting
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $perPage = $request->get('per_page', 10);
        $landings = $query->paginate($perPage);

        return Inertia::render('Admin/Landings', [
            'landings' => $landings,
            'filters' => $request->only(['search', 'sort', 'direction']),
        ]);
    }

    /**
     * Delete a landing.
     */
    public function destroyLanding(Landing $landing)
    {
        $landing->delete();

        return redirect()->back()->with('success', 'Landing eliminada correctamente.');
    }

    /**
     * List all users with pagination.
     */
    public function users(Request $request)
    {
        $query = User::with(['company:id,name', 'roles:id,name,type'])
            ->withCount('landings');

        // Search filter
        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%");
            });
        }

        // Sorting
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $perPage = $request->get('per_page', 10);
        $users = $query->paginate($perPage);

        return Inertia::render('Admin/Users', [
            'users' => $users,
            'filters' => $request->only(['search', 'sort', 'direction']),
        ]);
    }

    /**
     * Delete a user.
     */
    public function destroyUser(User $user)
    {
        $user->delete();

        return redirect()->back()->with('success', 'Usuario eliminado correctamente.');
    }

    /**
     * List all companies with pagination.
     */
    public function companies(Request $request)
    {
        $query = Company::withCount(['users', 'landings']);

        // Search filter
        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Sorting
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $perPage = $request->get('per_page', 10);
        $companies = $query->paginate($perPage);

        return Inertia::render('Admin/Companies', [
            'companies' => $companies,
            'filters' => $request->only(['search', 'sort', 'direction']),
        ]);
    }

    /**
     * Delete a company.
     */
    public function destroyCompany(Company $company)
    {
        $company->delete();

        return redirect()->back()->with('success', 'Empresa eliminada correctamente.');
    }

    /**
     * List all newsletters with pagination.
     */
    public function newsletters(Request $request)
    {
        $query = Newsletter::withCount('users as recipients_count');

        // Search filter
        if ($search = $request->get('search')) {
            $query->where('subject', 'like', "%{$search}%");
        }

        // Sorting
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $perPage = $request->get('per_page', 10);
        $newsletters = $query->paginate($perPage);

        return Inertia::render('Admin/Newsletters', [
            'newsletters' => $newsletters,
            'filters' => $request->only(['search', 'sort', 'direction']),
        ]);
    }

    /**
     * Show newsletter create form.
     */
    public function createNewsletter()
    {
        return Inertia::render('Admin/NewsletterForm', [
            'newsletter' => null,
        ]);
    }

    /**
     * Show newsletter edit form.
     */
    public function editNewsletter(Newsletter $newsletter)
    {
        // Load recipients with user info
        $newsletter->load(['users:id,name,email']);
        
        // Transform recipients for frontend
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
        
        // Calculate stats
        $sentCount = $recipients->filter(fn($r) => $r['sent'])->count();
        $viewedCount = $recipients->sum('viewed_count');
        
        return Inertia::render('Admin/NewsletterForm', [
            'newsletter' => array_merge($newsletter->toArray(), [
                'recipients' => $recipients,
                'recipients_count' => $recipients->count(),
                'sent_count' => $sentCount,
                'viewed_count' => $viewedCount,
            ]),
        ]);
    }

    /**
     * Store a new newsletter.
     */
    public function storeNewsletter(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        Newsletter::create($validated);

        return redirect()->route('admin.newsletters')->with('success', 'Newsletter creado correctamente.');
    }

    /**
     * Update a newsletter.
     */
    public function updateNewsletter(Request $request, Newsletter $newsletter)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $newsletter->update($validated);

        return redirect()->route('admin.newsletters')->with('success', 'Newsletter actualizado correctamente.');
    }

    /**
     * Delete a newsletter.
     */
    public function destroyNewsletter(Newsletter $newsletter)
    {
        $newsletter->delete();

        return redirect()->back()->with('success', 'Newsletter eliminado correctamente.');
    }

    /**
     * Send a newsletter to all users.
     */
    public function sendNewsletter(Newsletter $newsletter)
    {
        // Mark as sent
        $newsletter->update(['sent' => true]);

        // TODO: Queue actual email sending
        // This would dispatch a job to send emails to all users

        return redirect()->back()->with('success', 'Newsletter enviado correctamente.');
    }

    /**
     * Send a test newsletter to a specific email.
     */
    public function sendTestNewsletter(Request $request, Newsletter $newsletter)
    {
        $validated = $request->validate([
            'email' => 'required|email',
        ]);

        // TODO: Actually send test email
        // Mail::to($validated['email'])->send(new NewsletterMail($newsletter));

        return response()->json([
            'success' => true,
            'message' => 'Email de prueba enviado a ' . $validated['email'],
        ]);
    }

    /**
     * List all notifications with pagination.
     */
    public function notifications(Request $request)
    {
        $query = Notification::withCount('users as recipients_count')
            ->withCount(['users as read_count' => function ($q) {
                $q->where('notification_user.read', true);
            }]);

        // Search filter
        if ($search = $request->get('search')) {
            $query->where('title', 'like', "%{$search}%");
        }

        // Sorting
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $perPage = $request->get('per_page', 10);
        $notifications = $query->paginate($perPage);

        return Inertia::render('Admin/Notifications', [
            'notifications' => $notifications,
            'filters' => $request->only(['search', 'sort', 'direction']),
        ]);
    }

    /**
     * Show notification create form.
     */
    public function createNotification()
    {
        return Inertia::render('Admin/NotificationForm', [
            'notification' => null,
        ]);
    }

    /**
     * Show notification edit form.
     */
    public function editNotification(Notification $notification)
    {
        return Inertia::render('Admin/NotificationForm', [
            'notification' => $notification,
        ]);
    }

    /**
     * Store a new notification.
     */
    public function storeNotification(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'text' => 'required|string',
            'type' => 'nullable|string|max:50',
        ]);

        Notification::create($validated);

        return redirect()->route('admin.notifications')->with('success', 'Notificacion creada correctamente.');
    }

    /**
     * Update a notification.
     */
    public function updateNotification(Request $request, Notification $notification)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'text' => 'required|string',
            'type' => 'nullable|string|max:50',
        ]);

        $notification->update($validated);

        return redirect()->route('admin.notifications')->with('success', 'Notificacion actualizada correctamente.');
    }

    /**
     * Delete a notification.
     */
    public function destroyNotification(Notification $notification)
    {
        $notification->delete();

        return redirect()->back()->with('success', 'Notificacion eliminada correctamente.');
    }

    /**
     * Send a notification to all users.
     */
    public function sendNotification(Notification $notification)
    {
        // Attach notification to all users
        $users = User::all();
        foreach ($users as $user) {
            if (!$notification->users()->where('user_id', $user->id)->exists()) {
                $notification->users()->attach($user->id, [
                    'read' => false,
                    'viewed' => false,
                ]);
            }
        }

        return redirect()->back()->with('success', 'Notificacion enviada a todos los usuarios.');
    }
}
