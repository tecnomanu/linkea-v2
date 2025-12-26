/**
 * LinksTab - Main links management component
 *
 * Uses centralized configuration from @/config/blockConfig.ts
 */

import { Dialog, DialogBody, DialogContent } from "@/Components/ui/Dialog";
import { createBlockDefaults } from "@/Components/Shared/blocks/blockConfig";
import { Icon } from "@/constants/icons";
import { BlockType, LinkBlock } from "@/types";
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus, Sparkles } from "lucide-react";
import { useState } from "react";
import { BlockSelector } from "./BlockSelector";
import { LinkBar } from "./LinkBar";
import { LinkCard } from "./LinkCard";
import { SocialLinkCard } from "./SocialLinkCard";

export interface SocialLink {
    id: string;
    url: string;
    icon?: Icon;
    active: boolean;
    clicks?: number;
    sparklineData?: { value: number }[];
}

interface LinksTabProps {
    links: LinkBlock[];
    socialLinks: SocialLink[];
    onUpdateLinks: (links: LinkBlock[]) => void;
    onUpdateSocialLinks: (socialLinks: SocialLink[]) => void;
    currentLinkType: "blocks" | "social";
    onChangeLinkType: (type: "blocks" | "social") => void;
    landing?: any;
    user?: any;
}

export const LinksTab: React.FC<LinksTabProps> = ({
    links,
    socialLinks,
    onUpdateLinks,
    onUpdateSocialLinks,
    currentLinkType,
    landing,
    user,
}) => {
    const [isBlockSelectorOpen, setIsBlockSelectorOpen] = useState(false);
    const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);

    // DnD Sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleUpdateLink = (id: string, updates: Partial<LinkBlock>) => {
        onUpdateLinks(
            links.map((link) =>
                link.id === id ? { ...link, ...updates } : link
            )
        );
    };

    const handleDeleteLink = (id: string) => {
        onUpdateLinks(links.filter((link) => link.id !== id));
    };

    const handleAddBlock = (type: BlockType) => {
        // Get default values from centralized config
        const defaults = createBlockDefaults(type);

        const newLink: LinkBlock = {
            id: Math.random().toString(36).substr(2, 9),
            isEnabled: true,
            clicks: 0,
            type: type,
            sparklineData: Array(7)
                .fill(0)
                .map(() => ({ value: 0 })),
            ...defaults,
        };
        onUpdateLinks([newLink, ...links]);
        setIsBlockSelectorOpen(false);
    };

    const handleAddSocialLink = () => {
        const newSocialLink: SocialLink = {
            id: Math.random().toString(36).substr(2, 9),
            url: "",
            active: true,
            clicks: 0,
            sparklineData: Array(7)
                .fill(0)
                .map(() => ({ value: 0 })),
        };
        onUpdateSocialLinks([...socialLinks, newSocialLink]);
    };

    const handleUpdateSocialLink = (
        id: string,
        updates: Partial<SocialLink>
    ) => {
        onUpdateSocialLinks(
            socialLinks.map((link) =>
                link.id === id ? { ...link, ...updates } : link
            )
        );
    };

    const handleDeleteSocialLink = (id: string) => {
        onUpdateSocialLinks(socialLinks.filter((link) => link.id !== id));
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        if (currentLinkType === "blocks") {
            const oldIndex = links.findIndex((item) => item.id === active.id);
            const newIndex = links.findIndex((item) => item.id === over.id);
            if (oldIndex === -1 || newIndex === -1) return;
            onUpdateLinks(arrayMove(links, oldIndex, newIndex));
        } else {
            const oldIndex = socialLinks.findIndex(
                (item) => item.id === active.id
            );
            const newIndex = socialLinks.findIndex(
                (item) => item.id === over.id
            );
            if (oldIndex === -1 || newIndex === -1) return;
            onUpdateSocialLinks(arrayMove(socialLinks, oldIndex, newIndex));
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <BlockSelector
                isOpen={isBlockSelectorOpen}
                onClose={() => setIsBlockSelectorOpen(false)}
                onSelect={handleAddBlock}
            />

            {/* AI Coming Soon Dialog */}
            <Dialog
                isOpen={isAIDialogOpen}
                onClose={() => setIsAIDialogOpen(false)}
            >
                <DialogContent maxWidth="sm">
                    <DialogBody className="text-center py-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 mb-4">
                            <Sparkles size={32} className="text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                            Proximamente
                        </h3>
                        <p className="text-neutral-500 dark:text-neutral-400">
                            Estamos trabajando en esta funcionalidad. Muy pronto
                            podras usar IA para generar tus enlaces.
                        </p>
                        <button
                            onClick={() => setIsAIDialogOpen(false)}
                            className="mt-6 px-6 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-full font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
                        >
                            Entendido
                        </button>
                    </DialogBody>
                </DialogContent>
            </Dialog>

            {/* Sticky Section: LinkBar + Add Block / Add Social */}
            <div className="sticky top-0 md:top-20 z-30 bg-slate-50/95 dark:bg-neutral-950/95 backdrop-blur-xl -mx-4 px-4 md:-mx-8 md:px-8 lg:-mx-12 lg:px-12 py-4 space-y-4">
                {/* LinkBar - Public URL */}
                {landing && user && <LinkBar landing={landing} user={user} />}

                {/* Add Block / Add Social Button */}
                {currentLinkType === "blocks" ? (
                    <div className="bg-white dark:bg-neutral-900 rounded-[28px] md:rounded-[32px] p-2 border border-neutral-100 dark:border-neutral-800 shadow-soft-xl flex gap-2 md:gap-3">
                        <button
                            onClick={() => setIsBlockSelectorOpen(true)}
                            className="flex-1 bg-neutral-900 dark:bg-white hover:bg-black dark:hover:bg-neutral-200 text-white dark:text-neutral-900 py-3 md:py-4 rounded-[20px] md:rounded-[24px] font-bold text-base md:text-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2 md:gap-3 shadow-xl shadow-neutral-900/10 group"
                        >
                            <div className="bg-neutral-800 dark:bg-neutral-200 rounded-full p-1 group-hover:rotate-90 transition-transform">
                                <Plus size={18} />
                            </div>
                            <span>Agregar Bloque</span>
                        </button>
                        <button
                            onClick={() => setIsAIDialogOpen(true)}
                            className="px-4 md:px-8 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white rounded-[20px] md:rounded-[24px] font-bold transition-all hover:shadow-glow hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                        >
                            <Sparkles size={18} className="animate-pulse" />
                            <span className="hidden sm:inline">IA Magica</span>
                        </button>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-neutral-900 rounded-[28px] md:rounded-[32px] p-2 border border-neutral-100 dark:border-neutral-800 shadow-soft-xl">
                        <button
                            onClick={handleAddSocialLink}
                            className="w-full bg-gradient-to-r from-brand-500 to-pink-500 hover:from-brand-600 hover:to-pink-600 text-white py-3 md:py-4 rounded-[20px] md:rounded-[24px] font-bold text-base md:text-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2 md:gap-3 shadow-xl shadow-brand-500/20 group"
                        >
                            <div className="bg-white/20 rounded-full p-1 group-hover:rotate-90 transition-transform">
                                <Plus size={18} />
                            </div>
                            <span>Agregar Link Social</span>
                        </button>
                    </div>
                )}
            </div>

            {/* BLOQUES Content */}
            {currentLinkType === "blocks" && (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={links}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-4 md:space-y-5 pb-8 xl:pb-32 mt-6">
                            {links.map((link) => (
                                <LinkCard
                                    key={link.id}
                                    link={link}
                                    onUpdate={handleUpdateLink}
                                    onDelete={handleDeleteLink}
                                />
                            ))}
                            {links.length === 0 && (
                                <div className="text-center py-20 text-neutral-400">
                                    <p>
                                        No tenes enlaces aun. Hace clic en el
                                        boton de arriba para empezar.
                                    </p>
                                </div>
                            )}
                        </div>
                    </SortableContext>
                </DndContext>
            )}

            {/* SOCIAL LINKS Content */}
            {currentLinkType === "social" && (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={socialLinks}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-4 md:space-y-5 pb-8 xl:pb-32 mt-6">
                            {socialLinks.map((socialLink) => (
                                <SocialLinkCard
                                    key={socialLink.id}
                                    link={socialLink}
                                    onUpdate={handleUpdateSocialLink}
                                    onDelete={handleDeleteSocialLink}
                                />
                            ))}
                            {socialLinks.length === 0 && (
                                <div className="text-center py-20 text-neutral-400">
                                    <p>
                                        No tienes social links aún. ¡Agrega uno
                                        arriba!
                                    </p>
                                </div>
                            )}
                        </div>
                    </SortableContext>
                </DndContext>
            )}
        </div>
    );
};
