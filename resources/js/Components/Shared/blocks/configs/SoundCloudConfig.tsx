/**
 * SoundCloudConfig - Configuration panel for SoundCloud audio block
 *
 * Display modes:
 * - button: Link only (opens SoundCloud)
 * - preview: Embed only (player widget)
 * - both: Button + Embed (header button with player below)
 *
 * Related files:
 * - types.ts: LinkBlock.mediaDisplayMode, MediaDisplayMode
 * - blocks/SoundCloudBlock.tsx: Renderer for LandingContent
 */

import { LinkBlock, MediaDisplayMode } from "@/types";
import { ExternalLink, Headphones, Layout, LayoutList } from "lucide-react";
import React from "react";

interface SoundCloudConfigProps {
    link: LinkBlock;
    onUpdate: (id: string, updates: Partial<LinkBlock>) => void;
}

/**
 * Get the current display mode, handling legacy showInlinePlayer
 */
const getDisplayMode = (link: LinkBlock): MediaDisplayMode => {
    if (link.mediaDisplayMode) return link.mediaDisplayMode;
    // Legacy fallback: showInlinePlayer true = both (old behavior)
    return link.showInlinePlayer ? "both" : "button";
};

export const SoundCloudConfig: React.FC<SoundCloudConfigProps> = ({
    link,
    onUpdate,
}) => {
    const displayMode = getDisplayMode(link);

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
                    URL de SoundCloud
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Headphones
                            size={16}
                            className="text-orange-500 dark:text-orange-400"
                        />
                    </div>
                    <input
                        type="url"
                        value={link.url || ""}
                        onChange={(e) =>
                            onUpdate(link.id, { url: e.target.value })
                        }
                        className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl pl-10 pr-4 py-3 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                        placeholder="https://soundcloud.com/artista/cancion"
                    />
                </div>
                <p className="text-xs text-neutral-400">
                    Pega la URL de una cancion, playlist o perfil de SoundCloud
                </p>
            </div>

            {/* Display Mode */}
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
                                ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                                : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
                        }`}
                    >
                        <ExternalLink
                            size={20}
                            className={`mx-auto mb-1.5 ${
                                displayMode === "button"
                                    ? "text-orange-500"
                                    : "text-neutral-400"
                            }`}
                        />
                        <span
                            className={`text-xs font-semibold ${
                                displayMode === "button"
                                    ? "text-orange-700 dark:text-orange-300"
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
                                ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                                : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
                        }`}
                    >
                        <Layout
                            size={20}
                            className={`mx-auto mb-1.5 ${
                                displayMode === "preview"
                                    ? "text-orange-500"
                                    : "text-neutral-400"
                            }`}
                        />
                        <span
                            className={`text-xs font-semibold ${
                                displayMode === "preview"
                                    ? "text-orange-700 dark:text-orange-300"
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
                                ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                                : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
                        }`}
                    >
                        <LayoutList
                            size={20}
                            className={`mx-auto mb-1.5 ${
                                displayMode === "both"
                                    ? "text-orange-500"
                                    : "text-neutral-400"
                            }`}
                        />
                        <span
                            className={`text-xs font-semibold ${
                                displayMode === "both"
                                    ? "text-orange-700 dark:text-orange-300"
                                    : "text-neutral-600 dark:text-neutral-400"
                            }`}
                        >
                            Boton + Preview
                        </span>
                    </button>
                </div>
            </div>

            {/* Help */}
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-100 dark:border-orange-800">
                <h4 className="font-semibold text-orange-700 dark:text-orange-300 text-sm mb-1">
                    Tipos de contenido soportados
                </h4>
                <ul className="text-xs text-orange-600 dark:text-orange-400 space-y-1">
                    <li>- Canciones individuales</li>
                    <li>- Playlists</li>
                    <li>- Perfiles de artistas</li>
                </ul>
            </div>
        </div>
    );
};
