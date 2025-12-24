/**
 * SoundCloudConfig - Configuration panel for SoundCloud audio block
 *
 * Related files:
 * - types.ts: LinkBlock.soundcloudUrl, showInlinePlayer
 * - blocks/SoundCloudBlock.tsx: Renderer for LandingContent
 */

import { Toggle } from "@/Components/ui/Toggle";
import { LinkBlock } from "@/types";
import { Headphones } from "lucide-react";
import React from "react";

interface SoundCloudConfigProps {
    link: LinkBlock;
    onUpdate: (id: string, updates: Partial<LinkBlock>) => void;
}

export const SoundCloudConfig: React.FC<SoundCloudConfigProps> = ({
    link,
    onUpdate,
}) => {
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

            {/* Inline Player Toggle */}
            <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-100 dark:border-neutral-700">
                <Toggle
                    label="Mostrar reproductor embebido"
                    checked={link.showInlinePlayer ?? true}
                    onChange={(val) =>
                        onUpdate(link.id, { showInlinePlayer: val })
                    }
                    labelPosition="left"
                />
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

