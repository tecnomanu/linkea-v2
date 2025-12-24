import React from "react";

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    change?: {
        value: number;
        label: string;
    };
    color?: "red" | "blue" | "green" | "orange" | "purple";
}

const colorClasses = {
    red: {
        bg: "bg-red-50 dark:bg-red-500/10",
        icon: "text-red-500",
        badge: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400",
    },
    blue: {
        bg: "bg-blue-50 dark:bg-blue-500/10",
        icon: "text-blue-500",
        badge: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
    },
    green: {
        bg: "bg-green-50 dark:bg-green-500/10",
        icon: "text-green-500",
        badge: "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400",
    },
    orange: {
        bg: "bg-orange-50 dark:bg-orange-500/10",
        icon: "text-orange-500",
        badge: "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400",
    },
    purple: {
        bg: "bg-purple-50 dark:bg-purple-500/10",
        icon: "text-purple-500",
        badge: "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400",
    },
};

export const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    icon,
    change,
    color = "red",
}) => {
    const colors = colorClasses[color];

    return (
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">
                        {title}
                    </p>
                    <p className="text-2xl font-semibold text-neutral-900 dark:text-white">
                        {value}
                    </p>
                    {change && (
                        <div className="mt-2 flex items-center gap-2">
                            <span
                                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                    change.value >= 0
                                        ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                                        : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                                }`}
                            >
                                {change.value >= 0 ? "+" : ""}
                                {change.value}%
                            </span>
                            <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                {change.label}
                            </span>
                        </div>
                    )}
                </div>
                <div
                    className={`w-11 h-11 rounded-xl ${colors.bg} flex items-center justify-center ${colors.icon}`}
                >
                    {icon}
                </div>
            </div>
        </div>
    );
};

