/**
 * Block renderers for LandingContent
 *
 * Each block type has its own renderer component that handles:
 * - Visual display on the public landing page
 * - Responsive design
 * - SEO/accessibility requirements
 * - Preview mode (non-clickable)
 *
 * Naming convention: {Type}Block.tsx
 *
 * Related files:
 * - LandingContent.tsx: Uses these blocks to render links
 * - Components/Panel/Links/configs/: Configuration panels for each block
 * - types.ts: Type definitions
 */

// Re-export partials for blocks that need them
export { BlockButton, BlockContainer, BlockPreview } from "./partial";

// Block type renderers
export { CalendarBlock } from "./CalendarBlock";
export { EmailBlock } from "./EmailBlock";
export { MapBlock } from "./MapBlock";
export { SoundCloudBlock } from "./SoundCloudBlock";
export { TikTokBlock } from "./TikTokBlock";
export { TwitchBlock } from "./TwitchBlock";
export { VimeoBlock } from "./VimeoBlock";

// Future blocks:
// export { ContactBlock } from "./ContactBlock";
