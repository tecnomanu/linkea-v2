import { Button } from "@/Components/ui/Button";
import { Card, CardBody, CardHeader } from "@/Components/ui/Card";
import { HandleInput } from "@/Components/ui/HandleInput";
import { Input } from "@/Components/ui/Input";
import { Label } from "@/Components/ui/Label";
import { Textarea } from "@/Components/ui/Textarea";
import { Toggle } from "@/Components/ui/Toggle";
import { useHandleValidation } from "@/hooks/useHandleValidation";
import { LandingProfile } from "@/types/index";
import {
    AtSign,
    BarChart3,
    Globe,
    Lock,
    RotateCcw,
    Search,
} from "lucide-react";
import React, { useCallback, useState } from "react";

interface SettingsTabProps {
    /** Landing profile (public landing configuration, NOT authenticated user) */
    landing: LandingProfile;
    onUpdateLanding: (updates: Partial<LandingProfile>) => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
    landing,
    onUpdateLanding,
}) => {
    // Extract handle without @ prefix
    const initialHandle = landing.handle.startsWith("@")
        ? landing.handle.substring(1)
        : landing.handle;

    const [isSavingHandle, setIsSavingHandle] = useState(false);

    // Handle validation with async availability check
    const handleValidation = useHandleValidation({
        initialValue: initialHandle,
        checkAvailability: true,
        debounceMs: 500,
    });

    // Handle change - only update input, NOT the backend
    const handleHandleChange = useCallback(
        (value: string) => {
            handleValidation.onChange(value);
            // Don't call onUpdateLanding here - wait for confirmation
        },
        [handleValidation]
    );

    // Confirm handle change - this actually saves
    const handleConfirmChange = useCallback(async () => {
        if (!handleValidation.canSave) return;

        setIsSavingHandle(true);
        try {
            // Save the new handle
            onUpdateLanding({ handle: `@${handleValidation.value}` });
            // Mark as confirmed (updates original value in hook)
            handleValidation.confirm();
        } finally {
            setIsSavingHandle(false);
        }
    }, [handleValidation, onUpdateLanding]);

    // Reset to original value
    const handleResetHandle = useCallback(() => {
        handleValidation.reset();
    }, [handleValidation]);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">
            {/* URL / Handle Configuration */}
            <Card padding="none">
                <CardHeader
                    icon={<AtSign size={24} />}
                    iconBg="bg-orange-50 dark:bg-orange-900/30"
                    iconColor="text-orange-600 dark:text-orange-400"
                    title="Mi nombre de Linkea"
                    subtitle="Reclama tu URL unica."
                />
                <CardBody className="space-y-4">
                    <HandleInput
                        id="username"
                        label="Nombre de usuario"
                        value={handleValidation.value}
                        onChange={handleHandleChange}
                        status={handleValidation.status}
                        message={handleValidation.message}
                        hasChanged={handleValidation.hasChanged}
                        placeholder="username"
                    />

                    {/* Action buttons - only show when changed */}
                    {handleValidation.hasChanged && (
                        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
                            <Button
                                size="sm"
                                onClick={handleConfirmChange}
                                disabled={
                                    !handleValidation.canSave || isSavingHandle
                                }
                                isLoading={isSavingHandle}
                            >
                                Cambiar nombre
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleResetHandle}
                                disabled={isSavingHandle}
                                className="text-neutral-500"
                            >
                                <RotateCcw size={14} className="mr-1" />
                                Cancelar
                            </Button>
                        </div>
                    )}
                </CardBody>
            </Card>

            {/* General Settings */}
            <Card padding="none">
                <CardHeader
                    icon={<Globe size={24} />}
                    iconBg="bg-blue-50 dark:bg-blue-900/30"
                    iconColor="text-blue-600 dark:text-blue-400"
                    title="Opciones generales"
                    subtitle="Configura como se ve tu pagina en navegadores."
                />

                <CardBody className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="seo-title" hint="(SEO)">
                            Titulo de la pagina
                        </Label>
                        <div className="relative">
                            <Search
                                className="absolute top-1/2 -translate-y-1/2 left-4 text-neutral-400"
                                size={18}
                            />
                            <input
                                id="seo-title"
                                type="text"
                                value={landing.seoTitle || ""}
                                onChange={(e) =>
                                    onUpdateLanding({ seoTitle: e.target.value })
                                }
                                className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl pl-11 pr-4 py-3 font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-neutral-400"
                                placeholder="Ej: Mis enlaces oficiales"
                            />
                        </div>
                        <p className="text-xs text-neutral-400 dark:text-neutral-500">
                            Esto aparece en la pestaña de busqueda de Google.
                        </p>
                    </div>

                    <Textarea
                        id="seo-description"
                        label="Meta descripcion"
                        value={landing.seoDescription || ""}
                        onChange={(e) =>
                            onUpdateLanding({ seoDescription: e.target.value })
                        }
                        rows={2}
                        placeholder="Una breve descripcion de tu pagina para buscadores..."
                    />
                </CardBody>
            </Card>

            {/* Analytics & Integrations */}
            <Card padding="none">
                <CardHeader
                    icon={<BarChart3 size={24} />}
                    iconBg="bg-green-50 dark:bg-green-900/30"
                    iconColor="text-green-600 dark:text-green-400"
                    title="Analiticas y Pixels"
                    subtitle="Rastrea tus visitantes con herramientas externas."
                />

                <CardBody className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <Input
                            id="ga-id"
                            type="text"
                            label="Google Analytics ID"
                            value={landing.googleAnalyticsId || ""}
                            onChange={(e) =>
                                onUpdateLanding({
                                    googleAnalyticsId: e.target.value,
                                })
                            }
                            className="font-mono text-sm"
                            placeholder="UA-XXXXXXXX-X"
                        />
                        <Input
                            id="fb-pixel"
                            type="text"
                            label="Facebook Pixel ID"
                            value={landing.facebookPixelId || ""}
                            onChange={(e) =>
                                onUpdateLanding({
                                    facebookPixelId: e.target.value,
                                })
                            }
                            className="font-mono text-sm"
                            placeholder="123456789012345"
                        />
                    </div>
                </CardBody>
            </Card>

            {/* Privacy Settings */}
            <Card padding="none">
                <CardHeader
                    icon={<Lock size={24} />}
                    iconBg="bg-red-50 dark:bg-red-900/30"
                    iconColor="text-red-600 dark:text-red-400"
                    title="Privacidad"
                    subtitle="Controla quien puede encontrar tu perfil."
                />
                <CardBody>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-neutral-900 dark:text-white">
                                Perfil privado
                            </p>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                Oculta tu perfil de Google y otros buscadores
                            </p>
                        </div>
                        <Toggle
                            checked={landing.isPrivate || false}
                            onChange={(checked) =>
                                onUpdateLanding({ isPrivate: checked })
                            }
                            size="md"
                        />
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};
