/**
 * BlockedLanding - Shows when a landing has been blocked by admin
 *
 * This page displays a clear message that the landing is not available,
 * without revealing that it was specifically "blocked" (for user privacy).
 */

import { Link } from "@inertiajs/react";
import { AlertCircle, Home, Search } from "lucide-react";

interface BlockedLandingProps {
    handle?: string;
}

export default function BlockedLanding({ handle }: BlockedLandingProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-md w-full text-center">
                {/* Icon */}
                <div className="mb-8 flex justify-center">
                    <div className="w-24 h-24 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center animate-pulse">
                        <AlertCircle className="w-12 h-12 text-red-400" />
                    </div>
                </div>

                {/* Main message */}
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                    Página no disponible
                </h1>

                <p className="text-slate-400 text-lg mb-2">
                    Este Linkea no se encuentra disponible en este momento.
                </p>

                {handle && (
                    <p className="text-slate-500 text-sm mb-8 font-mono">
                        /{handle}
                    </p>
                )}

                {/* Detailed info */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-slate-700/50">
                    <p className="text-slate-300 text-sm">
                        Esta página ha sido deshabilitada temporalmente. Si
                        crees que esto es un error, contacta al administrador.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-100 text-slate-900 rounded-xl font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg"
                    >
                        <Home size={18} />
                        Ir al inicio
                    </Link>

                    <Link
                        href="/gallery"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold transition-all hover:-translate-y-0.5"
                    >
                        <Search size={18} />
                        Explorar galería
                    </Link>
                </div>

                {/* Branding */}
                <div className="mt-12">
                    <Link href="/" className="inline-flex items-center gap-2">
                        <img
                            src="/images/logos/logo-icon.webp"
                            alt="Linkea"
                            className="w-8 h-8"
                        />
                        <span className="text-slate-400 font-semibold">
                            Linkea
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
