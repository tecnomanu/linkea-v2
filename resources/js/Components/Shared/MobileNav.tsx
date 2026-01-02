import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { router } from "@inertiajs/react";
import {
    Layers,
    LayoutGrid,
    LogOut,
    Moon,
    Palette,
    Settings,
    Shield,
    Sun,
    User,
} from "lucide-react";
import React from "react";
import { Logo } from "./Logo";
import { MobileNavLink } from "./NavLink";
import { UserAvatar } from "./UserAvatar";

interface MobileNavProps {
    activeTab: string;
    setActiveTab?: (tab: string) => void;
    isDarkMode: boolean;
    toggleTheme: () => void;
    userAvatar?: string;
    userAvatarThumb?: string;
    userName?: string;
    userEmail?: string;
    userRole?: string;
}

export const MobileNav: React.FC<MobileNavProps> = ({
    activeTab,
    isDarkMode,
    toggleTheme,
    userAvatar,
    userAvatarThumb,
    userName,
    userEmail,
    userRole,
}) => {
    const navItems = [
        {
            id: "dashboard",
            icon: <LayoutGrid size={20} />,
            label: "Inicio",
            route: "panel",
        },
        {
            id: "links",
            icon: <Layers size={20} />,
            label: "Enlaces",
            route: "panel.links",
        },
        {
            id: "appearance",
            icon: <Palette size={20} />,
            label: "Apariencia",
            route: "panel.design",
        },
        {
            id: "settings",
            icon: <Settings size={20} />,
            label: "Ajustes",
            route: "panel.settings",
        },
    ];

    const handleLogout = () => {
        router.post(route("logout") as string);
    };

    const isRoot = userRole === "root";

    return (
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800 transition-colors duration-300 shadow-sm">
            {/* Top Row: Logo & User Menu */}
            <div className="flex justify-between items-center px-4 py-2 border-b border-neutral-100 dark:border-neutral-800/50">
                <div className="flex items-center gap-2">
                    <Logo variant="full" size="xs" />
                </div>

                {/* User Menu */}
                <Menu as="div" className="relative">
                    <MenuButton className="flex items-center gap-2 p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                        <UserAvatar
                            avatar={userAvatar}
                            avatarThumb={userAvatarThumb}
                            name={userName}
                            size="sm"
                            variant="panel"
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
                                    avatarThumb={userAvatarThumb}
                                    name={userName}
                                    size="md"
                                    variant="panel"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm text-neutral-900 dark:text-white truncate">
                                        {userName || "Usuario"}
                                    </p>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                                        {userEmail || ""}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Profile */}
                        <MenuItem>
                            <button
                                onClick={() =>
                                    router.visit(
                                        route("panel.settings") as string
                                    )
                                }
                                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                            >
                                <User size={18} />
                                <span className="text-sm font-medium">
                                    Mi perfil
                                </span>
                            </button>
                        </MenuItem>

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
                                    {isDarkMode ? "Modo claro" : "Modo oscuro"}
                                </span>
                            </button>
                        </MenuItem>

                        {/* Admin Panel - Only for root users in mobile (after theme toggle) */}
                        {isRoot && (
                            <MenuItem>
                                <button
                                    onClick={() =>
                                        router.visit(
                                            route("admin.dashboard") as string
                                        )
                                    }
                                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                >
                                    <Shield size={18} />
                                    <span className="text-sm font-medium">
                                        Admin Panel
                                    </span>
                                </button>
                            </MenuItem>
                        )}

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
            </div>

            {/* Bottom Row: Navigation Tabs - Unchanged */}
            <div className="flex items-center justify-between px-2 py-1">
                {navItems.map((item) => (
                    <MobileNavLink
                        key={item.id}
                        href={route(item.route) as string}
                        icon={item.icon}
                        label={item.label}
                        isActive={activeTab === item.id}
                        variant="panel"
                        expandOnActive
                    />
                ))}
            </div>
        </div>
    );
};
