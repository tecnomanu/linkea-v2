import { Link, router } from "@inertiajs/react";
import {
    ArrowLeft,
    ArrowRight,
    Rocket,
    Search,
    Sparkles,
    Users,
    X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { LandingCard, Pagination } from "../../Components/Web/Gallery";
import { FeaturedLanding } from "../../Components/Web/Home/HeroSection";
import WebLayout from "../../Layouts/WebLayout";

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

export default function Gallery({ landings, meta, filters }: GalleryProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || "");
    const [isSearching, setIsSearching] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const searchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

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
        <WebLayout>
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
                                    <span> para "{filters.search}"</span>
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
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
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
                        Crea tu Linkea gratis y uni tu perfil a nuestra
                        comunidad. Es rapido, facil y 100% gratuito.
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
