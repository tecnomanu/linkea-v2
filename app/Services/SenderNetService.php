<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Service for Sender.net Email Marketing integration.
 *
 * Handles subscriber management, tags, groups, and sync operations.
 * 
 * Strategy:
 * - Groups: For major segments (users, newsletter, anonymous)
 * - Tags: For dynamic states (pending, verified, premium, legacy, etc.)
 * 
 * API Documentation: https://api.sender.net/
 */
class SenderNetService
{
    protected const API_BASE_URL = 'https://api.sender.net/v2';

    /**
     * Subscriber statuses.
     */
    public const STATUS_ACTIVE = 'ACTIVE';
    public const STATUS_UNSUBSCRIBED = 'UNSUBSCRIBED';
    public const STATUS_BOUNCED = 'BOUNCED';
    public const STATUS_SPAM_REPORTED = 'SPAM_REPORTED';

    /**
     * Tag constants for user states.
     * These are used as tags in Sender.net to segment users.
     */
    public const TAG_PENDING = 'pending';           // Registered but email not verified
    public const TAG_VERIFIED = 'verified';         // Email verified
    public const TAG_PREMIUM = 'premium';           // Premium/paid user
    public const TAG_LEGACY = 'legacy';             // Migrated from old system (has mongo_id)
    public const TAG_FREEMIUM = 'freemium';         // Free tier user

    /**
     * Group name constants.
     * These are the main groups used in Sender.net.
     */
    public const GROUP_USERS = 'Linkea Users';           // All registered users
    public const GROUP_NEWSLETTER = 'Newsletter';        // Newsletter subscribers
    public const GROUP_ANONYMOUS = 'Anonymous';          // Non-registered contacts

    /**
     * Cache key prefix for group IDs.
     */
    protected const CACHE_PREFIX = 'sendernet:group:';

    protected string $token;
    protected bool $enabled;
    protected int $cacheTtl;

    public function __construct()
    {
        $this->token = config('services.sendernet.api_token', '');
        $this->enabled = config('services.sendernet.enabled', true);
        $this->cacheTtl = config('services.sendernet.cache_ttl', 86400);
    }

    /**
     * Check if Sender.net integration is enabled and configured.
     */
    public function isEnabled(): bool
    {
        // Disable in local/testing environment to avoid creating dummy subscribers
        if (app()->environment('local', 'testing')) {
            return false;
        }

        return $this->enabled && !empty($this->token);
    }

    /**
     * Force enable for specific operations (like commands with --force flag).
     */
    public function forceEnable(): self
    {
        $this->enabled = true;
        return $this;
    }

    // =========================================================================
    // TAG OPERATIONS
    // =========================================================================

    /**
     * Build tags for a user based on their current state.
     * 
     * @param User $user The user
     * @return array Array of tag names
     */
    public function buildTagsForUser(User $user): array
    {
        $tags = [];

        // Verification status
        if ($user->verified_at) {
            $tags[] = self::TAG_VERIFIED;
        } else {
            $tags[] = self::TAG_PENDING;
        }

        // Legacy user (migrated from MongoDB)
        if ($user->mongo_id) {
            $tags[] = self::TAG_LEGACY;
        }

        // TODO: Add premium check when subscription system is implemented
        // if ($user->isPremium()) {
        //     $tags[] = self::TAG_PREMIUM;
        // } else {
        //     $tags[] = self::TAG_FREEMIUM;
        // }
        $tags[] = self::TAG_FREEMIUM;

        return $tags;
    }

    /**
     * Get tags to add when user verifies their email.
     * Returns tags to add and tags to remove (prefixed with -).
     * 
     * @return array Tags array including removals (prefixed with -)
     */
    public function getVerificationTags(): array
    {
        return [
            self::TAG_VERIFIED,      // Add verified tag
            '-' . self::TAG_PENDING, // Remove pending tag
        ];
    }

    // =========================================================================
    // SUBSCRIBER OPERATIONS
    // =========================================================================

    /**
     * Add a new user to Sender.net as a subscriber.
     * Called on user registration.
     * 
     * @param User $user The user to add
     * @param array $extraGroups Optional additional group IDs to assign
     * @param bool $triggerAutomation Whether to trigger automations
     * @return array|null The subscriber data or null on failure
     */
    public function addSubscriber(
        User $user,
        array $extraGroups = [],
        bool $triggerAutomation = true
    ): ?array {
        if (!$this->isEnabled()) {
            Log::info('SenderNet integration disabled, skipping addSubscriber');
            return null;
        }

        try {
            // Check if subscriber already exists
            $existing = $this->getSubscriber($user->email);
            if ($existing) {
                Log::info("User {$user->id} already exists in SenderNet");
                $this->storeSubscriberId($user, $existing);
                return $existing;
            }

            // Prepare groups - add default users group (resolved from cache)
            $groups = [];
            $usersGroupId = $this->getGroupIdByName(self::GROUP_USERS);
            if ($usersGroupId) {
                $groups[] = $usersGroupId;
            }
            $groups = array_merge($groups, $extraGroups);

            // Build tags based on user state
            $tags = $this->buildTagsForUser($user);

            // Improved name resolution
            $firstName = $user->first_name;
            $lastName = $user->last_name;

            // If first_name is empty, try to split full name
            if (empty($firstName) && !empty($user->name)) {
                $parts = $this->splitName($user->name);
                $firstName = $parts['first'];
                $lastName = $parts['last'];
            }

            // Fallback to first_name if still empty
            if (empty($firstName) && !empty($user->first_name)) {
                $firstName = $user->first_name;
            }

            $data = [
                'email' => $user->email,
                'firstname' => $firstName ?? '',
                'lastname' => $lastName ?? '',
                'status' => self::STATUS_ACTIVE, // Force active status
                'trigger_automation' => $triggerAutomation,
            ];

            if (!empty($groups)) {
                $data['groups'] = array_unique($groups);
            }

            // Sender.net uses groups as tags - we pass our tags as groups
            // This adds the user to tag-groups for segmentation
            if (!empty($tags)) {
                // Note: In Sender.net, tags work through groups
                // We'll use custom fields to store state tags
                $data['fields'] = $this->buildCustomFields($user, $tags);
            }

            $response = $this->request('POST', '/subscribers', $data);

            if (isset($response['success']) && $response['success'] === true && isset($response['data'])) {
                $this->storeSubscriberId($user, $response['data']);
                Log::info("User {$user->id} added to SenderNet with ID {$response['data']['id']}", [
                    'tags' => $tags,
                ]);
                return $response['data'];
            }

            Log::warning('SenderNet addSubscriber: unexpected response', ['response' => $response]);
            return null;
        } catch (\Exception $e) {
            Log::error('SenderNet addSubscriber error: ' . $e->getMessage(), [
                'user_id' => $user->id,
                'exception' => $e,
            ]);
            return null;
        }
    }

    /**
     * Get subscriber by email, phone, or ID.
     * 
     * @param string $identifier Email, phone, or subscriber ID
     * @return array|null The subscriber data or null if not found
     */
    public function getSubscriber(string $identifier): ?array
    {
        if (!$this->isEnabled()) {
            return null;
        }

        try {
            // Pass true for silent to avoid logging 404 errors as system errors
            $response = $this->request('GET', '/subscribers/' . urlencode($identifier), [], true);

            if (isset($response['data'])) {
                return $response['data'];
            }

            return null;
        } catch (\Exception $e) {
            // 404 is expected if subscriber doesn't exist
            if (str_contains($e->getMessage(), '404')) {
                return null;
            }

            Log::error('SenderNet getSubscriber error: ' . $e->getMessage(), [
                'identifier' => $identifier,
            ]);
            return null;
        }
    }

    /**
     * Update subscriber information and tags.
     * 
     * @param User $user The user to update
     * @param array $data Additional data to update
     * @param array $tags Tags to add (use - prefix to remove)
     * @return array|null The updated subscriber data or null on failure
     */
    public function updateSubscriber(User $user, array $data = [], array $tags = []): ?array
    {
        if (!$this->isEnabled()) {
            Log::info('SenderNet integration disabled, skipping updateSubscriber');
            return null;
        }

        try {
            $identifier = $user->sendernet_id ?? $user->email;

            // Improved name resolution
            $firstName = $user->first_name;
            $lastName = $user->last_name;

            if (empty($firstName) && !empty($user->name)) {
                $parts = $this->splitName($user->name);
                $firstName = $parts['first'];
                $lastName = $parts['last'];
            }

            // Fallback to first_name if still empty
            if (empty($firstName) && !empty($user->first_name)) {
                $firstName = $user->first_name;
            }

            $updateData = array_merge([
                'firstname' => $firstName ?? '',
                'lastname' => $lastName ?? '',
            ], $data);

            // Force ACTIVE status unconditionally as per user request
            // This ensures all registered users are reachable via marketing emails
            $updateData['subscriber_status'] = self::STATUS_ACTIVE;

            // Also force transactional email status as requested
            if (!isset($updateData['transactional_email_status'])) {
                $updateData['transactional_email_status'] = self::STATUS_ACTIVE;
            }

            // Add tags through groups or fields
            if (!empty($tags)) {
                $currentFields = $this->buildCustomFields($user, $tags);
                $updateData['fields'] = array_merge($updateData['fields'] ?? [], $currentFields);
            }

            $response = $this->request('PATCH', '/subscribers/' . urlencode($identifier), $updateData);

            if (isset($response['data'])) {
                $this->storeSubscriberId($user, $response['data']);
                Log::info("User {$user->id} updated in SenderNet", ['tags' => $tags]);
                return $response['data'];
            }

            return null;
        } catch (\Exception $e) {
            Log::error('SenderNet updateSubscriber error: ' . $e->getMessage(), [
                'user_id' => $user->id,
                'exception' => $e,
            ]);
            return null;
        }
    }

    /**
     * Mark user as verified in Sender.net.
     * Updates tags to reflect verified status.
     * 
     * @param User $user The user to mark as verified
     * @return bool Success status
     */
    public function setVerified(User $user): bool
    {
        if (!$this->isEnabled()) {
            Log::info('SenderNet integration disabled, skipping setVerified');
            return false;
        }

        try {
            $identifier = $user->sendernet_id ?? $user->email;

            // Build updated tags
            $tags = $this->buildTagsForUser($user);

            $data = [
                'subscriber_status' => self::STATUS_ACTIVE,
                'trigger_automation' => true,
                'fields' => $this->buildCustomFields($user, $tags),
            ];

            $response = $this->request('PATCH', '/subscribers/' . urlencode($identifier), $data);

            if (isset($response['data'])) {
                Log::info("User {$user->id} marked as verified in SenderNet", ['tags' => $tags]);
                return true;
            }

            return false;
        } catch (\Exception $e) {
            Log::error('SenderNet setVerified error: ' . $e->getMessage(), [
                'user_id' => $user->id,
                'exception' => $e,
            ]);
            return false;
        }
    }

    /**
     * Add subscriber to specific groups.
     * 
     * @param User $user The user
     * @param array $groupIds Array of group IDs
     * @return bool Success status
     */
    public function addToGroups(User $user, array $groupIds): bool
    {
        if (!$this->isEnabled() || empty($groupIds)) {
            return false;
        }

        return $this->updateSubscriber($user, ['groups' => $groupIds]) !== null;
    }

    /**
     * Delete subscriber from Sender.net.
     * 
     * @param User $user The user to delete
     * @return bool Success status
     */
    public function deleteSubscriber(User $user): bool
    {
        if (!$this->isEnabled()) {
            return false;
        }

        try {
            $response = $this->request('DELETE', '/subscribers', [
                'subscribers' => [$user->email],
            ]);

            if (isset($response['success']) && $response['success'] === true) {
                // Clear stored ID
                $user->update(['sendernet_id' => null]);
                Log::info("User {$user->id} deleted from SenderNet");
                return true;
            }

            return false;
        } catch (\Exception $e) {
            Log::error('SenderNet deleteSubscriber error: ' . $e->getMessage(), [
                'user_id' => $user->id,
                'exception' => $e,
            ]);
            return false;
        }
    }

    // =========================================================================
    // BULK OPERATIONS
    // =========================================================================

    /**
     * Get all subscribers with pagination.
     * 
     * @param int $page Page number
     * @param int $perPage Items per page (max 100)
     * @return array Response with data, meta, and links
     */
    public function getAllSubscribers(int $page = 1, int $perPage = 100): array
    {
        if (!$this->isEnabled()) {
            return ['data' => [], 'meta' => ['total' => 0]];
        }

        try {
            $response = $this->request('GET', '/subscribers', [
                'page' => $page,
                'per_page' => min($perPage, 100),
            ]);

            return $response;
        } catch (\Exception $e) {
            Log::error('SenderNet getAllSubscribers error: ' . $e->getMessage());
            return ['data' => [], 'meta' => ['total' => 0]];
        }
    }

    /**
     * Get all subscriber emails as a collection.
     * Useful for checking duplicates before bulk import.
     * 
     * @return \Illuminate\Support\Collection Collection of email addresses
     */
    public function getAllSubscriberEmails(): \Illuminate\Support\Collection
    {
        $emails = collect();
        $page = 1;
        $hasMore = true;

        while ($hasMore) {
            $response = $this->getAllSubscribers($page, 100);

            if (!empty($response['data'])) {
                foreach ($response['data'] as $subscriber) {
                    $emails->push(strtolower($subscriber['email']));
                }
            }

            $hasMore = isset($response['meta']['current_page']) &&
                isset($response['meta']['last_page']) &&
                $response['meta']['current_page'] < $response['meta']['last_page'];
            $page++;

            // Safety limit
            if ($page > 1000) {
                break;
            }
        }

        return $emails;
    }

    /**
     * Sync users to Sender.net.
     * Only adds users that don't already exist.
     * 
     * @param \Illuminate\Support\Collection $users Collection of User models
     * @param bool $onlyVerified Only sync verified users
     * @param callable|null $progressCallback Callback for progress updates
     * @return array Statistics about the sync operation
     */
    public function syncUsers(
        \Illuminate\Support\Collection $users,
        bool $onlyVerified = false,
        ?callable $progressCallback = null
    ): array {
        $stats = [
            'total' => $users->count(),
            'synced' => 0,
            'updated' => 0,
            'skipped' => 0,
            'failed' => 0,
            'already_exists' => 0,
        ];

        if (!$this->isEnabled()) {
            Log::info('SenderNet integration disabled, skipping syncUsers');
            $stats['skipped'] = $stats['total'];
            return $stats;
        }

        // Get existing subscribers
        $existingEmails = $this->getAllSubscriberEmails();

        foreach ($users as $user) {
            // Skip if only verified and user is not verified
            if ($onlyVerified && !$user->verified_at) {
                $stats['skipped']++;
                if ($progressCallback) {
                    $progressCallback('skipped', $user, 'Not verified');
                }
                continue;
            }

            // If already exists, update them to ensure valid state and names
            if ($existingEmails->contains(strtolower($user->email))) {
                $stats['updated']++; // We'll add this key to stats

                // Determine tags
                $tags = $this->buildTagsForUser($user);

                // Update subscriber (fixes names and status)
                $this->updateSubscriber($user, [], $tags);

                if ($progressCallback) {
                    $progressCallback('updated', $user, 'Updated existing subscriber');
                }

                // Small delay to prevent rate limits (429)
                usleep(500000); // 500ms
                continue;
            }

            // New subscriber: Add them
            $result = $this->addSubscriber($user, [], false);

            if ($result) {
                $stats['synced']++;
                $this->storeSubscriberId($user, $result);
                if ($progressCallback) {
                    $progressCallback('synced', $user, 'Synced successfully');
                }
            } else {
                $stats['failed']++;
                if ($progressCallback) {
                    $progressCallback('failed', $user, 'Failed to add');
                }
            }

            // Delay after adding
            usleep(500000); // 500ms
        }

        return $stats;
    }

    // =========================================================================
    // GROUPS OPERATIONS
    // =========================================================================

    /**
     * Get all groups.
     * 
     * @return array Array of groups
     */
    public function getGroups(): array
    {
        if (!$this->isEnabled()) {
            return [];
        }

        try {
            $response = $this->request('GET', '/groups');

            return $response['data'] ?? [];
        } catch (\Exception $e) {
            Log::error('SenderNet getGroups error: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Get group by ID.
     * 
     * @param string $groupId The group ID
     * @return array|null The group data or null if not found
     */
    public function getGroup(string $groupId): ?array
    {
        if (!$this->isEnabled()) {
            return null;
        }

        try {
            $response = $this->request('GET', '/groups/' . $groupId);

            return $response['data'] ?? null;
        } catch (\Exception $e) {
            Log::error('SenderNet getGroup error: ' . $e->getMessage(), [
                'group_id' => $groupId,
            ]);
            return null;
        }
    }

    /**
     * Create a new group.
     * 
     * @param string $title The group title
     * @return array|null The created group data or null on failure
     */
    public function createGroup(string $title): ?array
    {
        if (!$this->isEnabled()) {
            return null;
        }

        try {
            $response = $this->request('POST', '/groups', [
                'title' => $title,
            ]);

            if (isset($response['success']) && $response['success'] === true) {
                return $response['data'] ?? null;
            }

            return null;
        } catch (\Exception $e) {
            Log::error('SenderNet createGroup error: ' . $e->getMessage(), [
                'title' => $title,
            ]);
            return null;
        }
    }

    /**
     * Get group ID by name, using cache.
     * If the group doesn't exist, it will be created automatically.
     * 
     * @param string $name The group name
     * @param bool $createIfMissing Whether to create the group if it doesn't exist
     * @return string|null The group ID or null on failure
     */
    public function getGroupIdByName(string $name, bool $createIfMissing = true): ?string
    {
        if (!$this->isEnabled()) {
            return null;
        }

        $cacheKey = self::CACHE_PREFIX . md5($name);

        // Try to get from cache
        $cachedId = Cache::get($cacheKey);
        if ($cachedId) {
            return $cachedId;
        }

        // Fetch all groups and find by name
        $groups = $this->getGroups();
        foreach ($groups as $group) {
            if (strtolower($group['title'] ?? '') === strtolower($name)) {
                $groupId = $group['id'];
                // Cache the ID
                Cache::put($cacheKey, $groupId, $this->cacheTtl);
                Log::debug("SenderNet group '{$name}' resolved to ID: {$groupId}");
                return $groupId;
            }
        }

        // Group not found - create it if allowed
        if ($createIfMissing) {
            $newGroup = $this->createGroup($name);
            if ($newGroup && isset($newGroup['id'])) {
                $groupId = $newGroup['id'];
                Cache::put($cacheKey, $groupId, $this->cacheTtl);
                Log::info("SenderNet group '{$name}' created with ID: {$groupId}");
                return $groupId;
            }
        }

        Log::warning("SenderNet group '{$name}' not found and could not be created");
        return null;
    }

    /**
     * Clear cached group IDs.
     * Useful when group configuration changes.
     */
    public function clearGroupCache(): void
    {
        Cache::forget(self::CACHE_PREFIX . md5(self::GROUP_USERS));
        Cache::forget(self::CACHE_PREFIX . md5(self::GROUP_NEWSLETTER));
        Cache::forget(self::CACHE_PREFIX . md5(self::GROUP_ANONYMOUS));
        Log::info('SenderNet group cache cleared');
    }

    /**
     * Ensure all required groups exist in Sender.net.
     * Creates them if they don't exist and caches their IDs.
     * 
     * @return array Map of group names to IDs
     */
    public function ensureGroupsExist(): array
    {
        $groups = [
            self::GROUP_USERS,
            self::GROUP_NEWSLETTER,
            self::GROUP_ANONYMOUS,
        ];

        $result = [];
        foreach ($groups as $groupName) {
            $groupId = $this->getGroupIdByName($groupName, true);
            $result[$groupName] = $groupId;
        }

        return $result;
    }

    // =========================================================================
    // HELPER METHODS
    // =========================================================================

    /**
     * Build custom fields for a user including tags as a field.
     * 
     * @param User $user The user
     * @param array $tags Array of tag names
     * @return array Custom fields array
     */
    protected function buildCustomFields(User $user, array $tags = []): array
    {
        $fields = [];

        // Store tags as a custom field (comma-separated)
        if (!empty($tags)) {
            // Filter out removal tags (starting with -)
            $activeTags = array_filter($tags, fn($t) => !str_starts_with($t, '-'));
            $fields['{$tags}'] = implode(',', $activeTags);
            $fields['{$user_state}'] = $user->verified_at ? 'verified' : 'pending';
        }

        // Get the user's primary landing slug if available
        $linkeaHandle = '';
        if ($user->relationLoaded('landings') && $user->landings->isNotEmpty()) {
            $linkeaHandle = $user->landings->first()?->slug ?? '';
        } elseif ($landing = $user->landings()->first()) {
            $linkeaHandle = $landing->slug ?? '';
        }

        if ($linkeaHandle) {
            $fields['{$linkea_handle}'] = $linkeaHandle;
        }

        // Dates
        $fields['{$registered_at}'] = $user->created_at?->toDateTimeString() ?? now()->toDateTimeString();

        if ($user->verified_at) {
            $fields['{$verified_at}'] = $user->verified_at->toDateTimeString();
        }

        // Legacy flag
        if ($user->mongo_id) {
            $fields['{$is_legacy}'] = 'yes';
        }

        return $fields;
    }

    /**
     * Store the Sender.net subscriber ID in the user.
     * 
     * @param User $user The user
     * @param array $subscriberData The subscriber data from Sender.net
     */
    protected function storeSubscriberId(User $user, array $subscriberData): void
    {
        if (isset($subscriberData['id']) && $user->sendernet_id !== $subscriberData['id']) {
            $user->update(['sendernet_id' => $subscriberData['id']]);
        }
    }

    /**
     * Make HTTP request to Sender.net API.
     * 
     * @param string $method HTTP method
     * @param string $endpoint API endpoint
     * @param array $data Request data
     * @return array Response data
     * @throws \Exception On request failure
     */
    protected function request(string $method, string $endpoint, array $data = [], bool $silent = false): array
    {
        $url = self::API_BASE_URL . $endpoint;

        $request = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
        ])->timeout(30);

        /** @var Response $response */
        $response = match (strtoupper($method)) {
            'GET' => $request->get($url, $data),
            'POST' => $request->post($url, $data),
            'PATCH', 'PUT' => $request->patch($url, $data),
            'DELETE' => $request->delete($url, $data),
            default => throw new \InvalidArgumentException("Unsupported HTTP method: {$method}"),
        };

        if (!$response->successful()) {
            $errorMessage = "SenderNet API error: {$response->status()}";

            // Only log if not silent
            if (!$silent) {
                Log::error('SenderNet API error', [
                    'method' => $method,
                    'endpoint' => $endpoint,
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
            }

            throw new \Exception($errorMessage . ' - ' . $response->body());
        }

        return $response->json() ?? [];
    }
    /**
     * Helper to split full name into first and last name.
     */
    protected function splitName(string $fullName): array
    {
        $fullName = trim($fullName);
        $parts = explode(' ', $fullName);
        $count = count($parts);

        if ($count === 1) {
            return ['first' => $parts[0], 'last' => ''];
        }

        $last = array_pop($parts);
        $first = implode(' ', $parts);

        return ['first' => $first, 'last' => $last];
    }
}
