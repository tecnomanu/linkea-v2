/**
 * Icon Helper - Re-exports from hooks/useBlockIcon
 *
 * This file maintains backwards compatibility.
 * New code should import from @/hooks/useBlockIcon
 */

export {
    getLegacyIconPath,
    isLegacyIcon,
    isLucideIcon,
    renderLegacyIcon,
} from "@/hooks/useBlockIcon";

export type { LegacyIcon } from "@/hooks/useBlockIcon";
