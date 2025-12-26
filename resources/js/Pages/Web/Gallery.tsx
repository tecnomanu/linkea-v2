import { Link, router } from "@inertiajs/react";
import {
    ArrowLeft,
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    Rocket,
    Search,
    Sparkles,
    Users,
    X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { FeaturedLanding } from "../../Components/Web/Home/HeroSection";
import WebLayout from "../../Layouts/WebLayout";
import { LinkBlock, UserProfile } from "../../types";

interface GalleryProps {
    landings: FeaturedLanding[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search: string | null;
    };
}

// Mini phone preview card for gallery grid
function LandingCard({ landing }: { landing: FeaturedLanding }) {
    const { user, links } = landing;
    const handle = user.handle;
    const visibleLinks = links.slice(0, 3);

    // Get background style
    const getBackgroundStyle = () => {
        const design = user.customDesign;
        const bgColor = design?.backgroundColor || "#f8fafc";

        // Check for background image
        if (design?.backgroundEnabled && design?.backgroundImage) {
            return {
                backgroundImage: design.backgroundImage,
                backgroundSize: design?.backgroundSize || "cover",
                backgroundPosition: design?.backgroundPosition || "center",
            };
        }

        return { backgroundColor: bgColor };
    };

    // Get button style based on design
    const getButtonClasses = () => {
        const design = user.customDesign;
        const shape = design?.buttonShape || "rounded";

        const shapeClasses = {
            sharp: "rounded-none",
            rounded: "rounded-lg",
            pill: "rounded-full",
        };

        return shapeClasses[shape] || "rounded-lg";
    };

    const getButtonStyle = () => {
        const design = user.customDesign;
        return {
            backgroundColor: design?.buttonColor || "#3b82f6",
            color: design?.buttonTextColor || "#ffffff",
        };
    };

    return (
        <Link
            href={`/${handle}`}
            className="group relative block"
            prefetch={false}
        >
            {/* Card container */}
            <div className="relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-brand-200 hover:-translate-y-2">
                {/* Mini phone mockup */}
                <div className="relative aspect-[9/16] max-h-[380px] overflow-hidden">
                    {/* Phone frame */}
                    <div
                        className="absolute inset-3 rounded-2xl overflow-hidden"
                        style={getBackgroundStyle()}
                    >
                        {/* Content */}
                        <div className="flex flex-col items-center pt-6 px-3">
                            {/* Avatar */}
                            <div
                                className={`w-16 h-16 bg-white shadow-md overflow-hidden ${
                                    user.customDesign?.roundedAvatar !== false
                                        ? "rounded-full"
                                        : "rounded-xl"
                                }`}
                            >
                                {user.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-2xl font-bold">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>

                            {/* Name */}
                            <h3 className="mt-3 text-sm font-bold text-center truncate w-full px-2">
                                {user.name}
                            </h3>

                            {/* Handle */}
                            <p className="text-xs text-gray-500 truncate">
                                @{handle}
                            </p>

                            {/* Bio snippet */}
                            {user.bio && (
                                <p className="mt-1 text-[10px] text-gray-600 text-center line-clamp-2 px-2">
                                    {user.bio}
                                </p>
                            )}

                            {/* Mini links preview */}
                            <div className="mt-4 w-full space-y-2 px-1">
                                {visibleLinks.map((link: LinkBlock) => (
                                    <div
                                        key={link.id}
                                        className={`w-full py-2 px-3 text-[10px] font-medium text-center truncate ${getButtonClasses()}`}
                                        style={getButtonStyle()}
                                    >
                                        {link.title}
                                    </div>
                                ))}
                                {links.length > 3 && (
                                    <div className="text-[9px] text-gray-400 text-center pt-1">
                                        +{links.length - 3} mas
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card footer */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent pt-8 pb-4 px-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-gray-700 truncate max-w-[120px]">
                                {user.name}
                            </span>
                            {user.isVerified && (
                                <span className="flex-shrink-0 w-4 h-4 bg-brand-500 rounded-full flex items-center justify-center">
                                    <svg
                                        className="w-2.5 h-2.5 text-white"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </span>
                            )}
                        </div>
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs text-brand-500 font-medium">
                            Ver
                            <ExternalLink size={12} />
                        </span>
                    </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-brand-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-3xl" />
            </div>
        </Link>
    );
}

// Pagination component
function Pagination({
    currentPage,
    lastPage,
    onPageChange,
}: {
    currentPage: number;
    lastPage: number;
    onPageChange: (page: number) => void;
}) {
    if (lastPage <= 1) return null;

    // Generate visible page numbers
    const getVisiblePages = () => {
        const pages: (number | string)[] = [];
        const delta = 2;

        for (let i = 1; i <= lastPage; i++) {
            if (
                i === 1 ||
                i === lastPage ||
                (i >= currentPage - delta && i <= currentPage + delta)
            ) {
                pages.push(i);
            } else if (pages[pages.length - 1] !== "...") {
                pages.push("...");
            }
        }

        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-2 mt-12">
            {/* Previous */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                <ChevronLeft size={16} />
                Anterior
            </button>

            {/* Page numbers */}
            <div className="hidden sm:flex items-center gap-1">
                {getVisiblePages().map((page, idx) =>
                    page === "..." ? (
                        <span
                            key={`ellipsis-${idx}`}
                            className="px-3 py-2 text-gray-400"
                        >
                            ...
                        </span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => onPageChange(page as number)}
                            className={`min-w-[40px] h-10 rounded-xl text-sm font-medium transition-all ${
                                currentPage === page
                                    ? "bg-brand-500 text-white shadow-lg shadow-brand-500/30"
                                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                            }`}
                        >
                            {page}
                        </button>
                    )
                )}
            </div>

            {/* Mobile page indicator */}
            <span className="sm:hidden text-sm text-gray-500">
                Pagina {currentPage} de {lastPage}
            </span>

            {/* Next */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === lastPage}
                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                Siguiente
                <ChevronRight size={16} />
            </button>
        </div>
    );
}

export default function Gallery({ landings, meta, filters }: GalleryProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || "");
    const [isSearching, setIsSearching] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const searchTimeoutRef = useRef<NodeJS.Timeout>();

    // Debounced search
    const performSearch = useCallback((query: string) => {
        setIsSearching(true);
        router.get(
            "/gallery",
            { search: query || undefined, page: 1 },
            {
                preserveState: true,
                preserveScroll: false,
                onFinish: () => setIsSearching(false),
            }
        );
    }, []);

    // Handle search input change with debounce
    const handleSearchChange = (value: string) => {
        setSearchQuery(value);

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            performSearch(value);
        }, 400);
    };

    // Clear search
    const clearSearch = () => {
        setSearchQuery("");
        performSearch("");
        searchInputRef.current?.focus();
    };

    // Handle pagination
    const handlePageChange = (page: number) => {
        router.get(
            "/gallery",
            { search: filters.search || undefined, page },
            {
                preserveState: true,
                preserveScroll: false,
            }
        );
    };

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    return (
        <WebLayout
            title="Galeria de Linkeas - Descubre perfiles inspiradores"
            description="Explora la galeria de Linkea y descubre perfiles creativos de la comunidad. Inspira tu propio diseño viendo los mejores ejemplos de link in bio."
            canonical="/gallery"
        >
            {/* Hero section */}
            <section className="relative pt-24 pb-12 overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-brand-50/30">
                    <div
                        className="absolute inset-0 opacity-[0.02]"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                    />
                    <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-400/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-orange-300/10 rounded-full blur-3xl" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    {/* Back link */}
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-500 text-sm font-medium mb-8 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Volver al inicio
                    </Link>

                    {/* Title */}
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-50 text-brand-600 rounded-full text-sm font-semibold mb-6">
                            <Sparkles size={14} />
                            <span>Comunidad Linkea</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900 tracking-tight">
                            Galeria de{" "}
                            <span className="text-brand-500">Linkeas</span>
                        </h1>

                        <p className="text-lg text-gray-600 mb-8">
                            Descubri perfiles increibles de nuestra comunidad.
                            Inspira tu propio diseño explorando los mejores
                            ejemplos.
                        </p>

                        {/* Search bar */}
                        <div className="relative max-w-xl mx-auto">
                            <div className="relative">
                                <Search
                                    size={20}
                                    className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                                        isSearching
                                            ? "text-brand-500"
                                            : "text-gray-400"
                                    }`}
                                />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        handleSearchChange(e.target.value)
                                    }
                                    placeholder="Buscar por nombre o usuario..."
                                    className="w-full pl-12 pr-12 py-4 rounded-2xl border border-gray-200 bg-white shadow-lg shadow-gray-200/50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={clearSearch}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                                    >
                                        <X size={18} />
                                    </button>
                                )}
                            </div>

                            {/* Search loading indicator */}
                            {isSearching && (
                                <div className="absolute -bottom-1 left-4 right-4 h-0.5 bg-gray-100 overflow-hidden rounded-full">
                                    <div className="h-full w-1/3 bg-brand-500 animate-[shimmer_1s_ease-in-out_infinite]" />
                                </div>
                            )}
                        </div>

                        {/* Results count */}
                        <div className="mt-6 flex items-center justify-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1.5">
                                <Users size={16} />
                                {meta.total.toLocaleString("es-AR")} perfiles
                                {filters.search && (
                                    <span>
                                        {" "}
                                        para "{filters.search}"
                                    </span>
                                )}
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Gallery grid */}
            <section className="pb-20">
                <div className="container mx-auto px-4">
                    {landings.length > 0 ? (
                        <>
                            {/* Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6">
                                {landings.map((landing) => (
                                    <LandingCard
                                        key={landing.id}
                                        landing={landing}
                                    />
                                ))}
                            </div>

                            {/* Pagination */}
                            <Pagination
                                currentPage={meta.current_page}
                                lastPage={meta.last_page}
                                onPageChange={handlePageChange}
                            />
                        </>
                    ) : (
                        /* Empty state */
                        <div className="text-center py-20">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                                <Search size={32} className="text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                No encontramos resultados
                            </h3>
                            <p className="text-gray-500 mb-6">
                                {filters.search
                                    ? `No hay perfiles que coincidan con "${filters.search}"`
                                    : "No hay perfiles disponibles en este momento"}
                            </p>
                            {filters.search && (
                                <button
                                    onClick={clearSearch}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-medium transition-colors"
                                >
                                    <X size={18} />
                                    Limpiar busqueda
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA section */}
            <section className="py-16 bg-gradient-to-r from-brand-500 to-brand-600">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                        Queres aparecer en la galeria?
                    </h2>
                    <p className="text-brand-100 mb-8 max-w-xl mx-auto">
                        Crea tu Linkea gratis y uni tu perfil a nuestra comunidad. Es rapido, facil y 100% gratuito.
                    </p>
                    <Link
                        href="/auth/register"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-brand-600 rounded-2xl text-lg font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                    >
                        <Rocket size={20} />
                        Crear mi Linkea
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </section>

            {/* CSS for shimmer animation */}
            <style>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(400%); }
                }
            `}</style>
        </WebLayout>
    );
}

