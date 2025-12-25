import { Button } from "@/Components/ui/Button";
import { Card, CardBody, CardHeader } from "@/Components/ui/Card";
import { Input } from "@/Components/ui/Input";
import { Label } from "@/Components/ui/Label";
import { Textarea } from "@/Components/ui/Textarea";
import { UserProfile } from "@/types";
import { usePage } from "@inertiajs/react";
import { AtSign, BarChart3, Check, Globe, Lock, Search } from "lucide-react";
import React from "react";

interface SettingsTabProps {
    user: UserProfile;
    onUpdateUser: (updates: Partial<UserProfile>) => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
    user,
    onUpdateUser,
}) => {
    const { appUrl } = usePage<{ appUrl: string }>().props;
    const displayDomain = appUrl.replace(/^https?:\/\//, "");
    const handleName = user.handle.startsWith("@")
        ? user.handle.substring(1)
        : user.handle;

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
                <CardBody className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="username">Nombre de usuario</Label>
                        <div className="relative">
                            {/* Validation icon inside input */}
                            <div className="absolute top-1/2 -translate-y-1/2 left-4 text-green-500">
                                <Check size={18} strokeWidth={3} />
                            </div>
                            <input
                                id="username"
                                type="text"
                                value={handleName}
                                onChange={(e) =>
                                    onUpdateUser({
                                        handle: `@${e.target.value}`,
                                    })
                                }
                                className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl pl-11 pr-4 py-3 font-bold text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder-neutral-300 dark:placeholder-neutral-600"
                                placeholder="username"
                            />
                        </div>
                        {/* Helper Text */}
                        <div className="flex justify-between px-1">
                            <p className="text-xs text-neutral-400 dark:text-neutral-500">
                                {displayDomain}/
                                <span className="font-bold text-neutral-600 dark:text-neutral-300">
                                    {handleName}
                                </span>
                            </p>
                            <p className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-1">
                                Disponible
                            </p>
                        </div>
                    </div>
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
                                value={user.seoTitle || ""}
                                onChange={(e) =>
                                    onUpdateUser({ seoTitle: e.target.value })
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
                        value={user.seoDescription || ""}
                        onChange={(e) =>
                            onUpdateUser({ seoDescription: e.target.value })
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
                            value={user.googleAnalyticsId || ""}
                            onChange={(e) =>
                                onUpdateUser({
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
                            value={user.facebookPixelId || ""}
                            onChange={(e) =>
                                onUpdateUser({
                                    facebookPixelId: e.target.value,
                                })
                            }
                            className="font-mono text-sm"
                            placeholder="123456789012345"
                        />
                    </div>
                </CardBody>
            </Card>

            {/* Danger Zone */}
            <div className="border border-red-100 dark:border-red-900/50 bg-red-50/30 dark:bg-red-900/10 rounded-[32px] p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full">
                        <Lock size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-red-900 dark:text-red-300">
                            Perfil privado
                        </h3>
                        <p className="text-xs text-red-700/60 dark:text-red-400/60">
                            Oculta tu perfil de los buscadores.
                        </p>
                    </div>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    className="border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                    Configurar
                </Button>
            </div>
        </div>
    );
};
