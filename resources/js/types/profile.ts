/**
 * User profile types for landing page ownership and display.
 */

import type { CustomDesignConfig, SavedCustomTheme } from "./design";

// =============================================================================
// User Profile
// =============================================================================

/**
 * Complete user profile for panel/editor context.
 * Contains identity, design settings, SEO, and analytics configuration.
 */
export interface UserProfile {
    // Identity
    name: string;
    handle: string;
    avatar: string;

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

