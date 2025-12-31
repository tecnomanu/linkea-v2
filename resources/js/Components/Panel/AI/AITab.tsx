/**
 * AITab - Main AI assistant interface
 *
 * Layout:
 * - Desktop xl+: Chat only (sidebar preview from Dashboard)
 * - Tablet md-xl: Chat + inline Preview side by side
 * - Mobile (<md): Chat only + Preview button opens drawer
 *
 * Full height layout, only messages scroll
 */

import { SocialLink } from "@/Components/Panel/Links/LinksTab";
import { PhonePreview } from "@/Components/Shared/PhonePreview";
import { AIProvider, useAI } from "@/contexts/AIContext";
import { LinkBlock, UserProfile } from "@/types";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Check, Eye, RotateCcw, Sparkles, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { AIChat } from "./AIChat";

interface AITabInnerProps {
    user: UserProfile;
    socialLinks: SocialLink[];
    onPreviewChange?: (
        links: LinkBlock[],
        design: Partial<UserProfile["customDesign"]> | null
    ) => void;
}

function AITabInner({ user, socialLinks, onPreviewChange }: AITabInnerProps) {
    const {
        previewLinks,
        previewDesign,
        hasUnsavedChanges,
        applyChanges,
        discardChanges,
        clearChat,
        messages,
    } = useAI();

    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    // Notify parent of preview changes for sidebar
    useEffect(() => {
        onPreviewChange?.(previewLinks, previewDesign);
    }, [previewLinks, previewDesign, onPreviewChange]);

    // Merge preview design with user's design for preview
    const previewUser: UserProfile = previewDesign
        ? {
              ...user,
              customDesign: {
                  ...user.customDesign,
                  ...previewDesign,
              },
          }
        : user;

    return (
        <div className="flex flex-col h-[calc(100vh-120px)] md:h-[calc(100vh-80px)] animate-in fade-in duration-300">
            {/* Compact Header with Save/Discard buttons */}
            <div className="shrink-0 mb-3">
                <div className="bg-gradient-to-r from-brand-500 to-pink-500 rounded-2xl p-0.5">
                    <div className="bg-white dark:bg-neutral-900 rounded-[14px] px-3 py-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-pink-500 flex items-center justify-center">
                                <Sparkles size={16} className="text-white" />
                            </div>
                            <div>
                                <h2 className="font-bold text-sm text-neutral-900 dark:text-white">
                                    Asistente IA
                                </h2>
                                <p className="text-[10px] text-neutral-500 dark:text-neutral-400 hidden sm:block">
                                    Listo para ayudarte
                                </p>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1.5">
                            {/* Mobile/Tablet Preview button - visible below xl */}
                            <button
                                onClick={() => setIsPreviewOpen(true)}
                                className="xl:hidden flex items-center gap-1.5 px-2.5 py-1.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg font-medium text-xs hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                            >
                                <Eye size={14} />
                                <span className="hidden sm:inline">Preview</span>
                            </button>

                            {messages.length > 0 && (
                                <button
                                    onClick={clearChat}
                                    className="p-1.5 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                                    title="Limpiar chat"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}

                            {hasUnsavedChanges && (
                                <>
                                    <button
                                        onClick={discardChanges}
                                        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg font-medium text-xs hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                                    >
                                        <RotateCcw size={14} />
                                        <span className="hidden sm:inline">
                                            Deshacer
                                        </span>
                                    </button>
                                    <button
                                        onClick={applyChanges}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-bold text-xs transition-colors shadow-lg shadow-brand-500/20"
                                    >
                                        <Check size={14} />
                                        <span className="hidden sm:inline">
                                            Guardar
                                        </span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Unsaved changes indicator - compact */}
                {hasUnsavedChanges && (
                    <div className="mt-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-center">
                        <p className="text-xs text-amber-700 dark:text-amber-300">
                            Cambios sin guardar
                        </p>
                    </div>
                )}
            </div>

            {/* Main content area - Full height, flex grow */}
            <div className="flex-1 flex gap-4 min-h-0">
                {/* Chat area - Full height with internal scroll */}
                <div className="flex-1 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-soft-xl overflow-hidden flex flex-col">
                    <AIChat />
                </div>

                {/* Inline Preview - Only visible on md-xl (xl+ uses sidebar) */}
                <div className="hidden md:flex xl:hidden flex-col items-center bg-neutral-100 dark:bg-neutral-800/50 rounded-2xl p-3 w-[280px] lg:w-[300px] shrink-0">
                    <span className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase mb-2">
                        Preview IA
                    </span>
                    <div className="flex-1 flex items-center justify-center overflow-hidden">
                        <PhonePreview
                            user={previewUser}
                            links={previewLinks}
                            socialLinks={socialLinks}
                            device="mobile"
                            scale={0.5}
                        />
                    </div>
                </div>
            </div>

            {/* Mobile Preview Drawer - Only for mobile (<md) */}
            <Dialog
                open={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                className="relative z-50 xl:hidden"
            >
                {/* Backdrop */}
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                    aria-hidden="true"
                />

                {/* Drawer */}
                <div className="fixed inset-0 flex items-end justify-center">
                    <DialogPanel className="w-full max-h-[85vh] bg-white dark:bg-neutral-900 rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300 overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between p-3 border-b border-neutral-200 dark:border-neutral-800">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-pink-500 flex items-center justify-center">
                                    <Eye size={14} className="text-white" />
                                </div>
                                <span className="font-bold text-sm text-neutral-900 dark:text-white">
                                    Preview en vivo
                                </span>
                            </div>
                            <button
                                onClick={() => setIsPreviewOpen(false)}
                                className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                            >
                                <X size={18} className="text-neutral-500" />
                            </button>
                        </div>

                        {/* Preview content */}
                        <div className="p-4 overflow-y-auto max-h-[calc(85vh-50px)] flex justify-center">
                            <div className="w-full max-w-[260px]">
                                <PhonePreview
                                    user={previewUser}
                                    links={previewLinks}
                                    socialLinks={socialLinks}
                                    device="mobile"
                                    scale={0.55}
                                />
                            </div>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </div>
    );
}

interface AITabProps {
    links: LinkBlock[];
    socialLinks: SocialLink[];
    user: UserProfile;
    onUpdateLinks: (links: LinkBlock[]) => void;
    onUpdateUser: (updates: Partial<UserProfile>) => void;
    onPreviewChange?: (
        links: LinkBlock[],
        design: Partial<UserProfile["customDesign"]> | null
    ) => void;
}

/**
 * AITab wrapper that provides the AI context
 */
export function AITab({
    links,
    socialLinks,
    user,
    onUpdateLinks,
    onUpdateUser,
    onPreviewChange,
}: AITabProps) {
    const handleApplyLinks = (newLinks: LinkBlock[]) => {
        onUpdateLinks(newLinks);
    };

    const handleApplyDesign = (
        design: Partial<UserProfile["customDesign"]>
    ) => {
        onUpdateUser({
            customDesign: {
                ...user.customDesign,
                ...design,
            },
        });
    };

    return (
        <AIProvider
            initialLinks={links}
            initialDesign={user.customDesign}
            onApplyLinks={handleApplyLinks}
            onApplyDesign={handleApplyDesign}
        >
            <AITabInner
                user={user}
                socialLinks={socialLinks}
                onPreviewChange={onPreviewChange}
            />
        </AIProvider>
    );
}
