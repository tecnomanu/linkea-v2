/**
 * Central export point for all TypeScript types.
 *
 * Usage:
 *   import { LinkBlock, UserProfile, ButtonStyle } from "@/types";
 *
 * Or import from specific modules:
 *   import type { CustomDesignConfig } from "@/types/design";
 */

// Design types (background, buttons, typography, themes)
export type {
    BackgroundAttachment,
    BackgroundControls,
    BackgroundPosition,
    BackgroundRepeat,
    BackgroundSize,
    ButtonIconAlignment,
    ButtonShape,
    ButtonSize,
    ButtonStyle,
    CustomDesignConfig,
    FontPair,
    SavedCustomTheme,
} from "./design";

// Block/Link types
export type {
    BlockType,
    CalendarDisplayMode,
    CalendarProvider,
    HeaderSize,
    LinkBlock,
    MapDisplayMode,
    MediaDisplayMode,
    PlayerSize,
} from "./blocks";

// Profile types
export type { NavItem, UserProfile } from "./profile";

// Inertia shared props
export type {
    AuthUser,
    FlashMessages,
    PageProps,
    SeoDefaults,
    SharedProps,
} from "./inertia";

