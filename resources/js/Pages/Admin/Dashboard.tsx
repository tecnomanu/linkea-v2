import AdminLayout from "@/Layouts/AdminLayout";
import { StatsCard } from "@/Components/Admin/StatsCard";
import {
    Activity,
    Building2,
    Globe,
    Mail,
    MousePointer,
    TrendingUp,
    Users,
} from "lucide-react";
import React from "react";

interface DashboardProps {
    auth: {
        user: any;
    };
    stats: {
        totalLandings: number;
        totalUsers: number;
        totalCompanies: number;
        totalNewsletters: number;
        totalClicks: number;
        recentActivity: Array<{
            id: string;
            type: string;
            description: string;
            time: string;
        }>;
    };
}

export default function Dashboard({ auth, stats }: DashboardProps) {
    const defaultStats = {
        totalLandings: 0,
        totalUsers: 0,
        totalCompanies: 0,
        totalNewsletters: 0,
        totalClicks: 0,
        recentActivity: [],
        ...stats,
    };

    return (
        <AdminLayout title="Admin - Dashboard" user={auth.user}>
            <div className="p-6 md:p-8 pt-20 md:pt-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                        Dashboard
                    </h1>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-1">
                        Vista general del sistema
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatsCard
                        title="Total Landings"
                        value={defaultStats.totalLandings}
                        icon={<Globe size={22} />}
                        color="blue"
                    />
                    <StatsCard
                        title="Usuarios Registrados"
                        value={defaultStats.totalUsers}
                        icon={<Users size={22} />}
                        color="green"
                    />
                    <StatsCard
                        title="Empresas"
                        value={defaultStats.totalCompanies}
                        icon={<Building2 size={22} />}
                        color="purple"
                    />
                    <StatsCard
                        title="Total Clicks"
                        value={defaultStats.totalClicks.toLocaleString()}
                        icon={<MousePointer size={22} />}
                        color="orange"
                    />
                </div>

                {/* Quick Actions & Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Quick Actions */}
                    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
                        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                            Acciones rapidas
                        </h2>
                        <div className="grid grid-cols-2 gap-3">
                            <a
                                href={route("admin.landings")}
                                className="flex items-center gap-3 p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                            >
                                <Globe
                                    size={20}
                                    className="text-blue-500"
                                />
                                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    Ver Landings
                                </span>
                            </a>
                            <a
                                href={route("admin.users")}
                                className="flex items-center gap-3 p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                            >
                                <Users
                                    size={20}
                                    className="text-green-500"
                                />
                                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    Ver Usuarios
                                </span>
                            </a>
                            <a
                                href={route("admin.companies")}
                                className="flex items-center gap-3 p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                            >
                                <Building2
                                    size={20}
                                    className="text-purple-500"
                                />
                                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    Ver Empresas
                                </span>
                            </a>
                            <a
                                href={route("admin.newsletters")}
                                className="flex items-center gap-3 p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                            >
                                <Mail
                                    size={20}
                                    className="text-red-500"
                                />
                                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    Newsletters
                                </span>
                            </a>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
                        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                            Actividad reciente
                        </h2>
                        {defaultStats.recentActivity.length > 0 ? (
                            <div className="space-y-3">
                                {defaultStats.recentActivity.map((activity) => (
                                    <div
                                        key={activity.id}
                                        className="flex items-start gap-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-500">
                                            <Activity size={14} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-neutral-700 dark:text-neutral-300">
                                                {activity.description}
                                            </p>
                                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                                                {activity.time}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
                                <Activity
                                    size={40}
                                    className="mx-auto mb-3 opacity-30"
                                />
                                <p>No hay actividad reciente</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* System Info */}
                <div className="mt-6 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                        Informacion del sistema
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <span className="text-neutral-500 dark:text-neutral-400">
                                Version
                            </span>
                            <p className="font-medium text-neutral-900 dark:text-white">
                                2.0.0
                            </p>
                        </div>
                        <div>
                            <span className="text-neutral-500 dark:text-neutral-400">
                                Entorno
                            </span>
                            <p className="font-medium text-neutral-900 dark:text-white">
                                {import.meta.env.MODE || "production"}
                            </p>
                        </div>
                        <div>
                            <span className="text-neutral-500 dark:text-neutral-400">
                                PHP
                            </span>
                            <p className="font-medium text-neutral-900 dark:text-white">
                                8.2+
                            </p>
                        </div>
                        <div>
                            <span className="text-neutral-500 dark:text-neutral-400">
                                Laravel
                            </span>
                            <p className="font-medium text-neutral-900 dark:text-white">
                                12.x
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
