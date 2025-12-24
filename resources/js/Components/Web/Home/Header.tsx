import { Link, router, usePage } from "@inertiajs/react";
import { ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function Header() {
    const { auth } = usePage().props as any;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        router.post(route("logout") as string);
    };

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
                <div className="container mx-auto px-4 h-14 flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <img 
                            src="/assets/images/logo.svg" 
                            alt="Linkea" 
                            className="h-7"
                        />
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-2">
                        {auth?.user ? (
                            <div className="relative" ref={userMenuRef}>
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className="w-7 h-7 rounded-full bg-brand-500 text-white flex items-center justify-center font-semibold text-xs">
                                        {auth.user.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">
                                        {auth.user.name}
                                    </span>
                                    <ChevronDown size={14} className={`text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                                </button>
                                
                                {userMenuOpen && (
                                    <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1">
                                        <Link href="/panel" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                            Panel
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                        >
                                            Cerrar sesion
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link href={route("login") as string} className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900">
                                    Iniciar sesion
                                </Link>
                                <Link
                                    href={route("register") as string}
                                    className="px-4 py-1.5 bg-brand-500 hover:bg-brand-600 text-white text-sm rounded-full font-medium transition-colors"
                                >
                                    Registrarse
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-1.5 text-gray-600"
                    >
                        {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </header>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-40 md:hidden">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setMobileMenuOpen(false)} />
                    <div className="absolute top-14 right-0 w-56 bg-white shadow-xl rounded-bl-xl">
                        <div className="p-3">
                            {auth?.user ? (
                                <>
                                    <div className="flex items-center gap-2 p-2 mb-2">
                                        <div className="w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center font-semibold text-sm">
                                            {auth.user.name?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <span className="text-sm font-medium text-gray-800 truncate">{auth.user.name}</span>
                                    </div>
                                    <Link href="/panel" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                                        Panel
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                                    >
                                        Cerrar sesion
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link href={route("login") as string} className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                                        Iniciar sesion
                                    </Link>
                                    <Link href={route("register") as string} className="block px-3 py-2 text-sm text-brand-500 font-medium hover:bg-brand-50 rounded">
                                        Registrarse
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
