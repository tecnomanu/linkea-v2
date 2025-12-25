/**
 * BlockSelector - Dialog for selecting a block type to add
 *
 * Uses centralized configuration from @/config/blockConfig.ts
 */

import {
    Dialog,
    DialogBody,
    DialogCloseButton,
    DialogContent,
    DialogHeader,
} from "@/Components/ui/Dialog";
import { BLOCK_TYPES, getVisibleBlockTypes } from "@/config/blockConfig";
import { BlockType } from "@/types";
import { Search } from "lucide-react";
import React, { useMemo, useState } from "react";

interface BlockSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (type: BlockType) => void;
}

// Re-export BLOCK_CONFIG for backwards compatibility
// TODO: Update consumers to import from @/config/blockConfig directly
export const BLOCK_CONFIG = Object.fromEntries(
    Object.entries(BLOCK_TYPES).map(([key, config]) => [
        key,
        {
            label: config.label,
            desc: config.description,
            icon: <config.icon size={24} />,
            colorClass: config.colorClass,
            badgeBg: config.badgeClass,
            hidden: config.hidden,
        },
    ])
);

export const BlockSelector: React.FC<BlockSelectorProps> = ({
    isOpen,
    onClose,
    onSelect,
}) => {
    const [searchQuery, setSearchQuery] = useState("");

    // Get visible block types
    const visibleTypes = useMemo(() => getVisibleBlockTypes(), []);

    // Filter blocks based on search query
    const filteredBlocks = useMemo(() => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) {
            return visibleTypes;
        }
        return visibleTypes.filter((type) => {
            const config = BLOCK_TYPES[type];
            return (
                config.label.toLowerCase().includes(query) ||
                config.description.toLowerCase().includes(query) ||
                type.toLowerCase().includes(query)
            );
        });
    }, [searchQuery, visibleTypes]);

    // Reset search when dialog closes
    const handleClose = () => {
        setSearchQuery("");
        onClose();
    };

    return (
        <Dialog isOpen={isOpen} onClose={handleClose}>
            <DialogContent
                maxWidth="2xl"
                className="rounded-[32px] border border-neutral-100 dark:border-neutral-800"
            >
                {/* Header */}
                <DialogHeader className="flex justify-between items-center p-6 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
                    <div>
                        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                            Agregar Bloque
                        </h2>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Elige el tipo de contenido que queres agregar.
                        </p>
                    </div>
                    <DialogCloseButton
                        onClick={handleClose}
                        variant="minimal"
                    />
                </DialogHeader>

                {/* Search */}
                <div className="px-6 pt-4">
                    <div className="relative">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                        />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar bloques..."
                            className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                            autoFocus
                        />
                    </div>
                </div>

                {/* Grid */}
                <DialogBody className="p-6 max-h-[50vh] overflow-y-auto">
                    {filteredBlocks.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-neutral-500 dark:text-neutral-400">
                                No se encontraron bloques para "{searchQuery}"
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {filteredBlocks.map((type) => {
                                const config = BLOCK_TYPES[type];
                                const IconComponent = config.icon;
                                return (
                                    <button
                                        key={type}
                                        onClick={() => {
                                            onSelect(type);
                                            setSearchQuery("");
                                        }}
                                        className="group flex items-center gap-4 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800 hover:border-brand-200 dark:hover:border-brand-500/50 hover:bg-brand-50/30 dark:hover:bg-brand-900/10 hover:shadow-lg hover:shadow-brand-500/5 transition-all duration-300 text-left bg-white dark:bg-neutral-900"
                                    >
                                        <div
                                            className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 group-hover:rotate-3 ${config.colorClass}`}
                                        >
                                            <IconComponent size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-neutral-900 dark:text-white group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-colors">
                                                {config.label}
                                            </h3>
                                            <p className="text-xs text-neutral-400 font-medium">
                                                {config.description}
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
                    )}
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
};
