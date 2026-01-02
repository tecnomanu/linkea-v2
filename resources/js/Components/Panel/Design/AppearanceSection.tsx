/**
 * AppearanceSection - Colors, button styles, typography customization.
 */

import { ColorPicker } from "@/Components/ui/ColorPicker";
import { Toggle } from "@/Components/ui/Toggle";
import {
    BUTTON_SHAPES,
    BUTTON_SIZES,
    BUTTON_STYLES,
    FONTS,
    ICON_ALIGNMENTS,
} from "@/constants/designOptions";
import { CustomDesignConfig, LandingProfile } from "@/types/index";
import { Palette } from "lucide-react";
import React from "react";

interface AppearanceSectionProps {
    landing: LandingProfile;
    /** Updates customDesign fields (colors, buttons, typography) with theme logic */
    onUpdateCustomDesign: (key: keyof CustomDesignConfig, value: any) => void;
}

export const AppearanceSection: React.FC<AppearanceSectionProps> = ({
    landing,
    onUpdateCustomDesign,
}) => {
    return (
        <section className="bg-white dark:bg-neutral-900 rounded-[32px] overflow-hidden border border-neutral-100 dark:border-neutral-800 shadow-soft-xl">
            <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                        <Palette size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                            Apariencia
                        </h2>
                        <p className="text-sm text-neutral-400 dark:text-neutral-500">
                            Personaliza colores, formas y tipografia.
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-6 md:p-8 space-y-8">
                {/* Background & Text Colors */}
                <div className="grid md:grid-cols-[200px_1fr] gap-6 items-start">
                    <div className="pt-2">
                        <label className="font-semibold text-neutral-800 dark:text-neutral-200 block">
                            Colores Base
                        </label>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                            Fondo y texto de la pagina
                        </p>
                    </div>
                    <div className="flex gap-8 flex-wrap">
                        <ColorPicker
                            value={landing.customDesign.backgroundColor}
                            onChange={(color) =>
                                onUpdateCustomDesign("backgroundColor", color)
                            }
                            label="Fondo"
                            size="md"
                            showHex
                        />
                        <ColorPicker
                            value={landing.customDesign.textColor || "#ffffff"}
                            onChange={(color) =>
                                onUpdateCustomDesign("textColor", color)
                            }
                            label="Texto"
                            size="md"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <p className="text-xs text-neutral-400 dark:text-neutral-500">
                            El color de texto se aplica a titulos, subtitulos y
                            encabezados. Si no lo configuras, se calculara
                            automaticamente segun el contraste del fondo.
                        </p>
                    </div>
                </div>

                <hr className="border-neutral-100 dark:border-neutral-800" />

                {/* Button Style */}
                <div className="grid md:grid-cols-[200px_1fr] gap-6 items-start">
                    <div className="pt-2">
                        <label className="font-semibold text-neutral-800 dark:text-neutral-200 block">
                            Estilo de Boton
                        </label>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                            Tipo de relleno visual
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {BUTTON_STYLES.map((style) => (
                            <button
                                key={style.id}
                                onClick={() =>
                                    onUpdateCustomDesign(
                                        "buttonStyle",
                                        style.id
                                    )
                                }
                                className={`
                                    h-12 rounded-xl text-sm font-bold transition-all
                                    ${style.previewClass}
                                    ${
                                        landing.customDesign.buttonStyle ===
                                        style.id
                                            ? "ring-2 ring-brand-500 ring-offset-2"
                                            : "hover:opacity-80"
                                    }
                                `}
                            >
                                {style.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Button Shape */}
                <div className="grid md:grid-cols-[200px_1fr] gap-6 items-start">
                    <div className="pt-2">
                        <label className="font-semibold text-neutral-800 dark:text-neutral-200 block">
                            Forma de Boton
                        </label>
                    </div>
                    <div className="flex gap-4 bg-neutral-50 dark:bg-neutral-800 p-1.5 rounded-2xl w-fit border border-neutral-100 dark:border-neutral-700">
                        {BUTTON_SHAPES.map((shape) => (
                            <button
                                key={shape.id}
                                onClick={() =>
                                    onUpdateCustomDesign(
                                        "buttonShape",
                                        shape.id
                                    )
                                }
                                className={`
                                    w-12 h-10 flex items-center justify-center transition-all shadow-sm
                                    ${shape.class}
                                    ${
                                        landing.customDesign.buttonShape ===
                                        shape.id
                                            ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-md"
                                            : "bg-transparent text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                                    }
                                `}
                            >
                                <div
                                    className={`w-6 h-4 border-2 border-current ${
                                        shape.class === "rounded-none"
                                            ? "rounded-none"
                                            : shape.class === "rounded-xl"
                                            ? "rounded-md"
                                            : "rounded-full"
                                    }`}
                                ></div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Button Size */}
                <div className="grid md:grid-cols-[200px_1fr] gap-6 items-start">
                    <div className="pt-2">
                        <label className="font-semibold text-neutral-800 dark:text-neutral-200 block">
                            Tamanio de Boton
                        </label>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                            Altura y espaciado interno
                        </p>
                    </div>
                    <div className="flex gap-2 bg-neutral-50 dark:bg-neutral-800 p-1.5 rounded-2xl w-fit border border-neutral-100 dark:border-neutral-700">
                        {BUTTON_SIZES.map((size) => (
                            <button
                                key={size.id}
                                onClick={() =>
                                    onUpdateCustomDesign("buttonSize", size.id)
                                }
                                className={`
                                    px-4 py-2 rounded-xl text-sm font-medium transition-all
                                    ${
                                        (landing.customDesign.buttonSize ||
                                            "compact") === size.id
                                            ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-md"
                                            : "bg-transparent text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                                    }
                                `}
                            >
                                {size.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Button Colors */}
                <div className="grid md:grid-cols-[200px_1fr] gap-6 items-start">
                    <div className="pt-2">
                        <label className="font-semibold text-neutral-800 dark:text-neutral-200 block">
                            Colores de Boton
                        </label>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                            Fondo, texto y borde opcional
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div className="flex gap-8 flex-wrap items-end">
                            <ColorPicker
                                value={landing.customDesign.buttonColor}
                                onChange={(color) =>
                                    onUpdateCustomDesign("buttonColor", color)
                                }
                                label="Fondo"
                                size="md"
                            />
                            <ColorPicker
                                value={landing.customDesign.buttonTextColor}
                                onChange={(color) =>
                                    onUpdateCustomDesign(
                                        "buttonTextColor",
                                        color
                                    )
                                }
                                label="Texto / Icono"
                                size="md"
                            />
                            <div className="flex flex-col gap-1">
                                <ColorPicker
                                    value={
                                        landing.customDesign.buttonBorderColor ||
                                        "#000000"
                                    }
                                    onChange={(color) =>
                                        onUpdateCustomDesign(
                                            "buttonBorderColor",
                                            color
                                        )
                                    }
                                    label="Borde"
                                    size="md"
                                    disabled={
                                        !landing.customDesign.buttonBorderEnabled
                                    }
                                />
                                <Toggle
                                    checked={
                                        landing.customDesign
                                            .buttonBorderEnabled === true
                                    }
                                    onChange={(checked) =>
                                        onUpdateCustomDesign(
                                            "buttonBorderEnabled",
                                            checked
                                        )
                                    }
                                    label={
                                        landing.customDesign.buttonBorderEnabled
                                            ? "Quitar borde"
                                            : "Agregar borde"
                                    }
                                    size="sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="border-neutral-100 dark:border-neutral-800" />

                {/* Button Icons Configuration */}
                <div className="grid md:grid-cols-[200px_1fr] gap-6 items-start">
                    <div className="pt-2">
                        <label className="font-semibold text-neutral-800 dark:text-neutral-200 block">
                            Iconos en Botones
                        </label>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                            Visibilidad y posicion de iconos
                        </p>
                    </div>
                    <div className="space-y-4">
                        <Toggle
                            checked={
                                landing.customDesign.showButtonIcons !== false
                            }
                            onChange={(checked) =>
                                onUpdateCustomDesign("showButtonIcons", checked)
                            }
                            label="Mostrar iconos"
                            size="md"
                        />

                        <div>
                            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 block">
                                Posicion del icono
                            </label>
                            <div className="flex gap-2 bg-neutral-100 dark:bg-neutral-800 p-1.5 rounded-xl w-fit">
                                {ICON_ALIGNMENTS.map((align) => (
                                    <button
                                        key={align.id}
                                        onClick={() =>
                                            onUpdateCustomDesign(
                                                "buttonIconAlignment",
                                                align.id
                                            )
                                        }
                                        disabled={
                                            landing.customDesign
                                                .showButtonIcons === false
                                        }
                                        className={`
                                            px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all
                                            ${
                                                (landing.customDesign
                                                    .buttonIconAlignment ||
                                                    "left") === align.id
                                                    ? "bg-white dark:bg-neutral-700 shadow-sm text-neutral-900 dark:text-white"
                                                    : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                                            }
                                            ${
                                                landing.customDesign
                                                    .showButtonIcons === false
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : ""
                                            }
                                        `}
                                        data-tooltip={align.label}
                                    >
                                        {align.icon}
                                        <span className="hidden sm:inline">
                                            {align.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-2">
                                El texto siempre esta centrado. Esta opcion
                                define donde aparece el icono.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Show Link Subtexts Toggle */}
                <div className="grid md:grid-cols-[200px_1fr] gap-6 items-start">
                    <div className="pt-2">
                        <label className="font-semibold text-neutral-800 dark:text-neutral-200 block">
                            Mostrar URLs
                        </label>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                            Muestra la URL debajo del titulo
                        </p>
                    </div>
                    <Toggle
                        checked={landing.customDesign.showLinkSubtext === true}
                        onChange={(checked) =>
                            onUpdateCustomDesign("showLinkSubtext", checked)
                        }
                        label="Mostrar enlaces"
                        size="md"
                    />
                </div>

                <hr className="border-neutral-100 dark:border-neutral-800" />

                {/* Typography */}
                <div className="grid md:grid-cols-[200px_1fr] gap-6 items-start">
                    <div className="pt-2">
                        <label className="font-semibold text-neutral-800 dark:text-neutral-200 block">
                            Tipografia
                        </label>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                            Estilo de fuente
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {FONTS.map((font) => (
                            <button
                                key={font.id}
                                onClick={() =>
                                    onUpdateCustomDesign("fontPair", font.id)
                                }
                                className={`
                                    p-4 rounded-xl border text-left transition-all
                                    ${
                                        landing.customDesign.fontPair === font.id
                                            ? "border-brand-500 bg-brand-50/20 dark:bg-brand-900/20"
                                            : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
                                    }
                                `}
                            >
                                <span
                                    className={`block text-lg font-bold text-neutral-900 dark:text-white ${font.fontClass}`}
                                >
                                    Aa
                                </span>
                                <span className="text-sm text-neutral-500 dark:text-neutral-400">
                                    {font.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
