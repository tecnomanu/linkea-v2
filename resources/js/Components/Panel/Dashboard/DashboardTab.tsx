import { Button } from "@/Components/ui/Button";
import {
    ArrowDownRight,
    ArrowUpRight,
    BarChart3,
    Link as LinkIcon,
    MousePointer2,
    TrendingUp,
    Users,
    Zap,
} from "lucide-react";
import React, { useState } from "react";
import {
    Area,
    AreaChart,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

// Block type icons and colors mapping
const BLOCK_TYPE_CONFIG: Record<
    string,
    { icon: React.ElementType; color: string; label: string }
> = {
    link: { icon: LinkIcon, color: "#3b82f6", label: "Enlace" },
    youtube: {
        icon: () => <span className="text-red-500 font-bold text-xs">YT</span>,
        color: "#ef4444",
        label: "YouTube",
    },
    spotify: {
        icon: () => (
            <span className="text-green-500 font-bold text-xs">SP</span>
        ),
        color: "#22c55e",
        label: "Spotify",
    },
    whatsapp: {
        icon: () => (
            <span className="text-emerald-500 font-bold text-xs">WA</span>
        ),
        color: "#10b981",
        label: "WhatsApp",
    },
    social: { icon: Users, color: "#8b5cf6", label: "Social" },
};

const PERIOD_OPTIONS = [
    { value: 7, label: "7d" },
    { value: 30, label: "30d" },
    { value: 90, label: "90d" },
];

// Format large numbers like 24500 -> "24.5k"
const formatNumber = (num: number): string => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    }
    return num.toString();
};

interface DashboardStats {
    totalViews: number;
    totalClicks: number;
    totalLinks: number;
    activeLinks: number;
    viewsToday: number;
    viewsThisWeek: number;
    viewsThisMonth: number;
    clicksToday: number;
    clicksThisWeek: number;
    clicksThisMonth: number;
    weeklyChange: number;
    dailyAverage: number;
    chartData: { date: string; fullDate: string; clicks: number }[];
    viewChartData: { date: string; fullDate: string; views: number }[];
    topLinks: {
        id: string;
        title: string;
        type: string;
        clicks: number;
        sparklineData: { value: number }[];
    }[];
    linksByType: {
        type: string;
        count: number;
        clicks: number;
    }[];
}

interface DashboardTabProps {
    stats: DashboardStats | null;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({ stats }) => {
    const [chartPeriod, setChartPeriod] = useState(30);

    // Show empty state when: no stats, no links, or no activity at all
    const isEmpty =
        !stats ||
        (stats.totalLinks === 0 &&
            stats.totalViews === 0 &&
            stats.totalClicks === 0);

    if (isEmpty) {
        return (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-gradient-to-br from-brand-50 to-brand-100/50 dark:from-brand-900/20 dark:to-brand-800/10 rounded-3xl p-8 md:p-12 text-center border border-brand-200/50 dark:border-brand-800/30">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white dark:bg-neutral-800 rounded-2xl shadow-lg mb-6">
                        <BarChart3 size={32} className="text-brand-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                        Tus estadisticas apareceran aqui
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-400 max-w-md mx-auto mb-6">
                        Una vez que agregues enlaces y empieces a recibir
                        visitas, podras ver metricas detalladas de rendimiento.
                    </p>
                    <a
                        href="/panel/links"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold transition-all hover:shadow-lg hover:-translate-y-0.5"
                    >
                        <LinkIcon size={18} />
                        Crear mi primer enlace
                    </a>
                </div>
            </div>
        );
    }

    // Filter chart data based on period
    const filteredChartData = stats.chartData.slice(-chartPeriod);
    const filteredViewChartData =
        stats.viewChartData?.slice(-chartPeriod) || [];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6 pb-8 xl:pb-32">
            {/* Primary Stats Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Total Views - Dark Card */}
                <div className="bg-neutral-900 text-white p-6 rounded-3xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-32 bg-neutral-800/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10 flex justify-between items-start mb-8">
                        <div className="p-2 bg-neutral-800 rounded-xl">
                            <Users size={20} className="text-brand-500" />
                        </div>
                        {stats.viewsThisWeek > 0 && (
                            <span className="text-xs font-medium px-2 py-1 rounded-lg flex items-center gap-1 text-green-400 bg-green-900/30">
                                +{formatNumber(stats.viewsThisWeek)} esta semana
                            </span>
                        )}
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-3xl font-bold tracking-tight mb-1">
                            {formatNumber(stats.totalViews)}
                        </h3>
                        <p className="text-sm text-neutral-400">Total Views</p>
                    </div>
                </div>

                {/* Total Clicks */}
                <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
                    <div className="flex justify-between items-start mb-8">
                        <div className="p-2 bg-brand-50 dark:bg-brand-900/30 rounded-xl">
                            <MousePointer2
                                size={20}
                                className="text-brand-500"
                            />
                        </div>
                        {stats.weeklyChange !== 0 && (
                            <span
                                className={`text-xs font-medium px-2 py-1 rounded-lg flex items-center gap-1 ${
                                    stats.weeklyChange > 0
                                        ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30"
                                        : "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30"
                                }`}
                            >
                                {stats.weeklyChange > 0 ? (
                                    <ArrowUpRight size={12} />
                                ) : (
                                    <ArrowDownRight size={12} />
                                )}
                                {Math.abs(stats.weeklyChange)}%
                            </span>
                        )}
                    </div>
                    <h3 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight mb-1">
                        {formatNumber(stats.totalClicks)}
                    </h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Total Clicks
                    </p>
                </div>

                {/* CTR */}
                <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm relative overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 opacity-10 text-brand-500">
                        <TrendingUp size={120} />
                    </div>
                    <div className="flex justify-between items-start mb-8">
                        <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
                            <TrendingUp
                                size={20}
                                className="text-neutral-900 dark:text-white"
                            />
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight mb-1">
                        {stats.totalViews > 0
                            ? `${(
                                  (stats.totalClicks / stats.totalViews) *
                                  100
                              ).toFixed(1)}%`
                            : "0%"}
                    </h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        CTR (Clicks/Views)
                    </p>
                </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <QuickStat
                    label="Views hoy"
                    value={stats.viewsToday}
                    icon={<Users size={14} />}
                />
                <QuickStat
                    label="Clicks hoy"
                    value={stats.clicksToday}
                    icon={<MousePointer2 size={14} />}
                />
                <QuickStat
                    label="Enlaces activos"
                    value={`${stats.activeLinks}/${stats.totalLinks}`}
                    icon={<Zap size={14} />}
                />
                <QuickStat
                    label="Promedio/dia"
                    value={stats.dailyAverage}
                    icon={<BarChart3 size={14} />}
                    decimals
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Views Chart */}
                <ChartCard
                    title="Views"
                    subtitle={`Ultimos ${chartPeriod} dias`}
                    value={stats.viewsThisMonth}
                    data={filteredViewChartData}
                    dataKey="views"
                    color="#8b5cf6"
                />

                {/* Clicks Chart */}
                <ChartCard
                    title="Clicks"
                    subtitle={`Ultimos ${chartPeriod} dias`}
                    value={stats.clicksThisMonth}
                    data={filteredChartData}
                    dataKey="clicks"
                    color="#ef5844"
                />
            </div>

            {/* Period Selector */}
            <div className="flex justify-center">
                <div className="inline-flex items-center bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1">
                    {PERIOD_OPTIONS.map((opt) => (
                        <Button
                            key={opt.value}
                            variant={
                                chartPeriod === opt.value ? "primary" : "ghost"
                            }
                            size="sm"
                            onClick={() => setChartPeriod(opt.value)}
                            className={
                                chartPeriod === opt.value
                                    ? ""
                                    : "text-neutral-500"
                            }
                        >
                            {opt.label}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Top Links + Type Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Links */}
                <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-6">
                    <h3 className="font-bold text-lg text-neutral-900 dark:text-white mb-1">
                        Top Enlaces
                    </h3>
                    <p className="text-sm text-neutral-500 mb-6">
                        Tus enlaces con mejor rendimiento
                    </p>

                    {stats.topLinks.length > 0 ? (
                        <div className="space-y-3">
                            {stats.topLinks.map((link, index) => (
                                <TopLinkItem
                                    key={link.id}
                                    link={link}
                                    rank={index + 1}
                                    maxClicks={stats.topLinks[0]?.clicks || 1}
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptySection
                            icon={LinkIcon}
                            text="Sin datos de enlaces aun"
                        />
                    )}
                </div>

                {/* Type Breakdown */}
                <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-6">
                    <h3 className="font-bold text-lg text-neutral-900 dark:text-white mb-1">
                        Por Tipo de Bloque
                    </h3>
                    <p className="text-sm text-neutral-500 mb-6">
                        Distribucion de clicks por tipo
                    </p>

                    {stats.linksByType.length > 0 ? (
                        <div className="space-y-3">
                            {stats.linksByType.map((item) => (
                                <TypeBreakdownItem
                                    key={item.type}
                                    item={item}
                                    maxClicks={
                                        stats.linksByType[0]?.clicks || 1
                                    }
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptySection
                            icon={BarChart3}
                            text="Sin datos de tipos aun"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

// =============================================================================
// Sub-components
// =============================================================================

const QuickStat: React.FC<{
    label: string;
    value: number | string;
    icon: React.ReactNode;
    decimals?: boolean;
}> = ({ label, value, icon, decimals }) => (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4">
        <div className="flex items-center gap-2 text-neutral-400 mb-2">
            {icon}
            <span className="text-xs font-medium">{label}</span>
        </div>
        <div className="text-xl font-bold text-neutral-900 dark:text-white">
            {typeof value === "number"
                ? decimals
                    ? value.toFixed(1)
                    : value.toLocaleString()
                : value}
        </div>
    </div>
);

const ChartCard: React.FC<{
    title: string;
    subtitle: string;
    value: number;
    data: any[];
    dataKey: string;
    color: string;
}> = ({ title, subtitle, value, data, dataKey, color }) => (
    <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
                <h3 className="font-bold text-lg text-neutral-900 dark:text-white">
                    {title}
                </h3>
                <p className="text-sm text-neutral-500">{subtitle}</p>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-neutral-900 dark:text-white">
                    {formatNumber(value)}
                </span>
                <span className="text-xs text-neutral-400">este mes</span>
            </div>
        </div>
        <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient
                            id={`color${dataKey}`}
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="5%"
                                stopColor={color}
                                stopOpacity={0.3}
                            />
                            <stop
                                offset="95%"
                                stopColor={color}
                                stopOpacity={0}
                            />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: "#9ca3af" }}
                        interval="preserveStartEnd"
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: "#9ca3af" }}
                        width={30}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#1f2937",
                            border: "none",
                            borderRadius: "12px",
                            fontSize: "12px",
                            padding: "8px 12px",
                        }}
                        labelStyle={{ color: "#9ca3af", marginBottom: "4px" }}
                        itemStyle={{ color }}
                        formatter={(v) => [`${v ?? 0} ${dataKey}`, ""]}
                    />
                    <Area
                        type="monotone"
                        dataKey={dataKey}
                        stroke={color}
                        strokeWidth={2}
                        fill={`url(#color${dataKey})`}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </div>
);

const TopLinkItem: React.FC<{
    link: DashboardStats["topLinks"][0];
    rank: number;
    maxClicks: number;
}> = ({ link, rank, maxClicks }) => {
    const config = BLOCK_TYPE_CONFIG[link.type] || BLOCK_TYPE_CONFIG.link;
    const percentage = maxClicks > 0 ? (link.clicks / maxClicks) * 100 : 0;
    const IconComponent = config.icon;

    return (
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
            <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    rank === 1
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                        : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                }`}
            >
                {rank}
            </div>
            <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${config.color}15` }}
            >
                <IconComponent size={14} style={{ color: config.color }} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-neutral-900 dark:text-white truncate">
                    {link.title || "Sin titulo"}
                </div>
                <div className="mt-1 h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                            width: `${percentage}%`,
                            backgroundColor: config.color,
                        }}
                    />
                </div>
            </div>
            <div className="w-16 h-8 hidden sm:block">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={link.sparklineData}>
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke={config.color}
                            strokeWidth={1.5}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="text-right">
                <div className="font-bold text-sm text-neutral-900 dark:text-white">
                    {link.clicks.toLocaleString()}
                </div>
                <div className="text-[10px] text-neutral-400">clicks</div>
            </div>
        </div>
    );
};

const TypeBreakdownItem: React.FC<{
    item: DashboardStats["linksByType"][0];
    maxClicks: number;
}> = ({ item, maxClicks }) => {
    const config = BLOCK_TYPE_CONFIG[item.type] || {
        icon: LinkIcon,
        color: "#6b7280",
        label: item.type,
    };
    const percentage = maxClicks > 0 ? (item.clicks / maxClicks) * 100 : 0;
    const IconComponent = config.icon;

    return (
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
            <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${config.color}15` }}
            >
                <IconComponent size={14} style={{ color: config.color }} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm text-neutral-900 dark:text-white">
                        {config.label}
                    </span>
                    <span className="text-xs text-neutral-400">
                        {item.count} {item.count === 1 ? "enlace" : "enlaces"}
                    </span>
                </div>
                <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                            width: `${percentage}%`,
                            backgroundColor: config.color,
                        }}
                    />
                </div>
            </div>
            <div className="text-right shrink-0 w-16">
                <div className="font-bold text-sm text-neutral-900 dark:text-white">
                    {item.clicks.toLocaleString()}
                </div>
            </div>
        </div>
    );
};

const EmptySection: React.FC<{
    icon: React.ElementType;
    text: string;
}> = ({ icon: Icon, text }) => (
    <div className="text-center py-8 text-neutral-400">
        <Icon size={24} className="mx-auto mb-2 opacity-50" />
        <p className="text-sm">{text}</p>
    </div>
);
