/**
 * BackgroundSection - Background image upload and configuration.
 */

import { ImageUploader } from "@/Components/Shared/ImageUploader";
import { PositionSelector } from "@/Components/ui/PositionSelector";
import { Toggle } from "@/Components/ui/Toggle";
import {
    BG_ATTACHMENT_OPTIONS,
    BG_REPEAT_OPTIONS,
    BG_SIZE_OPTIONS,
} from "@/constants/designOptions";
import { CustomDesignConfig, LandingProfile } from "@/types/index";
import { Image, Trash2 } from "lucide-react";
import React from "react";

interface BackgroundSectionProps {
    landing: LandingProfile;
    /** Updates top-level fields (direct merge) */
    onUpdateLanding: (updates: Partial<LandingProfile>) => void;
    /** Updates customDesign fields (colors, buttons, etc.) with theme logic */
    onUpdateCustomDesign: (key: keyof CustomDesignConfig, value: any) => void;
    hasBackgroundImage: boolean;
}

export const BackgroundSection: React.FC<BackgroundSectionProps> = ({
    landing,
    onUpdateLanding,
    onUpdateCustomDesign,
    hasBackgroundImage,
}) => {
    const handleBackgroundToggle = (enabled: boolean) => {
        onUpdateCustomDesign("backgroundEnabled", enabled);
    };

    const handleDeleteBackground = () => {
        onUpdateCustomDesign("backgroundImage", undefined);
    };

    const handleUploadBackground = (imageData: { base64: string } | null) => {
        if (imageData) {
            // Use onUpdateLanding for batch updates - handleUpdateUser does deep merge of customDesign
            onUpdateLanding({
                customDesign: {
                    ...landing.customDesign,
                    backgroundImage: imageData.base64,
                    backgroundEnabled: true,
                },
            });
        }
    };

    return (
        <section className="bg-white dark:bg-neutral-900 rounded-[32px] p-6 md:p-8 border border-neutral-100 dark:border-neutral-800 shadow-soft-xl">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400">
                        <Image size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                            Imagen de Fondo
                        </h2>
                        <p className="text-sm text-neutral-400 dark:text-neutral-500">
                            Tu imagen se conserva al cambiar temas
                        </p>
                    </div>
                </div>

                {hasBackgroundImage && (
                    <Toggle
                        checked={
                            landing.customDesign.backgroundEnabled !== false
                        }
                        onChange={handleBackgroundToggle}
                        label="Mostrar"
                        labelPosition="left"
                        size="md"
                    />
                )}
            </div>

            <div
                className={`flex flex-col ${
                    hasBackgroundImage &&
                    landing.customDesign.backgroundEnabled !== false
                        ? "md:flex-row md:min-h-[280px]"
                        : ""
                } gap-4`}
            >
                {/* Image preview / Upload zone */}
                <div
                    className={`relative ${
                        hasBackgroundImage &&
                        landing.customDesign.backgroundEnabled !== false
                            ? "md:w-3/4 md:h-full"
                            : "w-full"
                    }`}
                >
                    <div
                        className={`
                            relative w-full h-48 md:h-full md:min-h-[280px] rounded-2xl border-2 border-dashed transition-all duration-300
                            ${
                                hasBackgroundImage
                                    ? "border-transparent"
                                    : "border-neutral-300 dark:border-neutral-600 hover:border-brand-400 dark:hover:border-brand-500"
                            }
                            ${
                                hasBackgroundImage &&
                                !landing.customDesign.backgroundEnabled
                                    ? "opacity-50"
                                    : ""
                            }
                        `}
                        style={
                            hasBackgroundImage
                                ? {
                                      backgroundImage: (() => {
                                          const bgImg =
                                              landing.customDesign
                                                  .backgroundImage;
                                          if (!bgImg) return undefined;
                                          const imgStr = bgImg.toString();
                                          // If already wrapped in url(), use as-is
                                          if (imgStr.startsWith("url("))
                                              return imgStr;
                                          // If base64 or URL, wrap in url()
                                          return `url("${imgStr}")`;
                                      })(),
                                      backgroundSize:
                                          landing.customDesign.backgroundSize ||
                                          "cover",
                                      backgroundPosition:
                                          landing.customDesign
                                              .backgroundPosition || "center",
                                      backgroundRepeat:
                                          landing.customDesign
                                              .backgroundRepeat || "no-repeat",
                                      backgroundColor:
                                          landing.customDesign.backgroundColor,
                                  }
                                : {
                                      backgroundColor:
                                          landing.customDesign.backgroundColor,
                                  }
                        }
                    >
                        {/* Disabled overlay */}
                        {hasBackgroundImage &&
                            !landing.customDesign.backgroundEnabled && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl">
                                    <span className="px-3 py-1.5 bg-neutral-900/80 text-white text-sm font-medium rounded-lg">
                                        Imagen desactivada
                                    </span>
                                </div>
                            )}

                        {/* Delete button */}
                        {hasBackgroundImage && (
                            <button
                                onClick={handleDeleteBackground}
                                className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg transition-colors z-10"
                                data-tooltip="Eliminar imagen"
                            >
                                <Trash2 size={18} />
                            </button>
                        )}

                        {/* Upload overlay/zone */}
                        <div
                            className={`
                                absolute inset-0 flex flex-col items-center justify-center rounded-2xl
                                ${
                                    hasBackgroundImage
                                        ? "bg-black/40 opacity-0 hover:opacity-100 transition-opacity"
                                        : ""
                                }
                            `}
                        >
                            <ImageUploader
                                value={
                                    landing.customDesign.backgroundImage
                                        ?.toString()
                                        .startsWith("data:")
                                        ? landing.customDesign.backgroundImage?.toString()
                                        : undefined
                                }
                                onChange={handleUploadBackground}
                                rounded={false}
                                size={hasBackgroundImage ? "100%" : 80}
                                hidePreview={hasBackgroundImage}
                                aspectRatio={16 / 10}
                                label={
                                    hasBackgroundImage
                                        ? undefined
                                        : "Subir imagen de fondo"
                                }
                                outputFormat="webp"
                                outputQuality={0.82}
                                resizeWidth={1920}
                                maxSizeKB={8000}
                                className={
                                    hasBackgroundImage ? "w-full h-full" : ""
                                }
                                canDelete={false}
                                showSuccessIndicator={true}
                            />
                        </div>
                    </div>
                </div>

                {/* Background options */}
                {hasBackgroundImage &&
                    landing.customDesign.backgroundEnabled !== false && (
                        <div className="md:w-1/4 flex flex-col gap-4">
                            {/* Position selector */}
                            <div className="flex justify-center md:justify-start">
                                <PositionSelector
                                    value={
                                        landing.customDesign
                                            .backgroundPosition || "center"
                                    }
                                    onChange={(pos) =>
                                        onUpdateCustomDesign(
                                            "backgroundPosition",
                                            pos
                                        )
                                    }
                                    label="Posicion"
                                />
                            </div>

                            {/* Other controls */}
                            <div className="grid grid-cols-3 md:grid-cols-1 gap-3">
                                {/* Size */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                                        Tamaño
                                    </label>
                                    <div className="flex gap-0.5 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg">
                                        {BG_SIZE_OPTIONS.map((opt) => (
                                            <button
                                                key={opt.value}
                                                onClick={() =>
                                                    onUpdateCustomDesign(
                                                        "backgroundSize",
                                                        opt.value
                                                    )
                                                }
                                                className={`flex-1 px-1.5 py-1 text-[10px] font-medium rounded-md transition-all ${
                                                    (landing.customDesign
                                                        .backgroundSize ||
                                                        "cover") === opt.value
                                                        ? "bg-white dark:bg-neutral-700 shadow-sm text-neutral-900 dark:text-white"
                                                        : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                                                }`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Repeat */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                                        Repetir
                                    </label>
                                    <select
                                        value={
                                            landing.customDesign
                                                .backgroundRepeat || "no-repeat"
                                        }
                                        onChange={(e) =>
                                            onUpdateCustomDesign(
                                                "backgroundRepeat",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-2 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                                    >
                                        {BG_REPEAT_OPTIONS.map((opt) => (
                                            <option
                                                key={opt.value}
                                                value={opt.value}
                                            >
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Attachment */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                                        Fijacion
                                    </label>
                                    <div className="flex gap-0.5 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg">
                                        {BG_ATTACHMENT_OPTIONS.map((opt) => (
                                            <button
                                                key={opt.value}
                                                onClick={() =>
                                                    onUpdateCustomDesign(
                                                        "backgroundAttachment",
                                                        opt.value as
                                                            | "fixed"
                                                            | "scroll"
                                                    )
                                                }
                                                className={`flex-1 px-1.5 py-1 text-[10px] font-medium rounded-md transition-all ${
                                                    (landing.customDesign
                                                        .backgroundAttachment ||
                                                        "scroll") === opt.value
                                                        ? "bg-white dark:bg-neutral-700 shadow-sm text-neutral-900 dark:text-white"
                                                        : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                                                }`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
            </div>
        </section>
    );
};
