import { Logo } from "@/Components/Shared/Logo";
import { NavLink } from "@/Components/Shared/NavLink";
import { UserAvatar } from "@/Components/Shared/UserAvatar";
import { Button } from "@/Components/ui/Button";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { router } from "@inertiajs/react";
import {
    Bell,
    Building2,
    ChevronDown,
    ChevronUp,
    Gauge,
    Layers,
    LogOut,
    Mail,
    Menu as MenuIcon,
    Moon,
    Sun,
    Users,
    Wrench,
    X,
} from "lucide-react";
import React, { useState } from "react";

interface AdminMobileNavProps {
    activeTab: string;
    isDarkMode: boolean;
    toggleTheme: () => void;
    userAvatar?: string;
    userName?: string;
    userEmail?: string;
}

export const AdminMobileNav: React.FC<AdminMobileNavProps> = ({
    activeTab,
    isDarkMode,
    toggleTheme,
    userAvatar,
    userName,
    userEmail,
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isToolsOpen, setIsToolsOpen] = useState(false);

    const mainNavItems = [
        {
            id: "dashboard",
            icon: <Gauge size={20} />,
            label: "Dashboard",
            route: "admin.dashboard",
        },
        {
            id: "users",
            icon: <Users size={20} />,
            label: "Usuarios",
            route: "admin.users",
        },
        {
            id: "companies",
            icon: <Building2 size={20} />,
            label: "Empresas",
            route: "admin.companies",
        },
        {
            id: "landings",
            icon: <Layers size={20} />,
            label: "Landings",
            route: "admin.landings",
        },
    ];

    const toolsNavItems = [
        {
            id: "newsletters",
            icon: <Mail size={20} />,
            label: "Newsletters",
            route: "admin.newsletters",
        },
        {
            id: "notifications",
            icon: <Bell size={20} />,
            label: "Notificaciones",
            route: "admin.notifications",
        },
    ];

    const handleLogout = () => {
        router.post(route("logout") as string);
    };

    return (
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800 transition-colors duration-300 shadow-sm">
            {/* Top Bar */}
            <div className="flex justify-between items-center px-4 py-2">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <Logo variant="icon" size="sm" />
                    <span className="font-sans font-bold text-base text-neutral-900 dark:text-white tracking-tight">
                        Admin
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    {/* User Menu */}
                    <Menu as="div" className="relative">
                        <MenuButton className="flex items-center gap-2 p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                            <UserAvatar
                                avatar={userAvatar}
                                name={userName}
                                size="sm"
                                variant="admin"
                            />
                        </MenuButton>

                        <MenuItems
                            transition
                            anchor="bottom end"
                            className="z-50 mt-2 w-64 origin-top-right rounded-2xl bg-white dark:bg-neutral-900 shadow-xl border border-neutral-200 dark:border-neutral-700 p-2 transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
                        >
                            {/* User Info */}
                            <div className="px-3 py-3 border-b border-neutral-100 dark:border-neutral-800 mb-2">
                                <div className="flex items-center gap-3">
                                    <UserAvatar
                                        avatar={userAvatar}
                                        name={userName}
                                        size="md"
                                        variant="admin"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm text-neutral-900 dark:text-white truncate">
                                            {userName || "Admin"}
                                        </p>
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                                            {userEmail || ""}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Theme Toggle */}
                            <MenuItem>
                                <button
                                    onClick={toggleTheme}
                                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                                >
                                    {isDarkMode ? (
                                        <Sun size={18} />
                                    ) : (
                                        <Moon size={18} />
                                    )}
                                    <span className="text-sm font-medium">
                                        {isDarkMode
                                            ? "Modo claro"
                                            : "Modo oscuro"}
                                    </span>
                                </button>
                            </MenuItem>

                            <div className="border-t border-neutral-100 dark:border-neutral-800 my-2" />

                            {/* Logout */}
                            <MenuItem>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                >
                                    <LogOut size={18} />
                                    <span className="text-sm font-medium">
                                        Cerrar sesion
                                    </span>
                                </button>
                            </MenuItem>
                        </MenuItems>
                    </Menu>

                    {/* Menu Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="w-10 h-10"
                    >
                        {isMenuOpen ? <X size={22} /> : <MenuIcon size={22} />}
                    </Button>
                </div>
            </div>

            {/* Expandable Navigation Menu */}
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isMenuOpen
                        ? "max-h-[500px] opacity-100"
                        : "max-h-0 opacity-0"
                }`}
            >
                <div className="px-3 py-2 space-y-1 border-t border-neutral-100 dark:border-neutral-800">
                    {/* Main Nav */}
                    {mainNavItems.map((item) => (
                        <NavLink
                            key={item.id}
                            href={route(item.route) as string}
                            icon={item.icon}
                            label={item.label}
                            isActive={activeTab === item.id}
                            variant="admin"
                            onClick={() => setIsMenuOpen(false)}
                        />
                    ))}

                    {/* Tools Section */}
                    <div className="pt-2">
                        <Button
                            variant="ghost"
                            onClick={() => setIsToolsOpen(!isToolsOpen)}
                            className="w-full justify-between px-3 py-2.5 h-auto text-neutral-600 dark:text-neutral-400"
                        >
                            <div className="flex items-center gap-3">
                                <Wrench size={20} />
                                <span className="text-sm font-medium">
                                    Herramientas
                                </span>
                            </div>
                            {isToolsOpen ? (
                                <ChevronUp size={16} />
                            ) : (
                                <ChevronDown size={16} />
                            )}
                        </Button>

                        <div
                            className={`overflow-hidden transition-all duration-200 ${
                                isToolsOpen
                                    ? "max-h-40 opacity-100 mt-1"
                                    : "max-h-0 opacity-0"
                            }`}
                        >
                            <div className="pl-4 space-y-1">
                                {toolsNavItems.map((item) => (
                                    <NavLink
                                        key={item.id}
                                        href={route(item.route) as string}
                                        icon={item.icon}
                                        label={item.label}
                                        isActive={activeTab === item.id}
                                        variant="admin"
                                        onClick={() => setIsMenuOpen(false)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Back to Panel - In navigation menu */}
                    <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 mt-2">
                        <NavLink
                            href={route("panel") as string}
                            icon={<Layers size={20} />}
                            label="Volver al Panel"
                            isActive={false}
                            variant="admin"
                            onClick={() => setIsMenuOpen(false)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
