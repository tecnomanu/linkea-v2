/**
 * Inertia shared props types.
 *
 * These types match the data shared from PHP in:
 * app/Http/Middleware/HandleInertiaRequests.php
 *
 * Single source of truth for TypeScript types of Inertia props.
 */

/**
 * SEO defaults shared from PHP (SeoDefaults.php)
 */
export interface SeoDefaults {
    siteName: string;
    locale: string;
    defaultTitle: string;
    defaultDescription: string;
    defaultImage: string;
    ogImageWidth: string;
    ogImageHeight: string;
    favicon: string;
    appleTouchIcon: string;
}

/**
 * Authenticated user data
 */
export interface AuthUser {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role_name?: string;
}

/**
 * Flash messages
 */
export interface FlashMessages {
    success?: string;
    error?: string;
}

/**
 * Base shared props available on all Inertia pages.
 * Matches HandleInertiaRequests::share()
 *
 * The index signature [key: string]: unknown is required by Inertia's PageProps type.
 */
export interface SharedProps {
    appName: string;
    appUrl: string;
    auth: {
        user: AuthUser | null;
    };
    flash: FlashMessages;
    seoDefaults: SeoDefaults;
    // Index signature required by Inertia's PageProps constraint
    [key: string]: unknown;
}

/**
 * Helper type to extend page props with shared props.
 * Usage: type MyPageProps = PageProps<{ myProp: string }>
 */
export type PageProps<T = Record<string, unknown>> = SharedProps & T;
