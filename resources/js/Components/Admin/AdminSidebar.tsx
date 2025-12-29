import { Button } from "@/Components/ui/Button";
import { NavLink } from "@/Components/Shared/NavLink";
import {
    Bell,
    Building2,
    ChevronDown,
    Globe,
    Layers,
    LayoutDashboard,
    Mail,
    Shield,
    Users,
} from "lucide-react";
import React, { useState } from "react";
import { AdminUserDropdown } from "./AdminUserDropdown";

interface AdminSidebarProps {
    activeTab: string;
    isDarkMode: boolean;
    toggleTheme: () => void;
    user?: any;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
    activeTab,
    isDarkMode,
    toggleTheme,
    user,
}) => {
    const [isToolsExpanded, setIsToolsExpanded] = useState(
        activeTab === "newsletters" || activeTab === "notifications"
    );

    const navItems = [
        {
            id: "dashboard",
            icon: <LayoutDashboard size={18} />,
            label: "Dashboard",
            route: "admin.dashboard",
        },
        {
            id: "landings",
            icon: <Globe size={18} />,
            label: "Landings",
            route: "admin.landings",
        },
        {
            id: "users",
            icon: <Users size={18} />,
            label: "Usuarios",
            route: "admin.users",
        },
        {
            id: "companies",
            icon: <Building2 size={18} />,
            label: "Empresas",
            route: "admin.companies",
        },
    ];

    const toolsItems = [
        {
            id: "newsletters",
            icon: <Mail size={18} />,
            label: "Newsletters",
            route: "admin.newsletters",
        },
        {
            id: "notifications",
            icon: <Bell size={18} />,
            label: "Notificaciones",
            route: "admin.notifications",
        },
    ];

    return (
        <aside className="hidden md:flex fixed left-0 top-0 h-screen w-[220px] bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex-col py-4 z-50 transition-colors duration-300">
            {/* Brand Header */}
            <div className="flex items-center gap-3 px-4 mb-6">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm overflow-hidden bg-red-500">
                    <Shield size={20} className="text-white" />
                </div>
                <div className="flex flex-col">
                    <span className="font-semibold text-sm text-neutral-900 dark:text-white">
                        Admin Panel
                    </span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        linkea.ar
                    </span>
                </div>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 flex flex-col px-2 overflow-y-auto overlay-scrollbar">
                <div className="text-xs uppercase text-neutral-400 dark:text-neutral-500 px-3 mb-2 font-medium">
                    General
                </div>

                {navItems.map((item) => (
                    <NavLink
                        key={item.id}
                        href={route(item.route)}
                        icon={item.icon}
                        label={item.label}
                        isActive={activeTab === item.id}
                        variant="admin"
                        className="mb-0.5"
                    />
                ))}

                {/* Tools Section */}
                <div className="mt-4">
                    <Button
                        variant="ghost"
                        onClick={() => setIsToolsExpanded(!isToolsExpanded)}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs uppercase text-neutral-400 dark:text-neutral-500 font-medium h-auto"
                    >
                        <span>Herramientas</span>
                        <ChevronDown
                            size={14}
                            className={`transition-transform duration-200 ${
                                isToolsExpanded ? "rotate-180" : ""
                            }`}
                        />
                    </Button>

                    {isToolsExpanded && (
                        <div className="mt-1">
                            {toolsItems.map((item) => (
                                <NavLink
                                    key={item.id}
                                    href={route(item.route)}
                                    icon={item.icon}
                                    label={item.label}
                                    isActive={activeTab === item.id}
                                    variant="admin"
                                    className="mb-0.5 ml-2"
                                />
                            ))}
                        </div>
                    )}
                </div>
            </nav>

            {/* Bottom Section */}
            <div className="px-3 pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
                {/* Back to Panel - In navigation, not in user menu */}
                <NavLink
                    href={route("panel")}
                    icon={<Layers size={18} />}
                    label="Volver al Panel"
                    isActive={false}
                    variant="admin"
                />

                {/* User Dropdown */}
                <AdminUserDropdown
                    user={user}
                    isDarkMode={isDarkMode}
                    toggleTheme={toggleTheme}
                />
            </div>
        </aside>
    );
};
