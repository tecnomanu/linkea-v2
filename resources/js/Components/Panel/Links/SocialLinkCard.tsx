import { Button } from "@/Components/ui/Button";
import { ConfirmDialog } from "@/Components/ui/ConfirmDialog";
import { Icon } from "@/constants/icons";
import { useDebounceWithPending } from "@/hooks/useDebounce";
import { validateUrl } from "@/hooks/useLinkValidation";
import {
    Check,
    Eye,
    EyeOff,
    Loader2,
    Share2,
    Trash2,
    XCircle,
} from "lucide-react";
import { useState } from "react";
import { IconSelector } from "./IconSelector";
import { LinkCardContainer } from "./LinkCardContainer";
import { LinkStats } from "./LinkStats";
import { LinkStatsExpanded } from "./LinkStatsExpanded";

interface SocialLink {
    id: string;
    url: string;
    icon?: Icon;
    active: boolean;
    clicks?: number;
    sparklineData?: { value: number }[];
}

interface SocialLinkCardProps {
    link: SocialLink;
    onUpdate: (id: string, data: Partial<SocialLink>) => void;
    onDelete: (id: string) => void;
}

export const SocialLinkCard: React.FC<SocialLinkCardProps> = ({
    link,
    onUpdate,
    onDelete,
}) => {
    const [isIconSelectorOpen, setIsIconSelectorOpen] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showStats, setShowStats] = useState(false);

    const handleUrlChange = (url: string) => {
        onUpdate(link.id, { url });
    };

    const handleIconChange = (icon: Icon) => {
        onUpdate(link.id, { icon });
    };

    const handleToggleActive = () => {
        onUpdate(link.id, { active: !link.active });
    };

    // Debounce URL validation
    const [debouncedUrl, isValidating] = useDebounceWithPending(
        link.url || "",
        400
    );

    // Use proper URL validation with debounced value
    const isValidUrl = debouncedUrl ? validateUrl(debouncedUrl) : false;

    return (
        <>
            <LinkCardContainer
                id={link.id}
                isEnabled={link.active}
                badge={{
                    label: "Social",
                    className:
                        "bg-gradient-to-r from-brand-500 to-pink-500 text-white",
                }}
                expandedContent={
                    showStats ? (
                        <LinkStatsExpanded
                            linkId={link.id}
                            isEnabled={link.active}
                            onClose={() => setShowStats(false)}
                        />
                    ) : undefined
                }
            >
                {/* Content Grid */}
                <div className="flex-1 grid grid-cols-[auto_1fr] gap-4 items-center">
                    {/* Icon - Clickable to open icon selector */}
                    <button
                        onClick={() => setIsIconSelectorOpen(true)}
                        className={`
                            w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-sm
                            cursor-pointer hover:ring-2 hover:ring-brand-500/50 hover:scale-105
                            ${
                                link.active
                                    ? "bg-gradient-to-br from-brand-500 to-pink-500 text-white"
                                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-300 dark:text-neutral-600"
                            }
                        `}
                        title="Cambiar icono"
                    >
                        {link.icon ? (
                            <img
                                src={`/assets/images/icons/${link.icon.type}/${link.icon.name}.svg`}
                                alt={link.icon.name}
                                className="w-6 h-6"
                                style={{
                                    filter:
                                        link.active &&
                                        link.icon.type !== "colors"
                                            ? "brightness(0) invert(1)"
                                            : "none",
                                }}
                            />
                        ) : (
                            <Share2 size={20} />
                        )}
                    </button>

                    {/* Inputs */}
                    <div className="flex flex-col gap-1 min-w-0">
                        <span
                            className={`
                                font-bold text-base text-neutral-900 dark:text-white
                                ${
                                    !link.active &&
                                    "text-neutral-400 dark:text-neutral-600"
                                }
                            `}
                        >
                            {link.icon?.name
                                ? link.icon.name.charAt(0).toUpperCase() +
                                  link.icon.name.slice(1)
                                : "Social Link"}
                        </span>

                        <div className="flex items-center gap-1.5 min-w-0">
                            {isValidating ? (
                                <Loader2
                                    size={12}
                                    className="text-neutral-400 flex-shrink-0 animate-spin"
                                />
                            ) : isValidUrl ? (
                                <Check
                                    size={12}
                                    className="text-green-500 flex-shrink-0"
                                />
                            ) : (
                                <XCircle
                                    size={12}
                                    className="text-amber-500 flex-shrink-0"
                                />
                            )}
                            <input
                                type="url"
                                value={link.url}
                                onChange={(e) =>
                                    handleUrlChange(e.target.value)
                                }
                                className="text-sm text-neutral-500 dark:text-neutral-500 bg-transparent outline-none focus:bg-neutral-50 dark:focus:bg-neutral-800 rounded px-1 -ml-1 w-full truncate font-medium hover:text-brand-500 focus:text-brand-500 transition-colors"
                                placeholder="https://instagram.com/usuario"
                                title={
                                    isValidating
                                        ? "Validando..."
                                        : isValidUrl
                                        ? link.url
                                        : "URL invalida"
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* Stats & Actions */}
                <div className="flex items-center gap-6">
                    {/* Stats */}
                    <LinkStats
                        sparklineData={link.sparklineData || []}
                        clicks={link.clicks || 0}
                        isEnabled={link.active}
                        onClick={() => setShowStats(!showStats)}
                        isExpanded={showStats}
                    />

                    {/* Divider */}
                    <div className="h-8 w-px bg-neutral-100 dark:bg-neutral-800 mx-2 hidden md:block"></div>

                    {/* Toggle Active - Eye button style */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleToggleActive}
                        className={
                            link.active
                                ? "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/30"
                                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                        }
                        title={link.active ? "Desactivar" : "Activar"}
                    >
                        {link.active ? <Eye size={18} /> : <EyeOff size={18} />}
                    </Button>

                    {/* Delete */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Eliminar"
                    >
                        <Trash2 size={18} />
                    </Button>
                </div>
            </LinkCardContainer>

            {/* Icon Selector Modal */}
            <IconSelector
                isOpen={isIconSelectorOpen}
                onClose={() => setIsIconSelectorOpen(false)}
                onSelectIcon={handleIconChange}
                currentIcon={link.icon}
                onlyBrands
            />

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                variant="danger"
                title="Eliminar enlace social"
                message={`Se eliminara el enlace "${link.icon?.name || 'social'}" de forma permanente.`}
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
