/**
 * VideoEmbedConfig - Configuration panel for Vimeo, TikTok, Twitch blocks
 *
 * Shared config for video embed blocks with 3 display modes:
 * - button: Link only (opens in new tab)
 * - preview: Embed only (player without button)
 * - both: Button + Embed (header button with player below)
 *
 * Related files:
 * - types.ts: LinkBlock.mediaDisplayMode, MediaDisplayMode
 * - blocks/VideoEmbedBlock.tsx: Renderer for LandingContent
 */

import { Toggle } from "@/Components/ui/Toggle";
import { LinkBlock, MediaDisplayMode } from "@/types/index";
import { ExternalLink, Layout, LayoutList, Video } from "lucide-react";
import React from "react";

interface VideoEmbedConfigProps {
    link: LinkBlock;
    onUpdate: (id: string, updates: Partial<LinkBlock>) => void;
}

const PROVIDER_INFO: Record<string, { name: string; placeholder: string; help: string; color: string }> = {
    vimeo: {
        name: "Vimeo",
        placeholder: "https://vimeo.com/123456789",
        help: "Pega la URL de cualquier video de Vimeo",
        color: "cyan",
    },
    tiktok: {
        name: "TikTok",
        placeholder: "https://www.tiktok.com/@user/video/123456789",
        help: "Pega la URL completa del video de TikTok",
        color: "neutral",
    },
    twitch: {
        name: "Twitch",
        placeholder: "https://www.twitch.tv/canal o nombre del canal",
        help: "Pega la URL del canal o solo el nombre",
        color: "purple",
    },
};

/**
 * Get the current display mode, handling legacy showInlinePlayer
 */
const getDisplayMode = (link: LinkBlock): MediaDisplayMode => {
    if (link.mediaDisplayMode) return link.mediaDisplayMode;
    // Legacy fallback: showInlinePlayer true = both (old behavior showed button + preview)
    return link.showInlinePlayer ? "both" : "button";
};

export const VideoEmbedConfig: React.FC<VideoEmbedConfigProps> = ({
    link,
    onUpdate,
}) => {
    const provider = PROVIDER_INFO[link.type] || PROVIDER_INFO.vimeo;
    const displayMode = getDisplayMode(link);
    const isTikTok = link.type === "tiktok";

    const handleDisplayModeChange = (mode: MediaDisplayMode) => {
        onUpdate(link.id, {
            mediaDisplayMode: mode,
            // Keep showInlinePlayer in sync for legacy support
            showInlinePlayer: mode !== "button",
        });
    };

    return (
        <div className="space-y-5">
            {/* URL */}
            <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    URL de {provider.name}
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Video
                            size={16}
                            className={`text-${provider.color}-500 dark:text-${provider.color}-400`}
                        />
                    </div>
                    <input
                        type="url"
                        value={link.url || ""}
                        onChange={(e) =>
                            onUpdate(link.id, { url: e.target.value })
                        }
                        className={`w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl pl-10 pr-4 py-3 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-${provider.color}-500/20 focus:border-${provider.color}-500 transition-all`}
                        placeholder={provider.placeholder}
                    />
                </div>
                <p className="text-xs text-neutral-400">{provider.help}</p>
            </div>

            {/* Display Mode - Not for TikTok (only button mode supported) */}
            {!isTikTok && (
                <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Modo de visualizacion
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {/* Button Only */}
                        <button
                            onClick={() => handleDisplayModeChange("button")}
                            className={`p-3 rounded-xl border-2 transition-all text-center ${
                                displayMode === "button"
                                    ? `border-${provider.color}-500 bg-${provider.color}-50 dark:bg-${provider.color}-900/20`
                                    : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
                            }`}
                        >
                            <ExternalLink
                                size={20}
                                className={`mx-auto mb-1.5 ${
                                    displayMode === "button"
                                        ? `text-${provider.color}-500`
                                        : "text-neutral-400"
                                }`}
                            />
                            <span
                                className={`text-xs font-semibold ${
                                    displayMode === "button"
                                        ? `text-${provider.color}-700 dark:text-${provider.color}-300`
                                        : "text-neutral-600 dark:text-neutral-400"
                                }`}
                            >
                                Solo boton
                            </span>
                        </button>

                        {/* Preview Only */}
                        <button
                            onClick={() => handleDisplayModeChange("preview")}
                            className={`p-3 rounded-xl border-2 transition-all text-center ${
                                displayMode === "preview"
                                    ? `border-${provider.color}-500 bg-${provider.color}-50 dark:bg-${provider.color}-900/20`
                                    : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
                            }`}
                        >
                            <Layout
                                size={20}
                                className={`mx-auto mb-1.5 ${
                                    displayMode === "preview"
                                        ? `text-${provider.color}-500`
                                        : "text-neutral-400"
                                }`}
                            />
                            <span
                                className={`text-xs font-semibold ${
                                    displayMode === "preview"
                                        ? `text-${provider.color}-700 dark:text-${provider.color}-300`
                                        : "text-neutral-600 dark:text-neutral-400"
                                }`}
                            >
                                Solo preview
                            </span>
                        </button>

                        {/* Both */}
                        <button
                            onClick={() => handleDisplayModeChange("both")}
                            className={`p-3 rounded-xl border-2 transition-all text-center ${
                                displayMode === "both"
                                    ? `border-${provider.color}-500 bg-${provider.color}-50 dark:bg-${provider.color}-900/20`
                                    : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
                            }`}
                        >
                            <LayoutList
                                size={20}
                                className={`mx-auto mb-1.5 ${
                                    displayMode === "both"
                                        ? `text-${provider.color}-500`
                                        : "text-neutral-400"
                                }`}
                            />
                            <span
                                className={`text-xs font-semibold ${
                                    displayMode === "both"
                                        ? `text-${provider.color}-700 dark:text-${provider.color}-300`
                                        : "text-neutral-600 dark:text-neutral-400"
                                }`}
                            >
                                Boton + Preview
                            </span>
                        </button>
                    </div>
                </div>
            )}

            {/* Twitch specific: show chat toggle - Only when preview is shown */}
            {link.type === "twitch" && displayMode !== "button" && (
                <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-100 dark:border-neutral-700">
                    <Toggle
                        label="Mostrar chat en vivo"
                        checked={link.autoPlay ?? false}
                        onChange={(val) =>
                            onUpdate(link.id, { autoPlay: val })
                        }
                        labelPosition="left"
                    />
                </div>
            )}

            {/* TikTok specific note */}
            {isTikTok && (
                <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-100 dark:border-neutral-700">
                    <p className="text-xs text-neutral-500">
                        Los videos de TikTok se muestran como boton que abre la
                        app o web de TikTok. El embed directo no esta soportado
                        por restricciones de TikTok.
                    </p>
                </div>
            )}
        </div>
    );
};
