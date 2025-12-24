import { SegmentedSelect } from "@/Components/ui/SegmentedSelect";
import { Toggle } from "@/Components/ui/Toggle";
import { LinkBlock, PlayerSize } from "@/types";
import React from "react";

interface MediaConfigProps {
    link: LinkBlock;
    onUpdate: (id: string, updates: Partial<LinkBlock>) => void;
}

export const MediaConfig: React.FC<MediaConfigProps> = ({ link, onUpdate }) => {
    const isVideo = link.type === "video";
    const isMusic = link.type === "music";

    return (
        <div className="space-y-4">
            {/* Player Size - Only for music */}
            {isMusic && (
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

            {/* Playback Options */}
            <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Opciones de reproduccion
                </label>
                <div className="grid gap-2">
                    {/* Show Inline Player */}
                    <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-100 dark:border-neutral-700">
                        <Toggle
                            label="Mostrar reproductor en linea"
                            checked={link.showInlinePlayer ?? false}
                            onChange={(val) =>
                                onUpdate(link.id, {
                                    showInlinePlayer: val,
                                })
                            }
                            labelPosition="left"
                        />
                    </div>

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
        </div>
    );
};

