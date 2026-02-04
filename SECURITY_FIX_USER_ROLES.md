# 🚨 SECURITY FIX - User Role Assignment Bug

## Problem

**A bug was discovered where ALL new users were being assigned the 'admin' role during registration instead of 'user' role.**

This affected users registered through:

-   ✅ **Normal registration** (web + API)
-   ⚠️ **Social login** (Google/Apple) - ONLY if they completed the setup flow

## Impact Assessment

### What Can Each Role Do?

| Feature                     | ROOT | ADMIN | USER |
| --------------------------- | ---- | ----- | ---- |
| Access `/panel` (own links) | ✅   | ✅    | ✅   |
| Manage own landings & links | ✅   | ✅    | ✅   |
| Access `/admin` routes      | ✅   | ❌    | ❌   |
| View all users/companies    | ✅   | ❌    | ❌   |
| Delete users/companies      | ✅   | ❌    | ❌   |
| Send newsletters            | ✅   | ❌    | ❌   |
| Manage notifications        | ✅   | ❌    | ❌   |
| API `/admin/*` endpoints    | ✅   | ❌    | ❌   |
| Use reserved slugs          | ✅   | ❌    | ❌   |

### Security Status: ✅ LOW SEVERITY (But must be fixed)

**Good news**: The 'admin' role has **NO special privileges** in the current system.

-   `/admin` routes require `middleware('root')` (only ROOT users)
-   API admin endpoints use `middleware('role:root')` (only ROOT users)
-   Web admin routes use `middleware(['auth', 'root'])` (only ROOT users)

**Only ROOT users can access admin features.** Regular users with 'admin' role have the same permissions as 'user' role.

### Why 'admin' Role Exists?

The 'admin' role appears to be:

1. **Reserved for future features** (team admin, multi-user companies)
2. **Legacy from the old system** (MongoDB version may have used it)
3. **Currently unused** - No middleware checks for 'admin' specifically

**However**, we should fix this to prevent future issues if admin role gets privileges later.

## Root Cause

In `app/Services/AuthService.php`, line 156, the `completeSetup()` method was assigning:

```php
// WRONG - Incorrect role assignment
$this->assignRole($user, UserRoles::ADMIN);
```

## Fix Applied

Changed to:

```php
// CORRECT - Regular users get 'user' role
$this->assignRole($user, UserRoles::USER);
```

## Impact

-   **Files changed**: 2 (`app/Services/AuthService.php`, `app/Console/Commands/FixUserRoles.php`)
-   **Affected users**: All users registered since the new system went live
-   **Severity**: LOW - 'admin' role currently has no special privileges, but semantically incorrect

## How to Fix Production Database

### Step 1: Deploy the Code Fix

```bash
git add app/Services/AuthService.php app/Console/Commands/FixUserRoles.php
git commit -m "FIX: Assign 'user' role instead of 'admin' to new registrations"
git push
```

### Step 2: Check Production for Affected Users (Dry Run)

```bash
php artisan fix:user-roles --dry-run
```

This will show:

-   How many users have admin role
-   Who should keep admin (company owners, root users)
-   Who should be downgraded to 'user' role

### Step 3: Fix Production Database

```bash
# Fix all incorrectly assigned admin roles
php artisan fix:user-roles

# Or skip confirmation prompt
php artisan fix:user-roles --force
```

### Step 4: Verify Results

```bash
# Check admin users again
php artisan fix:user-roles --dry-run
```

## What the Fix Command Does

The `fix:user-roles` command (`app/Console/Commands/FixUserRoles.php`):

1. ✅ Finds all users with 'admin' role
2. ✅ **KEEPS** admin role for:
    - Root users
    - Company owners (the first user who created the account)
3. ✅ **REMOVES** admin role and assigns 'user' role to:
    - Regular users who were incorrectly assigned admin
4. ✅ Shows detailed tables of affected users
5. ✅ Safe with `--dry-run` option to preview changes

## Testing

After deploying:

```bash
# Test new registration (should get 'user' role)
# 1. Register a new account
# 2. Check user_role table
SELECT users.email, roles.type
FROM users
JOIN user_role ON users.id = user_role.user_id
JOIN roles ON user_role.role_id = roles.id
WHERE users.email = 'test@example.com';

# Should show: type = 'user'
```

## Middleware Protection Summary

### Routes Protected by ROOT Only:

**Web Routes** (`routes/web.php`):

```php
Route::middleware(['auth', 'root'])->prefix('admin')->group(...);
// All /admin/* routes require ROOT role
```

**API Routes** (`routes/api.php`):

```php
Route::prefix('admin')->middleware('role:root')->group(...);
// All /api/admin/* endpoints require ROOT role
```

### Middleware Classes:

-   `EnsureUserIsRoot` - Checks `$user->hasRole(UserRoles::ROOT)` (blocks admin/user)
-   `RoleMiddleware` - Generic role checker (used for ROOT only currently)

## Timeline

-   **Discovered**: 2026-01-02
-   **Fixed**: 2026-01-02
-   **Deployed to production**: [PENDING]
-   **Database corrected**: [PENDING]

## Related Files

-   `app/Services/AuthService.php` - Fixed (line 156)
-   `app/Console/Commands/FixUserRoles.php` - New command to fix DB
-   `app/Constants/UserRoles.php` - Role constants
-   `app/Models/Role.php` - Role model
-   `app/Http/Middleware/EnsureUserIsRoot.php` - ROOT middleware
-   `app/Http/Middleware/RoleMiddleware.php` - Generic role middleware
