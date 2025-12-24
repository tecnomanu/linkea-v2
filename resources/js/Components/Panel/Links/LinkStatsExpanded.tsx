import { Button } from "@/Components/ui/Button";
import { BarChart3, Calendar, TrendingUp, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
    Area,
    AreaChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

interface LinkStatsExpandedProps {
    linkId: string;
    isEnabled: boolean;
    onClose: () => void;
}

interface StatsData {
    totalClicks: number;
    period: {
        days: number;
        clicks: number;
        average: number;
        max: number;
    };
    sparklineData: { value: number }[];
    dataRange?: {
        firstClick: string | null;
        lastClick: string | null;
        hasData: boolean;
    };
}

const PERIOD_OPTIONS = [
    { value: "7", label: "7d" },
    { value: "30", label: "30d" },
    { value: "90", label: "90d" },
    { value: "365", label: "1 año" },
];

export const LinkStatsExpanded: React.FC<LinkStatsExpandedProps> = ({
    linkId,
    isEnabled,
    onClose,
}) => {
    const [stats, setStats] = useState<StatsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [days, setDays] = useState("30");

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(
                    `/api/panel/links/${linkId}/stats?days=${days}`,
                    {
                        headers: {
                            Accept: "application/json",
                            "X-CSRF-TOKEN":
                                document.querySelector<HTMLMetaElement>(
                                    'meta[name="csrf-token"]'
                                )?.content || "",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Error al cargar estadisticas");
                }

                const data = await response.json();
                setStats(data.data);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "Error desconocido"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [linkId, days]);

    // Transform data for chart with day labels
    const chartData =
        stats?.sparklineData.map((item, index) => {
            const date = new Date();
            date.setDate(date.getDate() - (stats.sparklineData.length - 1 - index));
            return {
                value: item.value,
                day: date.toLocaleDateString("es-AR", {
                    day: "2-digit",
                    month: "short",
                }),
            };
        }) || [];

    return (
        <div className="animate-in slide-in-from-top-2 duration-200">
            {/* Separator */}
            <div className="border-t border-neutral-100 dark:border-neutral-800 my-0" />
            
            {/* Content */}
            <div className="p-4 bg-neutral-50/50 dark:bg-neutral-800/30">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <BarChart3 size={18} className="text-brand-500" />
                        <span className="font-semibold text-neutral-700 dark:text-neutral-200">
                            Estadisticas detalladas
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Period selector buttons */}
                        <div className="flex items-center bg-white dark:bg-neutral-800 rounded-lg p-1 border border-neutral-200 dark:border-neutral-700">
                            {PERIOD_OPTIONS.map((opt) => (
                                <Button
                                    key={opt.value}
                                    variant={days === opt.value ? "primary" : "ghost"}
                                    size="sm"
                                    onClick={() => setDays(opt.value)}
                                    className={days === opt.value ? "" : "text-neutral-500"}
                                >
                                    {opt.label}
                                </Button>
                            ))}
                        </div>
                        <Button variant="ghost" size="sm" onClick={onClose}>
                            <X size={16} />
                        </Button>
                    </div>
                </div>

            {loading ? (
                <div className="h-32 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : error ? (
                <div className="h-32 flex items-center justify-center text-red-500 text-sm">
                    {error}
                </div>
            ) : stats ? (
                <>
                    {/* Stats Summary */}
                    <div className="grid grid-cols-4 gap-3 mb-4">
                        <div className="bg-white dark:bg-neutral-800 rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold text-neutral-900 dark:text-white">
                                {stats.totalClicks.toLocaleString()}
                            </div>
                            <div className="text-xs text-neutral-500">
                                Total historico
                            </div>
                        </div>
                        <div className="bg-white dark:bg-neutral-800 rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold text-brand-500">
                                {stats.period.clicks.toLocaleString()}
                            </div>
                            <div className="text-xs text-neutral-500">
                                Ultimos {stats.period.days}d
                            </div>
                        </div>
                        <div className="bg-white dark:bg-neutral-800 rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold text-neutral-900 dark:text-white">
                                {stats.period.average}
                            </div>
                            <div className="text-xs text-neutral-500">
                                Promedio/dia
                            </div>
                        </div>
                        <div className="bg-white dark:bg-neutral-800 rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold text-green-500 flex items-center justify-center gap-1">
                                <TrendingUp size={18} />
                                {stats.period.max}
                            </div>
                            <div className="text-xs text-neutral-500">
                                Maximo/dia
                            </div>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="h-40 bg-white dark:bg-neutral-800 rounded-lg p-3">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient
                                        id={`colorValue-${linkId}`}
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor={isEnabled ? "#ef5844" : "#d4d4d4"}
                                            stopOpacity={0.3}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor={isEnabled ? "#ef5844" : "#d4d4d4"}
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="day"
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
                                        borderRadius: "8px",
                                        fontSize: "12px",
                                    }}
                                    labelStyle={{ color: "#9ca3af" }}
                                    itemStyle={{ color: "#ef5844" }}
                                    formatter={(value: number) => [`${value} clicks`, ""]}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke={isEnabled ? "#ef5844" : "#d4d4d4"}
                                    strokeWidth={2}
                                    fill={`url(#colorValue-${linkId})`}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Data range info */}
                    {stats.dataRange && (
                        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-neutral-400">
                            <Calendar size={12} />
                            {stats.dataRange.hasData ? (
                                <span>
                                    Datos desde{" "}
                                    <span className="font-medium text-neutral-600 dark:text-neutral-300">
                                        {stats.dataRange.firstClick}
                                    </span>
                                    {" "}hasta{" "}
                                    <span className="font-medium text-neutral-600 dark:text-neutral-300">
                                        {stats.dataRange.lastClick}
                                    </span>
                                </span>
                            ) : (
                                <span>
                                    Sin datos de clicks diarios registrados.
                                    Los {stats.totalClicks.toLocaleString()} clicks son del sistema anterior.
                                </span>
                            )}
                        </div>
                    )}
                </>
            ) : null}
            </div>
        </div>
    );
};

