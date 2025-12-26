/**
 * CalendarConfig - Configuration panel for Calendar/Booking block
 * Supports: Calendly, Cal.com, Acuity Scheduling
 *
 * Related files:
 * - types.ts: CalendarProvider, CalendarDisplayMode types
 * - useLinkValidation.ts: validateCalendarUrl, detectCalendarProvider
 * - blocks/CalendarBlock.tsx: Renderer for LandingContent
 * - LandingContent.tsx: Uses CalendarBlock for public display
 */

import { SegmentedSelect } from "@/Components/ui/SegmentedSelect";
import { CalendarDisplayMode, CalendarProvider, LinkBlock } from "@/types";
import { Calendar, ExternalLink, Layout } from "lucide-react";
import React, { useEffect } from "react";

interface CalendarConfigProps {
    link: LinkBlock;
    onUpdate: (id: string, updates: Partial<LinkBlock>) => void;
}

// Calendar provider info for UI
const CALENDAR_PROVIDERS: {
    value: CalendarProvider;
    label: string;
    placeholder: string;
    icon?: React.ReactNode;
}[] = [
    {
        value: "calendly",
        label: "Calendly",
        placeholder: "https://calendly.com/tu-usuario",
    },
    {
        value: "cal",
        label: "Cal.com",
        placeholder: "https://cal.com/tu-usuario",
    },
    {
        value: "acuity",
        label: "Acuity",
        placeholder: "https://tu-empresa.acuityscheduling.com",
    },
    {
        value: "other",
        label: "Otro",
        placeholder: "https://tu-calendario.com/reservar",
    },
];

/**
 * Detects calendar provider from URL
 */
const detectProvider = (url: string): CalendarProvider => {
    if (!url) return "calendly";
    const lower = url.toLowerCase();
    if (lower.includes("calendly.com")) return "calendly";
    if (lower.includes("cal.com")) return "cal";
    if (lower.includes("acuityscheduling.com")) return "acuity";
    return "other";
};

export const CalendarConfig: React.FC<CalendarConfigProps> = ({
    link,
    onUpdate,
}) => {
    const currentProvider = link.calendarProvider || "calendly";
    const currentDisplayMode = link.calendarDisplayMode || "button";
    const providerInfo =
        CALENDAR_PROVIDERS.find((p) => p.value === currentProvider) ||
        CALENDAR_PROVIDERS[0];

    // Auto-detect provider when URL changes
    useEffect(() => {
        if (link.url) {
            const detected = detectProvider(link.url);
            if (detected !== link.calendarProvider) {
                onUpdate(link.id, { calendarProvider: detected });
            }
        }
    }, [link.url]);

    return (
        <div className="space-y-5">
            {/* Calendar URL */}
            <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    URL del Calendario
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar
                            size={16}
                            className="text-blue-500 dark:text-blue-400"
                        />
                    </div>
                    <input
                        type="url"
                        value={link.url || ""}
                        onChange={(e) =>
                            onUpdate(link.id, {
                                url: e.target.value,
                            })
                        }
                        className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl pl-10 pr-4 py-3 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        placeholder={providerInfo.placeholder}
                    />
                </div>
                <p className="text-xs text-neutral-400">
                    Pega la URL de tu calendario de Calendly, Cal.com, o Acuity
                </p>
            </div>

            {/* Provider Selection */}
            <SegmentedSelect
                label="Proveedor"
                value={currentProvider}
                options={CALENDAR_PROVIDERS.map((p) => ({
                    value: p.value,
                    label: p.label,
                }))}
                columns={4}
                onChange={(val) =>
                    onUpdate(link.id, {
                        calendarProvider: val as CalendarProvider,
                    })
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
                            onUpdate(link.id, { calendarDisplayMode: "button" })
                        }
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                            currentDisplayMode === "button"
                                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
                        }`}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <ExternalLink
                                size={18}
                                className={
                                    currentDisplayMode === "button"
                                        ? "text-blue-500"
                                        : "text-neutral-400"
                                }
                            />
                            <span
                                className={`font-semibold ${
                                    currentDisplayMode === "button"
                                        ? "text-blue-700 dark:text-blue-300"
                                        : "text-neutral-700 dark:text-neutral-300"
                                }`}
                            >
                                Boton
                            </span>
                        </div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            Abre el calendario en una nueva pestana
                        </p>
                    </button>

                    {/* Inline Mode */}
                    <button
                        onClick={() =>
                            onUpdate(link.id, { calendarDisplayMode: "inline" })
                        }
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                            currentDisplayMode === "inline"
                                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
                        }`}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <Layout
                                size={18}
                                className={
                                    currentDisplayMode === "inline"
                                        ? "text-blue-500"
                                        : "text-neutral-400"
                                }
                            />
                            <span
                                className={`font-semibold ${
                                    currentDisplayMode === "inline"
                                        ? "text-blue-700 dark:text-blue-300"
                                        : "text-neutral-700 dark:text-neutral-300"
                                }`}
                            >
                                En linea
                            </span>
                        </div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            Muestra el calendario embebido en tu pagina
                        </p>
                    </button>
                </div>
            </div>

            {/* Info Box */}
            <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-100 dark:border-neutral-700">
                <p className="text-xs text-neutral-500 leading-relaxed">
                    {currentProvider === "calendly" &&
                        "En Calendly, ve a tu perfil y copia la URL de tu pagina de reservas (ej: calendly.com/tu-usuario)"}
                    {currentProvider === "cal" &&
                        "En Cal.com, ve a tu dashboard y copia el link de tu evento (ej: cal.com/tu-usuario/15min)"}
                    {currentProvider === "acuity" &&
                        "En Acuity, ve a Business Settings > Embed Codes y copia tu URL de reservas"}
                    {currentProvider === "other" &&
                        "Pega la URL directa a tu sistema de reservas o calendario"}
                </p>
            </div>
        </div>
    );
};

