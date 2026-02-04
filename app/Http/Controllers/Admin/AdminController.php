<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Landing;
use App\Models\Newsletter;
use App\Models\Notification;
use App\Models\User;
use App\Services\AdminService;
use App\Services\NewsletterService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function __construct(
        protected AdminService $adminService,
        protected NewsletterService $newsletterService
    ) {}

    /**
     * Admin Dashboard with system stats.
     */
    public function index()
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => $this->adminService->getDashboardStats(),
        ]);
    }

    /**
     * List all landings with pagination.
     */
    public function landings(Request $request)
    {
        return Inertia::render('Admin/Landings', [
            'landings' => $this->adminService->getLandingsPaginated($request),
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
     * Toggle landing blocked status.
     */
    public function toggleLandingBlock(Landing $landing)
    {
        $landing->is_blocked = !$landing->is_blocked;
        $landing->save();

        $message = $landing->is_blocked
            ? 'Landing bloqueada correctamente.'
            : 'Landing desbloqueada correctamente.';

        return redirect()->back()->with('success', $message);
    }

    /**
     * List all users with pagination.
     */
    public function users(Request $request)
    {
        return Inertia::render('Admin/Users', [
            'users' => $this->adminService->getUsersPaginated($request),
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
        return Inertia::render('Admin/Companies', [
            'companies' => $this->adminService->getCompaniesPaginated($request),
            'filters' => $request->only(['search', 'sort', 'direction']),
        ]);
    }

    /**
     * Delete a company.
     */
    public function destroyCompany(\App\Models\Company $company)
    {
        $company->delete();
        return redirect()->back()->with('success', 'Empresa eliminada correctamente.');
    }

    /**
     * List all newsletters with pagination.
     */
    public function newsletters(Request $request)
    {
        return Inertia::render('Admin/Newsletters', [
            'newsletters' => $this->adminService->getNewslettersPaginated($request),
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
        return Inertia::render('Admin/NewsletterForm', [
            'newsletter' => $this->adminService->getNewsletterWithStats($newsletter),
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

        $this->adminService->createNewsletter($validated);

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

        $this->adminService->updateNewsletter($newsletter, $validated);

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
        if ($newsletter->sent) {
            return redirect()->back()->with('error', 'Este newsletter ya fue enviado.');
        }

        $this->newsletterService->sendToAllUsers($newsletter);

        return redirect()->back()->with('success', 'Newsletter enviado correctamente. Los emails se procesaran en segundo plano.');
    }

    /**
     * Send a test newsletter to a specific email.
     */
    public function sendTestNewsletter(Request $request, Newsletter $newsletter)
    {
        $validated = $request->validate([
            'email' => 'required|email',
        ]);

        $this->newsletterService->sendTestToEmail($newsletter, $validated['email']);

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
        return Inertia::render('Admin/Notifications', [
            'notifications' => $this->adminService->getNotificationsPaginated($request),
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

        $this->adminService->createNotification($validated);

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

        $this->adminService->updateNotification($notification, $validated);

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
        $this->adminService->sendNotificationToAll($notification);
        return redirect()->back()->with('success', 'Notificacion enviada a todos los usuarios.');
    }
}
