import {
    Dialog,
    DialogBody,
    DialogCloseButton,
    DialogContent,
    DialogHeader,
} from "@/Components/ui/Dialog";
import { BlockType } from "@/types";
import { Ghost, Link, MessageCircle, Music, Type, Video } from "lucide-react";
import React from "react";

interface BlockSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (type: BlockType) => void;
}

// Block type configuration - defines visual styles for each block type
// Includes both new system names and legacy aliases for imported data
export const BLOCK_CONFIG: Record<
    string,
    {
        label: string;
        desc: string;
        icon: React.ReactNode;
        colorClass: string;
        badgeBg: string;
        hidden?: boolean;
    }
> = {
    // Standard link (new name, replaces 'button')
    link: {
        label: "Button Link",
        desc: "Link to any URL",
        icon: <Link size={24} />,
        colorClass: "bg-orange-500 text-white",
        badgeBg:
            "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    },
    // Header (new name, replaces 'heading')
    header: {
        label: "Header",
        desc: "Section divider text",
        icon: <Type size={24} />,
        colorClass: "bg-neutral-800 text-white dark:bg-neutral-700",
        badgeBg:
            "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
    },
    // WhatsApp
    whatsapp: {
        label: "WhatsApp",
        desc: "Start a chat",
        icon: <MessageCircle size={24} />,
        colorClass: "bg-green-500 text-white",
        badgeBg:
            "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    },
    // YouTube
    youtube: {
        label: "YouTube Video",
        desc: "Embed a video",
        icon: <Video size={24} />,
        colorClass: "bg-red-600 text-white",
        badgeBg: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    },
    // Spotify
    spotify: {
        label: "Spotify",
        desc: "Embed a song/album",
        icon: <Music size={24} />,
        colorClass: "bg-emerald-500 text-white",
        badgeBg:
            "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    },
    // Mastodon
    mastodon: {
        label: "Mastodon",
        desc: "Verify your profile",
        icon: <Ghost size={24} />,
        colorClass: "bg-indigo-600 text-white",
        badgeBg:
            "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    },
    // Social (for social icons, hidden from selector)
    social: {
        label: "Social Icon",
        desc: "Social media link",
        icon: <Link size={24} />,
        colorClass: "bg-blue-500 text-white",
        badgeBg:
            "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        hidden: true, // Not shown in selector, used for social bar
    },
};

export const BlockSelector: React.FC<BlockSelectorProps> = ({
    isOpen,
    onClose,
    onSelect,
}) => {
    return (
        <Dialog isOpen={isOpen} onClose={onClose}>
            <DialogContent
                maxWidth="2xl"
                className="rounded-[32px] border border-neutral-100 dark:border-neutral-800"
            >
                {/* Header */}
                <DialogHeader className="flex justify-between items-center p-6 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
                    <div>
                        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                            Add a Block
                        </h2>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Choose the type of content you want to add.
                        </p>
                    </div>
                    <DialogCloseButton onClick={onClose} variant="minimal" />
                </DialogHeader>

                {/* Grid */}
                <DialogBody className="p-6 max-h-[60vh] overflow-y-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {(Object.keys(BLOCK_CONFIG) as BlockType[])
                            .filter((type) => !BLOCK_CONFIG[type]?.hidden)
                            .map((type) => {
                                const block = BLOCK_CONFIG[type];
                                return (
                                    <button
                                        key={type}
                                        onClick={() => onSelect(type)}
                                        className="group flex items-center gap-4 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800 hover:border-brand-200 dark:hover:border-brand-500/50 hover:bg-brand-50/30 dark:hover:bg-brand-900/10 hover:shadow-lg hover:shadow-brand-500/5 transition-all duration-300 text-left bg-white dark:bg-neutral-900"
                                    >
                                        <div
                                            className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 group-hover:rotate-3 ${block.colorClass}`}
                                        >
                                            {block.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-neutral-900 dark:text-white group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-colors">
                                                {block.label}
                                            </h3>
                                            <p className="text-xs text-neutral-400 font-medium">
                                                {block.desc}
                                            </p>
                                        </div>
                                        <div className="ml-auto opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-brand-400">
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 4v16m8-8H4"
                                                />
                                            </svg>
                                        </div>
                                    </button>
                                );
                            })}
                    </div>
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
};
