/**
 * HeaderSection - Avatar, title, and subtitle configuration.
 */

import { ImageUploader } from "@/Components/Shared/ImageUploader";
import { Toggle } from "@/Components/ui/Toggle";
import { ToggleInput, ToggleTextarea } from "@/Components/ui/ToggleInput";
import { CustomDesignConfig, LandingProfile } from "@/types/index";
import { LayoutTemplate } from "lucide-react";
import React from "react";

interface HeaderSectionProps {
    landing: LandingProfile;
    /** Updates top-level fields (title, subtitle, avatar, etc.) */
    onUpdateLanding: (updates: Partial<LandingProfile>) => void;
    /** Updates customDesign fields (colors, buttons, etc.) with theme logic */
    onUpdateCustomDesign: (key: keyof CustomDesignConfig, value: any) => void;
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({
    landing,
    onUpdateLanding,
    onUpdateCustomDesign,
}) => {
    return (
        <section className="bg-white dark:bg-neutral-900 rounded-[32px] p-6 md:p-8 border border-neutral-100 dark:border-neutral-800 shadow-soft-xl">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-brand-50 dark:bg-brand-900/30 rounded-xl text-brand-600 dark:text-brand-400">
                    <LayoutTemplate size={24} />
                </div>
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                    Cabecera
                </h2>
            </div>
            <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Avatar Section */}
                <div className="flex flex-col items-center gap-2">
                    <ImageUploader
                        // Prioritize base64 (new upload) over thumb URL
                        value={
                            landing.avatar?.startsWith("data:")
                                ? landing.avatar
                                : landing.avatarThumb || landing.avatar
                        }
                        onChange={(imageData) => {
                            if (imageData) {
                                onUpdateLanding({ avatar: imageData.base64 });
                            } else {
                                onUpdateLanding({
                                    avatar: "/images/logos/logo-icon.webp",
                                });
                            }
                        }}
                        rounded={landing.customDesign.roundedAvatar !== false}
                        size={112}
                        aspectRatio={1}
                        label="Cambiar imagen"
                        outputFormat="png"
                        resizeWidth={400}
                        maxSizeKB={4000}
                        canDelete={false}
                        showSuccessIndicator={true}
                    />
                </div>

                {/* Right Side: Toggle + Inputs */}
                <div className="flex-1 w-full space-y-4">
                    {/* Avatar Style Toggles */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 py-2">
                        <Toggle
                            checked={landing.customDesign.roundedAvatar !== false}
                            onChange={(checked) =>
                                onUpdateCustomDesign("roundedAvatar", checked)
                            }
                            label="Redondear"
                            labelPosition="left"
                            size="md"
                        />
                        <Toggle
                            checked={landing.customDesign.avatarFloating !== false}
                            onChange={(checked) =>
                                onUpdateCustomDesign("avatarFloating", checked)
                            }
                            label="Flotante"
                            labelPosition="left"
                            size="md"
                        />
                    </div>

                    {/* Title Input with integrated Toggle */}
                    <ToggleInput
                        id="landing-title"
                        value={landing.title}
                        onChange={(value) => onUpdateLanding({ title: value })}
                        enabled={landing.showTitle !== false}
                        onEnabledChange={(enabled) =>
                            onUpdateLanding({ showTitle: enabled })
                        }
                        placeholder="Titulo de tu landing"
                        toggleTitle="Mostrar titulo"
                        className="font-bold"
                    />

                    {/* Subtitle Input with integrated Toggle */}
                    <ToggleTextarea
                        id="landing-subtitle"
                        value={landing.subtitle}
                        onChange={(value) => onUpdateLanding({ subtitle: value })}
                        enabled={landing.showSubtitle !== false}
                        onEnabledChange={(enabled) =>
                            onUpdateLanding({ showSubtitle: enabled })
                        }
                        rows={2}
                        placeholder="Subtitulo o descripcion breve"
                        toggleTitle="Mostrar subtitulo"
                    />
                </div>
            </div>
        </section>
    );
};
