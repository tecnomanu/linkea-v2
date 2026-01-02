/**
 * Central export point for constants.
 * Use specific imports when possible for better tree-shaking.
 * 
 * @example
 * // Preferred (tree-shakeable)
 * import { BUTTON_STYLES } from "@/constants/designOptions";
 * 
 * // Also works (imports everything)
 * import { BUTTON_STYLES } from "@/constants/index";
 */

// Design options and presets
export * from "./designOptions";
export * from "./themePresets";
export * from "./legacyBackgrounds";
export * from "./icons";

// Default values
export * from "./defaults";

