/**
 * AITab - Main AI assistant interface
 *
 * Layout:
 * - Desktop/Tablet (md+): Chat + Preview side by side (50/50)
 * - Mobile (<md): Chat only + Preview button opens drawer
 *
 * Chat has fixed height with internal scroll
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
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header with Save/Discard buttons */}
            <div className="sticky top-0 md:top-20 z-30 bg-slate-50/95 dark:bg-neutral-950/95 backdrop-blur-xl -mx-4 px-4 md:-mx-8 md:px-8 lg:-mx-12 lg:px-12 py-4">
                <div className="bg-gradient-to-r from-brand-500 to-pink-500 rounded-[28px] md:rounded-[32px] p-1">
                    <div className="bg-white dark:bg-neutral-900 rounded-[24px] md:rounded-[28px] p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-pink-500 flex items-center justify-center">
                                <Sparkles size={20} className="text-white" />
                            </div>
                            <div>
                                <h2 className="font-bold text-neutral-900 dark:text-white">
                                    Asistente IA
                                </h2>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                    Listo para ayudarte a crear tu landing
                                </p>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2">
                            {/* Mobile Preview button - only visible below md */}
                            <button
                                onClick={() => setIsPreviewOpen(true)}
                                className="md:hidden flex items-center gap-2 px-3 py-2.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-xl font-medium text-sm hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                            >
                                <Eye size={16} />
                                <span>Preview</span>
                            </button>

                            {messages.length > 0 && (
                                <button
                                    onClick={clearChat}
                                    className="p-2.5 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors"
                                    title="Limpiar chat"
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}

                            {hasUnsavedChanges && (
                                <>
                                    <button
                                        onClick={discardChanges}
                                        className="flex items-center gap-2 px-4 py-2.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-xl font-medium text-sm hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                                    >
                                        <RotateCcw size={16} />
                                        <span className="hidden sm:inline">
                                            Deshacer
                                        </span>
                                    </button>
                                    <button
                                        onClick={applyChanges}
                                        className="flex items-center gap-2 px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold text-sm transition-colors shadow-lg shadow-brand-500/20"
                                    >
                                        <Check size={16} />
                                        <span className="hidden sm:inline">
                                            Guardar cambios
                                        </span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Unsaved changes indicator */}
                {hasUnsavedChanges && (
                    <div className="mt-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-center">
                        <p className="text-sm text-amber-700 dark:text-amber-300">
                            Tenes cambios sin guardar. Hace clic en "Guardar
                            cambios" para aplicarlos.
                        </p>
                    </div>
                )}
            </div>

            {/* Main content area - Fixed height container */}
            <div className="mt-6 pb-8">
                <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-280px)] min-h-[500px]">
                    {/* Chat area - Fixed height with internal scroll */}
                    <div className="flex-1 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-soft-xl overflow-hidden flex flex-col h-full">
                        <AIChat />
                    </div>

                    {/* Preview - Only visible on md+ screens */}
                    <div className="hidden md:flex flex-col items-center bg-neutral-100 dark:bg-neutral-800/50 rounded-3xl p-4 lg:p-6 w-full md:w-[300px] lg:w-[340px] shrink-0 h-full">
                        <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-3">
                            Preview IA
                        </span>
                        <div className="flex-1 flex items-center justify-center overflow-hidden">
                            <PhonePreview
                                user={previewUser}
                                links={previewLinks}
                                socialLinks={socialLinks}
                                device="mobile"
                                scale={0.55}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Preview Drawer - Only for mobile (<md) */}
            <Dialog
                open={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                className="relative z-50 md:hidden"
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
                        <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-pink-500 flex items-center justify-center">
                                    <Eye size={16} className="text-white" />
                                </div>
                                <span className="font-bold text-neutral-900 dark:text-white">
                                    Preview en vivo
                                </span>
                            </div>
                            <button
                                onClick={() => setIsPreviewOpen(false)}
                                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors"
                            >
                                <X size={20} className="text-neutral-500" />
                            </button>
                        </div>

                        {/* Preview content */}
                        <div className="p-4 overflow-y-auto max-h-[calc(85vh-60px)] flex justify-center">
                            <div className="w-full max-w-[280px]">
                                <PhonePreview
                                    user={previewUser}
                                    links={previewLinks}
                                    socialLinks={socialLinks}
                                    device="mobile"
                                    scale={0.6}
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
