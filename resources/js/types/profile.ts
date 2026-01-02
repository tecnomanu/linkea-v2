/**
 * Landing profile types - Represents the public landing page configuration.
 *
 * IMPORTANT: This is NOT the authenticated user (auth.user).
 * LandingProfile represents the public-facing landing page data.
 */

import type { CustomDesignConfig, SavedCustomTheme } from "./design";

// =============================================================================
// Landing Profile
// =============================================================================

/**
 * Complete landing configuration for panel/editor context.
 * Contains identity, design settings, SEO, and analytics configuration.
 *
 * This represents the PUBLIC landing page, not the authenticated user.
 * For authenticated user data, use AuthUser from @/types/inertia
 */
export interface LandingProfile {
    // Identity
    name: string;
    handle: string;
    avatar: string;
    avatarThumb?: string; // Thumbnail version (128x128) for better performance

    // Title & Subtitle (displayed on page)
    title: string;
    subtitle: string;
    showTitle?: boolean;
    showSubtitle?: boolean;

    // Design Configuration
    theme: string; // preset ID, 'custom', or saved theme ID
    customDesign: CustomDesignConfig;
    savedCustomThemes?: SavedCustomTheme[];
    lastCustomDesign?: CustomDesignConfig;

    // SEO & Analytics
    seoTitle?: string;
    seoDescription?: string;
    googleAnalyticsId?: string;
    facebookPixelId?: string;

    // Privacy
    isPrivate?: boolean;

    // Verification & Legacy
    isVerified?: boolean;
    isLegacy?: boolean;
}


// =============================================================================
// Navigation
// =============================================================================

export interface NavItem {
    id: string;
    label: string;
    icon: string;
}
