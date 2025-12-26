import { UserAvatar } from "@/Components/Shared/UserAvatar";
import { Link, router, usePage } from "@inertiajs/react";
import {
    ChevronDown,
    LayoutDashboard,
    LogOut,
    Shield,
    User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function Header() {
    const { auth } = usePage().props as any;
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    const isAdmin = auth?.user?.role_name === "root";

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(event.target as Node)
            ) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        router.post(route("logout") as string);
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
            <div className="container mx-auto px-4 h-14 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="flex items-center flex-shrink-0">
                    <img
                        src="/assets/images/logo.svg"
                        alt="Linkea"
                        className="h-7 hidden sm:block"
                    />
                    <img
                        src="/assets/images/logo_only.svg"
                        alt="Linkea"
                        className="h-8 sm:hidden"
                    />
                </Link>

                {/* Nav - Always visible, responsive sizing */}
                <nav className="flex items-center">
                    {auth?.user ? (
                        // Logged in user - Avatar with dropdown
                        <div className="relative" ref={userMenuRef}>
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <UserAvatar
                                    avatar={auth.user.avatar}
                                    name={auth.user.name}
                                    size="sm"
                                    variant={isAdmin ? "admin" : "panel"}
                                />
                                <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[100px] truncate">
                                    {auth.user.name}
                                </span>
                                <ChevronDown
                                    size={14}
                                    className={`text-gray-400 transition-transform ${
                                        userMenuOpen ? "rotate-180" : ""
                                    }`}
                                />
                            </button>

                            {userMenuOpen && (
                                <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                                    {/* Panel */}
                                    <Link
                                        href="/panel"
                                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        <LayoutDashboard
                                            size={16}
                                            className="text-gray-400"
                                        />
                                        Panel
                                    </Link>

                                    {/* Admin (solo para root) */}
                                    {isAdmin && (
                                        <Link
                                            href="/admin"
                                            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        >
                                            <Shield
                                                size={16}
                                                className="text-red-500"
                                            />
                                            Admin
                                        </Link>
                                    )}

                                    {/* Perfil */}
                                    <Link
                                        href="/panel/profile"
                                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        <User
                                            size={16}
                                            className="text-gray-400"
                                        />
                                        Perfil
                                    </Link>

                                    {/* Separator */}
                                    <div className="my-1 border-t border-gray-100" />

                                    {/* Logout */}
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        <LogOut size={16} />
                                        Cerrar sesion
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Guest - CTA always visible
                        <div className="flex items-center gap-2 sm:gap-3">
                            <Link
                                href={route("register") as string}
                                className="group relative px-3 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-brand-500/25"
                            >
                                {/* Gradient background */}
                                <span className="absolute inset-0 bg-gradient-to-r from-[#FE6A16] via-[#fe5f52] to-[#ff0f62] bg-300% animate-gradient" />
                                <span className="relative uppercase tracking-wide whitespace-nowrap">
                                    Registrarse gratis
                                </span>
                            </Link>
                            <span className="text-xs sm:text-sm text-gray-400">
                                o
                            </span>
                            <Link
                                href={route("login") as string}
                                className="text-xs sm:text-sm text-gray-600 hover:text-brand-500 underline underline-offset-2 transition-colors whitespace-nowrap"
                            >
                                Iniciar sesion
                            </Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}
