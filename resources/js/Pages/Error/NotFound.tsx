/**
 * 404 - Not Found Page
 *
 * Renders different layouts based on authentication state:
 * - Authenticated: PanelLayout with panel-style UI
 * - Guest: WebLayout with website-style UI
 */

import { Logo } from "@/Components/Shared/Logo";
import { LostIllustration } from "@/Components/Shared/LostIllustration";
import { PhonePreview } from "@/Components/Shared/PhonePreview";
import { FeaturedLanding } from "@/Components/Web/Home/HeroSection";
import { Head, Link, usePage } from "@inertiajs/react";
import {
    ArrowRight,
    Compass,
    Home,
    LayoutDashboard,
    LogIn,
    Plus,
    Search,
} from "lucide-react";

// Minimal fallback for edge case when backend fails (uses default sunset theme)
// NOTE: In normal operation, data comes from backend via bootstrap/app.php
const fallbackLandings: FeaturedLanding[] = [
    {
        id: "fallback-1",
        user: {
            name: "Linkea Demo",
            handle: "demo",
            avatar: "/images/logos/logo-icon.webp",
            title: "Linkea Demo",
            subtitle: "Tu bio link personalizado",
            theme: "sunset",
            customDesign: {
                backgroundColor: "#fed7aa",
                buttonStyle: "soft",
                buttonShape: "pill",
                buttonColor: "#ea580c",
                buttonTextColor: "#ffffff",
                fontPair: "modern",
                roundedAvatar: true,
            },
        },
        links: [
            {
                id: "1",
                title: "Crear mi Linkea",
                url: "/auth/register",
                isEnabled: true,
                clicks: 0,
                type: "link",
                sparklineData: [],
            },
            {
                id: "2",
                title: "Ver ejemplos",
                url: "/galeria",
                isEnabled: true,
                clicks: 0,
                type: "link",
                sparklineData: [],
            },
        ],
    },
];

interface NotFoundProps {
    featuredLandings?: FeaturedLanding[];
}

export default function NotFound({ featuredLandings }: NotFoundProps) {
    const { auth } = usePage().props as { auth?: { user?: any } };
    const isAuthenticated = !!auth?.user;

    // Use backend landings if available, otherwise use fallback (same pattern as HeroSection)
    const landings =
        featuredLandings && featuredLandings.length > 0
            ? featuredLandings
            : fallbackLandings;

    if (isAuthenticated) {
        return <AuthenticatedNotFound user={auth.user} landings={landings} />;
    }

    return <GuestNotFound landings={landings} />;
}

// --- Mini Landing Preview Component ---

function MiniLandingPreview({
    landing,
    compact = false,
}: {
    landing: FeaturedLanding;
    compact?: boolean;
}) {
    // Guard clause: skip render if landing data is incomplete
    if (!landing?.user?.handle) {
        return null;
    }

    const handle = landing.user.handle.replace("@", "");

    // Two-stage scaling for better quality:
    // 1. Render PhonePreview at 50% (190x390) - good quality intermediate size
    // 2. Scale container to final size
    const internalScale = 0.5;
    const intermediateWidth = 380 * internalScale; // 190
    const intermediateHeight = 780 * internalScale; // 390

    // Final container size
    const finalWidth = compact ? 84 : 100;
    const finalHeight = compact ? 172 : 205;

    // Container scale to go from intermediate to final
    const containerScale = finalWidth / intermediateWidth;

    return (
        <a
            href={`/${handle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center"
        >
            {/* Outer container with final dimensions */}
            <div
                className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                style={{ width: finalWidth, height: finalHeight }}
            >
                {/* Scale down from intermediate size to final size */}
                <div
                    style={{
                        transform: `scale(${containerScale})`,
                        transformOrigin: "top left",
                        width: intermediateWidth,
                        height: intermediateHeight,
                    }}
                >
                    {/* PhonePreview at intermediate scale - disable internal links */}
                    <div
                        className="pointer-events-none"
                        style={{
                            transform: `scale(${internalScale})`,
                            transformOrigin: "top left",
                            width: 380,
                            height: 780,
                        }}
                    >
                        <PhonePreview
                            user={landing.user}
                            links={landing.links}
                            device="mobile"
                            scale={1}
                            isPreview={true}
                        />
                    </div>
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-brand-500/0 group-hover:bg-brand-500/10 transition-colors duration-300 rounded-2xl" />
            </div>
            {/* Label */}
            <div className="mt-2 text-center">
                <p
                    className={`font-semibold text-gray-900 dark:text-white truncate ${
                        compact ? "text-xs" : "text-sm"
                    }`}
                >
                    {landing.user.name}
                </p>
                <p
                    className={`text-gray-400 dark:text-neutral-500 truncate ${
                        compact ? "text-[10px]" : "text-xs"
                    }`}
                >
                    @{handle}
                </p>
            </div>
        </a>
    );
}

// --- Guest (Web Layout Style) ---

function GuestNotFound({ landings }: { landings: FeaturedLanding[] }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50 flex flex-col">
            <Head title="Pagina no encontrada" />

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
                <div className="container mx-auto px-4 h-14 flex justify-between items-center">
                    <Link href="/" className="flex items-center">
                        <div className="hidden sm:block">
                            <Logo variant="full" size="sm" />
                        </div>
                        <div className="sm:hidden">
                            <Logo variant="icon" size="md" />
                        </div>
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/auth/register"
                            className="px-4 py-2 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-lg transition-colors"
                        >
                            Registrarse
                        </Link>
                        <Link
                            href="/auth/login"
                            className="text-sm text-gray-600 hover:text-brand-500 transition-colors"
                        >
                            Iniciar sesion
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 pt-14">
                <div className="container mx-auto px-4 py-16 md:py-24">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Illustration */}
                        <div className="mb-8 flex justify-center">
                            <LostIllustration className="w-48 h-48 md:w-64 md:h-64" />
                        </div>

                        {/* Error Message */}
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            <span className="text-brand-500">Oops!</span> Pagina
                            no encontrada
                        </h1>
                        <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto">
                            Parece que te perdiste. No te preocupes, te ayudamos
                            a encontrar el camino.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                            <Link
                                href="/auth/register"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                            >
                                <Plus size={20} />
                                Crear mi Linkea
                                <ArrowRight size={18} />
                            </Link>
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-semibold border border-gray-200 transition-all"
                            >
                                <Home size={18} />
                                Ir al inicio
                            </Link>
                        </div>

                        {/* Quick Links */}
                        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 mb-16">
                            <Link
                                href="/auth/login"
                                className="flex items-center gap-1.5 hover:text-brand-500 transition-colors"
                            >
                                <LogIn size={14} />
                                Iniciar sesion
                            </Link>
                            <span className="text-gray-300">|</span>
                            <Link
                                href="/"
                                className="flex items-center gap-1.5 hover:text-brand-500 transition-colors"
                            >
                                <Compass size={14} />
                                Explorar Linkeas
                            </Link>
                        </div>
                    </div>

                    {/* Featured Landings with PhonePreview */}
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-2">
                                Descubri algunos Linkeas
                            </h2>
                            <p className="text-gray-500">
                                Inspirarate con lo que otros estan creando
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-6">
                            {landings.slice(0, 5).map((landing) => (
                                <MiniLandingPreview
                                    key={landing.id}
                                    landing={landing}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-100 py-6">
                <div className="container mx-auto px-4 text-center text-sm text-gray-500">
                    <p>Error 404 - La pagina que buscas no existe</p>
                </div>
            </footer>
        </div>
    );
}

// --- Authenticated (Panel Layout Style) ---

function AuthenticatedNotFound({
    user,
    landings,
}: {
    user: any;
    landings: FeaturedLanding[];
}) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 flex flex-col">
            <Head title="Pagina no encontrada" />

            {/* Simple Header */}
            <header className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                <div className="container mx-auto px-4 h-14 flex justify-between items-center">
                    <Link href="/panel" className="flex items-center gap-3">
                        <Logo variant="full" size="sm" />
                    </Link>
                    <Link
                        href="/panel"
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-lg transition-colors"
                    >
                        <LayoutDashboard size={16} />
                        Ir a mi Panel
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center p-4">
                <div className="max-w-2xl w-full">
                    <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-8 md:p-12 text-center">
                        {/* Illustration */}
                        <div className="mb-6 flex justify-center">
                            <LostIllustration className="w-32 h-32 md:w-40 md:h-40 text-brand-500" />
                        </div>

                        {/* Error Message */}
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                            Pagina no encontrada
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-8">
                            Hola{" "}
                            <span className="font-semibold text-brand-500">
                                {user.name}
                            </span>
                            , la pagina que buscas no existe o fue movida.
                        </p>

                        {/* Primary CTA */}
                        <Link
                            href="/panel"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all mb-6"
                        >
                            <LayoutDashboard size={18} />
                            Volver a mi Panel
                            <ArrowRight size={18} />
                        </Link>

                        {/* Secondary Actions */}
                        <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                            <Link
                                href="/panel/links"
                                className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
                            >
                                <Plus size={14} />
                                Agregar enlaces
                            </Link>
                            <span className="text-gray-300 dark:text-neutral-700">
                                |
                            </span>
                            <Link
                                href="/"
                                className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
                            >
                                <Search size={14} />
                                Explorar Linkeas
                            </Link>
                        </div>
                    </div>

                    {/* Featured Landings - Smaller for authenticated */}
                    <div className="mt-8">
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4 text-center">
                            Otros Linkeas que podrian inspirarte
                        </h3>
                        <div className="flex flex-wrap justify-center gap-4">
                            {landings.slice(0, 5).map((landing) => (
                                <MiniLandingPreview
                                    key={landing.id}
                                    landing={landing}
                                    compact
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-4 text-center text-xs text-gray-400 dark:text-neutral-600">
                Error 404
            </footer>
        </div>
    );
}
