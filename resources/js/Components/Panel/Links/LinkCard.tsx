import { Button } from "@/Components/ui/Button";
import { ConfirmDialog } from "@/Components/ui/ConfirmDialog";
import { Toggle } from "@/Components/ui/Toggle";
import { Icon } from "@/constants/icons";
import { useDebounceWithPending } from "@/hooks/useDebounce";
import { useLinkValidation } from "@/hooks/useLinkValidation";
import { LinkBlock } from "@/types";
import { isLegacyIcon } from "@/utils/iconHelper";
import {
    Check,
    Image as ImageIcon,
    Loader2,
    Settings,
    Trash2,
    XCircle,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { BLOCK_CONFIG } from "./BlockSelector";
import { IconSelector } from "./IconSelector";
import { LinkCardContainer } from "./LinkCardContainer";
import { LinkConfigDialog } from "./LinkConfigDialog";
import { LinkStats } from "./LinkStats";
import { LinkStatsExpanded } from "./LinkStatsExpanded";

interface LinkCardProps {
    link: LinkBlock;
    onUpdate: (id: string, updates: Partial<LinkBlock>) => void;
    onDelete: (id: string) => void;
}

export const LinkCard: React.FC<LinkCardProps> = ({
    link,
    onUpdate,
    onDelete,
}) => {
    const [showConfig, setShowConfig] = useState(false);
    const [showIconSelector, setShowIconSelector] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showStats, setShowStats] = useState(false);
    const { isLinkComplete, getValidationError } = useLinkValidation();

    // Debounce the value that needs validation (URL or phone number)
    const valueToValidate = useMemo(() => {
        if (link.type === "whatsapp") return link.phoneNumber || "";
        if (link.type === "header") return link.title || "";
        return link.url || "";
    }, [link.type, link.url, link.phoneNumber, link.title]);

    const [debouncedValue, isValidating] = useDebounceWithPending(
        valueToValidate,
        400
    );

    // Create a link copy with debounced value for validation
    const linkForValidation = useMemo(() => {
        const copy = { ...link };
        if (link.type === "whatsapp") {
            copy.phoneNumber = debouncedValue;
        } else if (link.type !== "header") {
            copy.url = debouncedValue;
        }
        return copy;
    }, [link, debouncedValue]);

    const handleIconSelect = (icon: Icon) => {
        onUpdate(link.id, { icon });
    };

    const isValid = isLinkComplete(linkForValidation);
    const validationError = getValidationError(linkForValidation);

    // --- Styles & Assets based on Type ---
    const config = BLOCK_CONFIG[link.type] || BLOCK_CONFIG["link"];

    const getTypeAssets = () => {
        switch (link.type) {
            case "header":
                return {
                    placeholder: "Titulo de seccion",
                    subPlaceholder: "",
                };
            case "video":
            case "youtube":
                return {
                    placeholder: "Titulo del video",
                    subPlaceholder: "URL de YouTube",
                };
            case "music":
            case "spotify":
                return {
                    placeholder: "Titulo de la cancion",
                    subPlaceholder: "URL de Spotify",
                };
            case "whatsapp":
                return {
                    placeholder: "Texto del boton (ej: Escribinos)",
                    subPlaceholder: "",
                };
            case "twitter":
                return {
                    placeholder: "Titulo del tweet",
                    subPlaceholder: "URL del Tweet",
                };
            case "mastodon":
                return {
                    placeholder: "Nombre del perfil",
                    subPlaceholder: "URL de Mastodon",
                };
            case "calendar":
                return {
                    placeholder: "Agendar Cita",
                    subPlaceholder: "",
                    hideUrlInput: true,
                };
            case "email":
                return {
                    placeholder: "Contactame",
                    subPlaceholder: "",
                    hideUrlInput: true,
                };
            case "map":
                return {
                    placeholder: "Nuestra Ubicacion",
                    subPlaceholder: "",
                    hideUrlInput: true,
                };
            case "vimeo":
                return {
                    placeholder: "Titulo del video",
                    subPlaceholder: "URL de Vimeo",
                };
            case "tiktok":
                return {
                    placeholder: "Titulo del video",
                    subPlaceholder: "URL de TikTok",
                };
            case "soundcloud":
                return {
                    placeholder: "Titulo del audio",
                    subPlaceholder: "URL de SoundCloud",
                };
            case "twitch":
                return {
                    placeholder: "Canal de Twitch",
                    subPlaceholder: "URL o nombre del canal",
                };
            default:
                return {
                    placeholder: "Titulo del enlace",
                    subPlaceholder: "https://ejemplo.com",
                };
        }
    };

    const placeholders = getTypeAssets();

    return (
        <>
            <LinkCardContainer
                id={link.id}
                isEnabled={link.isEnabled}
                badge={{
                    label: config.label,
                    className: config.badgeBg,
                }}
                expandedContent={
                    showStats && link.type !== "header" ? (
                        <LinkStatsExpanded
                            linkId={link.id}
                            isEnabled={link.isEnabled}
                            onClose={() => setShowStats(false)}
                        />
                    ) : undefined
                }
            >
                {/* Content Grid */}
                <div className="flex-1 grid grid-cols-[auto_1fr] gap-4 items-center">
                    {/* Icon - Clickable to open icon selector */}
                    <button
                        onClick={() =>
                            link.type !== "header" && setShowIconSelector(true)
                        }
                        className={`
                            w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-sm
                            ${
                                link.type !== "header"
                                    ? "cursor-pointer hover:ring-2 hover:ring-brand-500/50 hover:scale-105"
                                    : "cursor-default"
                            }
                            ${
                                link.isEnabled
                                    ? config.colorClass
                                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-300 dark:text-neutral-600"
                            }
                        `}
                        title={
                            link.type !== "header" ? "Cambiar icono" : undefined
                        }
                    >
                        {isLegacyIcon(link.icon) ? (
                            <img
                                src={`/assets/images/icons/${link.icon.type}/${link.icon.name}.svg`}
                                alt={link.icon.name}
                                className="w-5 h-5"
                                style={{
                                    filter:
                                        link.isEnabled &&
                                        link.icon.type !== "colors"
                                            ? "brightness(0) invert(1)"
                                            : "none",
                                }}
                            />
                        ) : config.icon ? (
                            React.cloneElement(
                                config.icon as React.ReactElement<any>,
                                { size: 20 }
                            )
                        ) : (
                            <ImageIcon size={20} />
                        )}
                    </button>

                    {/* Inputs */}
                    <div className="flex flex-col gap-1 min-w-0">
                        <input
                            type="text"
                            value={link.title}
                            onChange={(e) =>
                                onUpdate(link.id, { title: e.target.value })
                            }
                            className={`
                                font-bold text-neutral-900 dark:text-white bg-transparent outline-none focus:bg-neutral-50 dark:focus:bg-neutral-800 rounded px-1 -ml-1 transition-colors w-full
                                ${
                                    !link.isEnabled &&
                                    "text-neutral-400 dark:text-neutral-600"
                                }
                                ${
                                    link.type === "header"
                                        ? "text-lg"
                                        : "text-base"
                                }
                            `}
                            placeholder={placeholders.placeholder}
                        />

                        {link.type !== "header" &&
                            (link.type === "whatsapp" ? (
                                <div className="flex items-center gap-1.5 px-1 -ml-1">
                                    {isValidating ? (
                                        <Loader2
                                            size={12}
                                            className="text-neutral-400 shrink-0 animate-spin"
                                        />
                                    ) : isValid ? (
                                        <Check
                                            size={12}
                                            className="text-green-500 shrink-0"
                                        />
                                    ) : (
                                        <XCircle
                                            size={12}
                                            className="text-amber-500 shrink-0"
                                        />
                                    )}
                                    <span
                                        className={`text-xs font-medium truncate ${
                                            isValidating
                                                ? "text-neutral-400"
                                                : isValid
                                                ? "text-green-600 dark:text-green-400"
                                                : "text-amber-600 dark:text-amber-400"
                                        }`}
                                    >
                                        {isValidating
                                            ? "Validando..."
                                            : link.phoneNumber
                                            ? `+${link.phoneNumber}`
                                            : validationError ||
                                              "Sin numero configurado"}
                                    </span>
                                </div>
                            ) : link.type === "calendar" ? (
                                <div className="flex items-center gap-1.5 px-1 -ml-1">
                                    {isValid ? (
                                        <Check
                                            size={12}
                                            className="text-green-500 shrink-0"
                                        />
                                    ) : (
                                        <XCircle
                                            size={12}
                                            className="text-amber-500 shrink-0"
                                        />
                                    )}
                                    <span
                                        className={`text-xs font-medium truncate ${
                                            isValid
                                                ? "text-green-600 dark:text-green-400"
                                                : "text-amber-600 dark:text-amber-400"
                                        }`}
                                    >
                                        {link.url
                                            ? link.url.replace(/^https?:\/\//, '').substring(0, 30) + (link.url.length > 30 ? '...' : '')
                                            : "Configurar en opciones"}
                                    </span>
                                </div>
                            ) : link.type === "email" ? (
                                <div className="flex items-center gap-1.5 px-1 -ml-1">
                                    {link.emailAddress ? (
                                        <Check
                                            size={12}
                                            className="text-green-500 shrink-0"
                                        />
                                    ) : (
                                        <XCircle
                                            size={12}
                                            className="text-amber-500 shrink-0"
                                        />
                                    )}
                                    <span
                                        className={`text-xs font-medium truncate ${
                                            link.emailAddress
                                                ? "text-green-600 dark:text-green-400"
                                                : "text-amber-600 dark:text-amber-400"
                                        }`}
                                    >
                                        {link.emailAddress || "Configurar en opciones"}
                                    </span>
                                </div>
                            ) : link.type === "map" ? (
                                <div className="flex items-center gap-1.5 px-1 -ml-1">
                                    {link.mapAddress || link.mapQuery ? (
                                        <Check
                                            size={12}
                                            className="text-green-500 shrink-0"
                                        />
                                    ) : (
                                        <XCircle
                                            size={12}
                                            className="text-amber-500 shrink-0"
                                        />
                                    )}
                                    <span
                                        className={`text-xs font-medium truncate ${
                                            link.mapAddress || link.mapQuery
                                                ? "text-green-600 dark:text-green-400"
                                                : "text-amber-600 dark:text-amber-400"
                                        }`}
                                    >
                                        {link.mapAddress || link.mapQuery || "Configurar en opciones"}
                                    </span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1.5 min-w-0">
                                    {isValidating ? (
                                        <Loader2
                                            size={12}
                                            className="text-neutral-400 shrink-0 animate-spin"
                                        />
                                    ) : isValid ? (
                                        <Check
                                            size={12}
                                            className="text-green-500 shrink-0"
                                        />
                                    ) : (
                                        <XCircle
                                            size={12}
                                            className="text-amber-500 shrink-0"
                                        />
                                    )}
                                    <input
                                        type="text"
                                        value={link.url}
                                        onChange={(e) =>
                                            onUpdate(link.id, {
                                                url: e.target.value,
                                            })
                                        }
                                        className="text-sm text-neutral-500 dark:text-neutral-500 bg-transparent outline-none focus:bg-neutral-50 dark:focus:bg-neutral-800 rounded px-1 -ml-1 w-full truncate font-medium hover:text-brand-500 focus:text-brand-500 transition-colors"
                                        placeholder={
                                            placeholders.subPlaceholder
                                        }
                                        title={
                                            isValidating
                                                ? "Validando..."
                                                : link.url ||
                                                  validationError ||
                                                  ""
                                        }
                                    />
                                </div>
                            ))}
                    </div>
                </div>

                {/* Analytics & Actions */}
                <div className="flex items-center gap-6">
                    {/* Stats */}
                    {link.type !== "header" && (
                        <LinkStats
                            sparklineData={link.sparklineData}
                            clicks={link.clicks}
                            isEnabled={link.isEnabled}
                            onClick={() => setShowStats(!showStats)}
                            isExpanded={showStats}
                        />
                    )}

                    {/* Divider */}
                    <div className="h-8 w-px bg-neutral-100 dark:bg-neutral-800 mx-2 hidden md:block"></div>

                    {/* Toggle Switch */}
                    <Toggle
                        checked={link.isEnabled}
                        onChange={(checked) =>
                            onUpdate(link.id, { isEnabled: checked })
                        }
                        size="md"
                        title="Toggle Visibility"
                    />

                    {/* Action Menu */}
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowConfig(true)}
                            title="Configure"
                        >
                            <Settings size={18} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowDeleteConfirm(true)}
                            className="hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                            title="Delete"
                        >
                            <Trash2 size={18} />
                        </Button>
                    </div>
                </div>
            </LinkCardContainer>

            {/* Configuration Modal */}
            <LinkConfigDialog
                isOpen={showConfig}
                onClose={() => setShowConfig(false)}
                link={link}
                onUpdate={onUpdate}
            />

            {/* Icon Selector Modal */}
            <IconSelector
                isOpen={showIconSelector}
                onClose={() => setShowIconSelector(false)}
                onSelectIcon={handleIconSelect}
                currentIcon={
                    isLegacyIcon(link.icon) ? (link.icon as Icon) : undefined
                }
            />

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                variant="danger"
                title="Eliminar bloque"
                message={`Se eliminara "${
                    link.title || config.label
                }" de forma permanente.`}
                primaryAction={{
                    label: "Eliminar",
                    variant: "danger",
                    onClick: () => {
                        onDelete(link.id);
                        setShowDeleteConfirm(false);
                    },
                }}
            />
        </>
    );
};
