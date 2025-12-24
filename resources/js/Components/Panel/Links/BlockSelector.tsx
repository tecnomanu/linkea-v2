import {
    Dialog,
    DialogBody,
    DialogCloseButton,
    DialogContent,
    DialogHeader,
} from "@/Components/ui/Dialog";
import { BlockType } from "@/types";
import { Calendar, Ghost, Headphones, Link, Mail, MapPin, MessageCircle, Music, Search, Type, Video } from "lucide-react";
import React, { useMemo, useState } from "react";

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
        label: "Enlace",
        desc: "Link a cualquier URL",
        icon: <Link size={24} />,
        colorClass: "bg-orange-500 text-white",
        badgeBg:
            "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    },
    // Header (new name, replaces 'heading')
    header: {
        label: "Cabecera",
        desc: "Texto separador de seccion",
        icon: <Type size={24} />,
        colorClass: "bg-neutral-800 text-white dark:bg-neutral-700",
        badgeBg:
            "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
    },
    // WhatsApp
    whatsapp: {
        label: "WhatsApp",
        desc: "Iniciar una conversacion",
        icon: <MessageCircle size={24} />,
        colorClass: "bg-green-500 text-white",
        badgeBg:
            "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    },
    // YouTube
    youtube: {
        label: "Video YouTube",
        desc: "Insertar un video",
        icon: <Video size={24} />,
        colorClass: "bg-red-600 text-white",
        badgeBg: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    },
    // Spotify
    spotify: {
        label: "Spotify",
        desc: "Insertar cancion o album",
        icon: <Music size={24} />,
        colorClass: "bg-emerald-500 text-white",
        badgeBg:
            "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    },
    // Mastodon
    mastodon: {
        label: "Mastodon",
        desc: "Verificar tu perfil",
        icon: <Ghost size={24} />,
        colorClass: "bg-indigo-600 text-white",
        badgeBg:
            "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    },
    // Calendar/Booking (Calendly, Cal.com, Acuity)
    calendar: {
        label: "Calendario",
        desc: "Agendar citas y reuniones",
        icon: <Calendar size={24} />,
        colorClass: "bg-blue-600 text-white",
        badgeBg:
            "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    },
    // Email
    email: {
        label: "Email",
        desc: "Recibir mensajes por correo",
        icon: <Mail size={24} />,
        colorClass: "bg-sky-500 text-white",
        badgeBg: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
    },
    // Map
    map: {
        label: "Mapa",
        desc: "Mostrar tu ubicacion",
        icon: <MapPin size={24} />,
        colorClass: "bg-rose-500 text-white",
        badgeBg: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
    },
    // Vimeo
    vimeo: {
        label: "Vimeo",
        desc: "Insertar video de Vimeo",
        icon: <Video size={24} />,
        colorClass: "bg-cyan-600 text-white",
        badgeBg: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
    },
    // TikTok
    tiktok: {
        label: "TikTok",
        desc: "Insertar video de TikTok",
        icon: <Video size={24} />,
        colorClass: "bg-black text-white",
        badgeBg: "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
    },
    // SoundCloud
    soundcloud: {
        label: "SoundCloud",
        desc: "Insertar audio de SoundCloud",
        icon: <Headphones size={24} />,
        colorClass: "bg-orange-500 text-white",
        badgeBg: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    },
    // Twitch
    twitch: {
        label: "Twitch",
        desc: "Mostrar canal en vivo",
        icon: <Video size={24} />,
        colorClass: "bg-purple-600 text-white",
        badgeBg: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    },
    // Social (for social icons, hidden from selector)
    social: {
        label: "Icono Social",
        desc: "Enlace a red social",
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
    const [searchQuery, setSearchQuery] = useState("");

    // Filter blocks based on search query
    const filteredBlocks = useMemo(() => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) {
            return Object.keys(BLOCK_CONFIG) as BlockType[];
        }
        return (Object.keys(BLOCK_CONFIG) as BlockType[]).filter((type) => {
            const block = BLOCK_CONFIG[type];
            return (
                block.label.toLowerCase().includes(query) ||
                block.desc.toLowerCase().includes(query) ||
                type.toLowerCase().includes(query)
            );
        });
    }, [searchQuery]);

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
                    <DialogCloseButton onClick={handleClose} variant="minimal" />
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
                    {filteredBlocks.filter((type) => !BLOCK_CONFIG[type]?.hidden).length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-neutral-500 dark:text-neutral-400">
                                No se encontraron bloques para "{searchQuery}"
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {filteredBlocks
                                .filter((type) => !BLOCK_CONFIG[type]?.hidden)
                                .map((type) => {
                                    const block = BLOCK_CONFIG[type];
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
                    )}
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
};
