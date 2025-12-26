/**
 * Block System - Complete block management
 *
 * This module contains:
 * - blockConfig.ts: Block type configurations (single source of truth)
 * - configs/: Configuration panels for editing blocks
 * - partial/: Shared components for rendering blocks
 * - *Block.tsx: Individual block renderers for public display
 *
 * Related files:
 * - hooks/useBlockIcon.ts: Icon utilities
 * - hooks/useBlockStyles.ts: Styling utilities
 * - hooks/useLinkValidation.ts: Validation
 */

// Block configuration (single source of truth)
export {
    BLOCK_TYPES,
    WEB_FEATURED_BLOCK_TYPES,
    createBlockDefaults,
    getBlockConfig,
    getVisibleBlockTypes,
    getWebFeatures,
    shouldShowUrlInput,
} from "./blockConfig";

export type { BlockTypeConfig } from "./blockConfig";

// Block config panels (for Panel/Links)
export * from "./configs";

// Re-export partials for blocks that need them
export { BlockButton, BlockContainer, BlockPreview } from "./partial";

// Block type renderers (for LandingContent)
export { CalendarBlock } from "./CalendarBlock";
export { EmailBlock } from "./EmailBlock";
export { HeaderBlock } from "./HeaderBlock";
export { MapBlock } from "./MapBlock";
export { SoundCloudBlock } from "./SoundCloudBlock";
export { SpotifyBlock } from "./SpotifyBlock";
export { StandardLinkBlock } from "./StandardLinkBlock";
export { TikTokBlock } from "./TikTokBlock";
export { TwitchBlock } from "./TwitchBlock";
export { VimeoBlock } from "./VimeoBlock";
export { WhatsAppBlock } from "./WhatsAppBlock";
export { YouTubeBlock } from "./YouTubeBlock";
