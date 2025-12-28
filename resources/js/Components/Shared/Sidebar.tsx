import { Logo } from "@/Components/Shared/Logo";
import { Button } from "@/Components/ui/Button";
import { Link } from "@inertiajs/react";
import {
    Layers,
    LayoutGrid,
    Moon,
    Palette,
    Settings,
    Shield,
    Sun,
} from "lucide-react";
import React from "react";
import { NavLink } from "./NavLink";
import { SettingsDropdown } from "./SettingsDropdown";
import { UserDropdown } from "./UserDropdown";

interface SidebarProps {
    activeTab: string;
    setActiveTab?: (tab: string) => void;
    isDarkMode: boolean;
    toggleTheme: () => void;
    user?: any;
}

export const Sidebar: React.FC<SidebarProps> = ({
    activeTab,
    isDarkMode,
    toggleTheme,
    user,
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

    return (
        <aside className="hidden md:flex fixed left-0 top-0 h-screen w-[72px] bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex-col items-center py-6 z-50 transition-colors duration-300">
            {/* Brand Logo */}
            <Link
                href={route("panel") as string}
                className="mb-10 w-11 h-11 rounded-2xl flex items-center justify-center shadow-glow transition-transform hover:scale-105 overflow-hidden"
            >
                <Logo variant="icon" size="sm" />
            </Link>

            {/* Navigation */}
            <nav className="flex-1 flex flex-col gap-6 w-full px-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.id}
                        href={route(item.route) as string}
                        icon={item.icon}
                        label={item.label}
                        isActive={activeTab === item.id}
                        variant="panel"
                        iconOnly
                    />
                ))}
            </nav>

            {/* Bottom Actions */}
            <div className="flex flex-col gap-4 px-2">
                {/* Admin Panel Link (root only) */}
                {user?.role_name === "root" && (
                    <Link
                        href="/admin"
                        className="group relative w-10 h-10 flex items-center justify-center text-amber-500 hover:text-amber-400 hover:bg-amber-500/10 rounded-xl transition-all"
                        title="Admin Panel"
                    >
                        <Shield size={20} />
                        <span className="absolute left-14 bg-neutral-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                            Admin Panel
                        </span>
                    </Link>
                )}

                {/* Settings Dropdown */}
                <SettingsDropdown />

                {/* Theme Toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                    title="Toggle Theme"
                >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </Button>

                {/* User Dropdown */}
                <UserDropdown user={user} />
            </div>
        </aside>
    );
};
