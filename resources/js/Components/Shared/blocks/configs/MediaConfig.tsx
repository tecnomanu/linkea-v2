import { SegmentedSelect } from "@/Components/ui/SegmentedSelect";
import { Toggle } from "@/Components/ui/Toggle";
import { LinkBlock, MediaDisplayMode, PlayerSize } from "@/types/index";
import { ExternalLink, Layout, LayoutList, Music, Video } from "lucide-react";
import React from "react";

interface MediaConfigProps {
    link: LinkBlock;
    onUpdate: (id: string, updates: Partial<LinkBlock>) => void;
}

const MEDIA_INFO: Record<string, { name: string; placeholder: string; help: string }> = {
    video: {
        name: "YouTube",
        placeholder: "https://www.youtube.com/watch?v=...",
        help: "Pega la URL de cualquier video de YouTube",
    },
    youtube: {
        name: "YouTube",
        placeholder: "https://www.youtube.com/watch?v=...",
        help: "Pega la URL de cualquier video de YouTube",
    },
    music: {
        name: "Spotify",
        placeholder: "https://open.spotify.com/track/...",
        help: "Pega la URL de una cancion, album o playlist de Spotify",
    },
    spotify: {
        name: "Spotify",
        placeholder: "https://open.spotify.com/track/...",
        help: "Pega la URL de una cancion, album o playlist de Spotify",
    },
};

/**
 * Get the current display mode, handling legacy showInlinePlayer
 */
const getDisplayMode = (link: LinkBlock): MediaDisplayMode => {
    if (link.mediaDisplayMode) return link.mediaDisplayMode;
    // Legacy fallback: showInlinePlayer true = preview only (old behavior)
    return link.showInlinePlayer ? "preview" : "button";
};

export const MediaConfig: React.FC<MediaConfigProps> = ({ link, onUpdate }) => {
    const isVideo = link.type === "video" || link.type === "youtube";
    const isMusic = link.type === "music" || link.type === "spotify";
    const mediaInfo = MEDIA_INFO[link.type] || MEDIA_INFO.video;
    const IconComponent = isVideo ? Video : Music;
    const accentColor = isVideo ? "red" : "green";
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
            {/* URL Input */}
            <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    URL de {mediaInfo.name}
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <IconComponent
                            size={16}
                            className={isVideo ? "text-red-500" : "text-green-500"}
                        />
                    </div>
                    <input
                        type="url"
                        value={link.url || ""}
                        onChange={(e) =>
                            onUpdate(link.id, { url: e.target.value })
                        }
                        className={`w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl pl-10 pr-4 py-3 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 ${
                            isVideo
                                ? "focus:ring-red-500/20 focus:border-red-500"
                                : "focus:ring-green-500/20 focus:border-green-500"
                        } transition-all`}
                        placeholder={mediaInfo.placeholder}
                    />
                </div>
                <p className="text-xs text-neutral-400">{mediaInfo.help}</p>
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
                                ? `border-${accentColor}-500 bg-${accentColor}-50 dark:bg-${accentColor}-900/20`
                                : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
                        }`}
                    >
                        <ExternalLink
                            size={20}
                            className={`mx-auto mb-1.5 ${
                                displayMode === "button"
                                    ? `text-${accentColor}-500`
                                    : "text-neutral-400"
                            }`}
                        />
                        <span
                            className={`text-xs font-semibold ${
                                displayMode === "button"
                                    ? `text-${accentColor}-700 dark:text-${accentColor}-300`
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
                                ? `border-${accentColor}-500 bg-${accentColor}-50 dark:bg-${accentColor}-900/20`
                                : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
                        }`}
                    >
                        <Layout
                            size={20}
                            className={`mx-auto mb-1.5 ${
                                displayMode === "preview"
                                    ? `text-${accentColor}-500`
                                    : "text-neutral-400"
                            }`}
                        />
                        <span
                            className={`text-xs font-semibold ${
                                displayMode === "preview"
                                    ? `text-${accentColor}-700 dark:text-${accentColor}-300`
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
                                ? `border-${accentColor}-500 bg-${accentColor}-50 dark:bg-${accentColor}-900/20`
                                : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
                        }`}
                    >
                        <LayoutList
                            size={20}
                            className={`mx-auto mb-1.5 ${
                                displayMode === "both"
                                    ? `text-${accentColor}-500`
                                    : "text-neutral-400"
                            }`}
                        />
                        <span
                            className={`text-xs font-semibold ${
                                displayMode === "both"
                                    ? `text-${accentColor}-700 dark:text-${accentColor}-300`
                                    : "text-neutral-600 dark:text-neutral-400"
                            }`}
                        >
                            Boton + Preview
                        </span>
                    </button>
                </div>
            </div>

            {/* Player Size - Only for Spotify */}
            {isMusic && displayMode !== "button" && (
                <SegmentedSelect
                    label="Tamaño del reproductor"
                    value={link.playerSize || "normal"}
                    options={[
                        { value: "normal", label: "Normal" },
                        { value: "compact", label: "Compacto" },
                    ]}
                    columns={2}
                    onChange={(val) =>
                        onUpdate(link.id, {
                            playerSize: val as PlayerSize,
                        })
                    }
                    uppercase
                />
            )}

            {/* Playback Options - Only when preview is shown */}
            {displayMode !== "button" && (
                <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Opciones de reproduccion
                    </label>
                    <div className="grid gap-2">
                        {/* Auto Play */}
                        <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-100 dark:border-neutral-700">
                            <Toggle
                                label="Reproducir automaticamente"
                                checked={link.autoPlay ?? false}
                                onChange={(val) =>
                                    onUpdate(link.id, {
                                        autoPlay: val,
                                    })
                                }
                                labelPosition="left"
                            />
                        </div>

                        {/* Start Muted - Only for video */}
                        {isVideo && (
                            <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-100 dark:border-neutral-700">
                                <Toggle
                                    label="Iniciar silenciado"
                                    checked={link.startMuted ?? false}
                                    onChange={(val) =>
                                        onUpdate(link.id, {
                                            startMuted: val,
                                        })
                                    }
                                    labelPosition="left"
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
