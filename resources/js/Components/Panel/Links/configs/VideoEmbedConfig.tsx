/**
 * VideoEmbedConfig - Configuration panel for Vimeo, TikTok, Twitch blocks
 *
 * Shared config for video embed blocks
 *
 * Related files:
 * - types.ts: LinkBlock.showInlinePlayer, videoId
 * - blocks/VideoEmbedBlock.tsx: Renderer for LandingContent
 */

import { Toggle } from "@/Components/ui/Toggle";
import { BlockType, LinkBlock } from "@/types";
import { ExternalLink, Layout, Video } from "lucide-react";
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

export const VideoEmbedConfig: React.FC<VideoEmbedConfigProps> = ({
    link,
    onUpdate,
}) => {
    const provider = PROVIDER_INFO[link.type] || PROVIDER_INFO.vimeo;
    const colorClass = `${provider.color}-500`;

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
                            className={`text-${colorClass} dark:text-${colorClass}`}
                        />
                    </div>
                    <input
                        type="url"
                        value={link.url || ""}
                        onChange={(e) =>
                            onUpdate(link.id, { url: e.target.value })
                        }
                        className={`w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl pl-10 pr-4 py-3 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-${colorClass}/20 focus:border-${colorClass} transition-all`}
                        placeholder={provider.placeholder}
                    />
                </div>
                <p className="text-xs text-neutral-400">{provider.help}</p>
            </div>

            {/* Display Mode - only for Vimeo (TikTok and Twitch work differently) */}
            {link.type === "vimeo" && (
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Modo de visualizacion
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {/* Button Mode */}
                        <button
                            onClick={() =>
                                onUpdate(link.id, { showInlinePlayer: false })
                            }
                            className={`p-4 rounded-xl border-2 transition-all text-left ${
                                !link.showInlinePlayer
                                    ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20"
                                    : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
                            }`}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <ExternalLink
                                    size={18}
                                    className={
                                        !link.showInlinePlayer
                                            ? "text-cyan-500"
                                            : "text-neutral-400"
                                    }
                                />
                                <span
                                    className={`font-semibold ${
                                        !link.showInlinePlayer
                                            ? "text-cyan-700 dark:text-cyan-300"
                                            : "text-neutral-700 dark:text-neutral-300"
                                    }`}
                                >
                                    Boton
                                </span>
                            </div>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                Abre en {provider.name}
                            </p>
                        </button>

                        {/* Inline Mode */}
                        <button
                            onClick={() =>
                                onUpdate(link.id, { showInlinePlayer: true })
                            }
                            className={`p-4 rounded-xl border-2 transition-all text-left ${
                                link.showInlinePlayer
                                    ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20"
                                    : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
                            }`}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <Layout
                                    size={18}
                                    className={
                                        link.showInlinePlayer
                                            ? "text-cyan-500"
                                            : "text-neutral-400"
                                    }
                                />
                                <span
                                    className={`font-semibold ${
                                        link.showInlinePlayer
                                            ? "text-cyan-700 dark:text-cyan-300"
                                            : "text-neutral-700 dark:text-neutral-300"
                                    }`}
                                >
                                    Embebido
                                </span>
                            </div>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                Reproduce en tu pagina
                            </p>
                        </button>
                    </div>
                </div>
            )}

            {/* Twitch specific: autoplay toggle */}
            {link.type === "twitch" && (
                <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-100 dark:border-neutral-700">
                    <Toggle
                        label="Mostrar chat en vivo"
                        checked={link.showInlinePlayer ?? false}
                        onChange={(val) =>
                            onUpdate(link.id, { showInlinePlayer: val })
                        }
                        labelPosition="left"
                    />
                </div>
            )}

            {/* TikTok specific note */}
            {link.type === "tiktok" && (
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

