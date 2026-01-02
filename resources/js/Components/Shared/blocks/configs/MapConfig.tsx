/**
 * MapConfig - Configuration panel for Map/Location block
 *
 * Embeds Google Maps or links to map location
 *
 * Related files:
 * - types.ts: LinkBlock.mapAddress, mapQuery, mapZoom, mapDisplayMode, mapShowAddress
 * - blocks/MapBlock.tsx: Renderer for LandingContent
 */

import { SegmentedSelect } from "@/Components/ui/SegmentedSelect";
import { Toggle } from "@/Components/ui/Toggle";
import { LinkBlock } from "@/types/index";
import { ExternalLink, Layout, MapPin } from "lucide-react";
import React from "react";

interface MapConfigProps {
    link: LinkBlock;
    onUpdate: (id: string, updates: Partial<LinkBlock>) => void;
}

export const MapConfig: React.FC<MapConfigProps> = ({ link, onUpdate }) => {
    const displayMode = link.mapDisplayMode || "button";
    // Use mapAddress as primary, fallback to mapQuery for backwards compat
    const locationValue = link.mapAddress || link.mapQuery || "";

    const handleLocationChange = (value: string) => {
        // Store in mapAddress for simplicity
        onUpdate(link.id, { mapAddress: value, mapQuery: undefined });
    };

    return (
        <div className="space-y-5">
            {/* Location (unified input) */}
            <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Ubicacion
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin
                            size={16}
                            className="text-rose-500 dark:text-rose-400"
                        />
                    </div>
                    <input
                        type="text"
                        value={locationValue}
                        onChange={(e) => handleLocationChange(e.target.value)}
                        className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl pl-10 pr-4 py-3 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                        placeholder="Ej: Av. Corrientes 1234, CABA o Obelisco"
                    />
                </div>
                <p className="text-xs text-neutral-400">
                    Ingresa una direccion o el nombre del lugar
                </p>
            </div>

            {/* Show Address Toggle */}
            <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-100 dark:border-neutral-700">
                <Toggle
                    label="Mostrar direccion en el boton"
                    checked={link.mapShowAddress ?? false}
                    onChange={(val) =>
                        onUpdate(link.id, { mapShowAddress: val })
                    }
                    labelPosition="left"
                />
            </div>

            {/* Zoom Level */}
            <SegmentedSelect
                label="Nivel de zoom"
                value={(link.mapZoom || 15).toString()}
                options={[
                    { value: "12", label: "Lejos" },
                    { value: "15", label: "Normal" },
                    { value: "17", label: "Cerca" },
                    { value: "19", label: "Detalle" },
                ]}
                columns={4}
                onChange={(val) =>
                    onUpdate(link.id, { mapZoom: parseInt(val) })
                }
            />

            {/* Display Mode */}
            <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Modo de visualizacion
                </label>
                <div className="grid grid-cols-2 gap-3">
                    {/* Button Mode */}
                    <button
                        onClick={() =>
                            onUpdate(link.id, { mapDisplayMode: "button" })
                        }
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                            displayMode === "button"
                                ? "border-rose-500 bg-rose-50 dark:bg-rose-900/20"
                                : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
                        }`}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <ExternalLink
                                size={18}
                                className={
                                    displayMode === "button"
                                        ? "text-rose-500"
                                        : "text-neutral-400"
                                }
                            />
                            <span
                                className={`font-semibold ${
                                    displayMode === "button"
                                        ? "text-rose-700 dark:text-rose-300"
                                        : "text-neutral-700 dark:text-neutral-300"
                                }`}
                            >
                                Boton
                            </span>
                        </div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            Abre Google Maps en nueva pestana
                        </p>
                    </button>

                    {/* Inline Mode */}
                    <button
                        onClick={() =>
                            onUpdate(link.id, { mapDisplayMode: "inline" })
                        }
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                            displayMode === "inline"
                                ? "border-rose-500 bg-rose-50 dark:bg-rose-900/20"
                                : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
                        }`}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <Layout
                                size={18}
                                className={
                                    displayMode === "inline"
                                        ? "text-rose-500"
                                        : "text-neutral-400"
                                }
                            />
                            <span
                                className={`font-semibold ${
                                    displayMode === "inline"
                                        ? "text-rose-700 dark:text-rose-300"
                                        : "text-neutral-700 dark:text-neutral-300"
                                }`}
                            >
                                Mapa embebido
                            </span>
                        </div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            Muestra el mapa en tu pagina
                        </p>
                    </button>
                </div>
            </div>
        </div>
    );
};

