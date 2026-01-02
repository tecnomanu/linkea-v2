/**
 * Central export point for all TypeScript types.
 *
 * Usage:
 *   import { LinkBlock, LandingProfile, ButtonStyle } from "@/types/index";
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

// Landing Profile types (public landing page configuration)
export type { LandingProfile, NavItem } from "./profile";

// Inertia shared props
export type {
    AuthUser,
    FlashMessages,
    PageProps,
    SeoDefaults,
    SharedProps,
} from "./inertia";
