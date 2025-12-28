<?php

namespace App\Services;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Service for Mautic CRM integration.
 *
 * Handles contact management, stage updates, and activity tracking.
 */
class MauticService
{
    protected string $apiUrl;
    protected string $username;
    protected string $password;

    public function __construct()
    {
        $this->apiUrl = rtrim(config('services.mautic.api_url') ?? '', '/');
        $this->username = config('services.mautic.username') ?? '';
        $this->password = config('services.mautic.password') ?? '';
    }

    /**
     * Check if Mautic integration is enabled and configured.
     */
    public function isEnabled(): bool
    {
        // First check the enabled flag, then check credentials
        if (!config('services.mautic.enabled', false)) {
            return false;
        }
        return !empty($this->apiUrl) && !empty($this->username) && !empty($this->password);
    }

    /**
     * Add a new user to Mautic as a contact.
     * Called on user registration.
     */
    public function addContact(User $user): ?int
    {
        if (!$this->isEnabled()) {
            Log::info('Mautic integration disabled, skipping addContact');
            return null;
        }

        try {
            // Get 'pending' stage ID
            $stagePending = $this->getStageByName('pending');

            // Get linkea handle from user's primary landing
            $linkeaHandle = $user->landings()->first()?->slug ?? '';

            $data = [
                'title' => $linkeaHandle,
                'firstname' => $user->first_name,
                'lastname' => $user->last_name,
                'email' => $user->email,
                'last_active' => $user->updated_at?->toDateTimeString() ?? Carbon::now()->toDateTimeString(),
                'stage' => $stagePending,
                'tags' => ['freemium', 'registered', 'pending'],
            ];

            $response = $this->request('POST', '/api/contacts/new', $data);

            if (isset($response['contact']['id'])) {
                $mauticId = (int) $response['contact']['id'];
                $user->update(['mautic_id' => $mauticId]);
                Log::info("User {$user->id} added to Mautic with ID {$mauticId}");
                return $mauticId;
            }

            Log::warning('Mautic addContact: unexpected response', ['response' => $response]);
            return null;
        } catch (\Exception $e) {
            Log::error('Mautic addContact error: ' . $e->getMessage(), [
                'user_id' => $user->id,
                'exception' => $e,
            ]);
            return null;
        }
    }

    /**
     * Mark user as verified in Mautic.
     * Called on email verification.
     */
    public function setVerified(User $user): bool
    {
        if (!$this->isEnabled()) {
            Log::info('Mautic integration disabled, skipping setVerified');
            return false;
        }

        try {
            $contactId = $this->resolveContactId($user);

            if (!$contactId) {
                Log::warning("Mautic setVerified: could not find contact for user {$user->id}");
                return false;
            }

            // Get 'verified' stage ID
            $stageVerified = $this->getStageByName('verified');

            $data = [
                'stage' => $stageVerified,
                'tags' => ['-pending', 'verified'],
            ];

            $response = $this->request('PATCH', "/api/contacts/{$contactId}/edit", $data);

            if (isset($response['contact'])) {
                Log::info("User {$user->id} marked as verified in Mautic");
                return true;
            }

            return false;
        } catch (\Exception $e) {
            Log::error('Mautic setVerified error: ' . $e->getMessage(), [
                'user_id' => $user->id,
                'exception' => $e,
            ]);
            return false;
        }
    }

    /**
     * Update last active timestamp in Mautic.
     * Called on user login.
     */
    public function updateLastActive(User $user): bool
    {
        if (!$this->isEnabled()) {
            Log::info('Mautic integration disabled, skipping updateLastActive');
            return false;
        }

        try {
            $contactId = $this->resolveContactId($user);

            if (!$contactId) {
                Log::warning("Mautic updateLastActive: could not find contact for user {$user->id}");
                return false;
            }

            $data = [
                'last_active' => Carbon::now()->toDateTimeString(),
            ];

            $response = $this->request('PATCH', "/api/contacts/{$contactId}/edit", $data);

            if (isset($response['contact'])) {
                Log::info("User {$user->id} last_active updated in Mautic");
                return true;
            }

            return false;
        } catch (\Exception $e) {
            Log::error('Mautic updateLastActive error: ' . $e->getMessage(), [
                'user_id' => $user->id,
                'exception' => $e,
            ]);
            return false;
        }
    }

    /**
     * Resolve Mautic contact ID for a user.
     * Uses stored mautic_id or searches by email.
     */
    protected function resolveContactId(User $user): ?int
    {
        // If user already has mautic_id, use it
        if ($user->mautic_id) {
            return (int) $user->mautic_id;
        }

        // Search by email
        $response = $this->request('GET', '/api/contacts', [
            'search' => $user->email,
        ]);

        if (!empty($response['contacts'])) {
            foreach ($response['contacts'] as $contact) {
                $contactEmail = $contact['fields']['core']['email']['value'] ?? null;
                if ($contactEmail === $user->email) {
                    $contactId = (int) $contact['id'];
                    // Store for future use
                    $user->update(['mautic_id' => $contactId]);
                    return $contactId;
                }
            }
        }

        return null;
    }

    /**
     * Get stage ID by name.
     */
    protected function getStageByName(string $name): ?int
    {
        try {
            $response = $this->request('GET', '/api/stages', [
                'search' => $name,
            ]);

            if (!empty($response['stages'])) {
                // Find exact match
                foreach ($response['stages'] as $stage) {
                    if (strtolower($stage['name'] ?? '') === strtolower($name)) {
                        return (int) $stage['id'];
                    }
                }
                // Fallback to first result
                return (int) array_values($response['stages'])[0]['id'];
            }

            return null;
        } catch (\Exception $e) {
            Log::error("Mautic getStageByName error for '{$name}': " . $e->getMessage());
            return null;
        }
    }

    /**
     * Make HTTP request to Mautic API.
     */
    protected function request(string $method, string $endpoint, array $data = []): array
    {
        $url = $this->apiUrl . $endpoint;

        $request = Http::withBasicAuth($this->username, $this->password)
            ->timeout(30)
            ->acceptJson();

        $response = match (strtoupper($method)) {
            'GET' => $request->get($url, $data),
            'POST' => $request->post($url, $data),
            'PATCH', 'PUT' => $request->patch($url, $data),
            'DELETE' => $request->delete($url, $data),
            default => throw new \InvalidArgumentException("Unsupported HTTP method: {$method}"),
        };

        if (!$response->successful()) {
            Log::error('Mautic API error', [
                'method' => $method,
                'endpoint' => $endpoint,
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
        }

        return $response->json() ?? [];
    }
}
