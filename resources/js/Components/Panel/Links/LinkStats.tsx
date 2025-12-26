import { BarChart3 } from "lucide-react";
import React from "react";
import { Line, LineChart, ResponsiveContainer } from "recharts";

interface LinkStatsProps {
    sparklineData: { value: number }[];
    clicks: number;
    isEnabled: boolean;
    /** If provided, stats become clickable */
    onClick?: () => void;
    /** Show expanded indicator */
    isExpanded?: boolean;
}

export const LinkStats: React.FC<LinkStatsProps> = ({
    sparklineData,
    clicks,
    isEnabled,
    onClick,
    isExpanded,
}) => {
    const hasData = sparklineData.length > 0;
    const isClickable = !!onClick;

    return (
        <button
            onClick={onClick}
            disabled={!isClickable}
            className={`
                hidden md:flex flex-col items-end gap-0.5 select-none outline-none transition-all
                ${
                    isClickable
                        ? "cursor-pointer hover:opacity-80 group"
                        : "cursor-default"
                }
                ${isExpanded ? "opacity-100" : ""}
            `}
            tabIndex={isClickable ? 0 : -1}
            data-tooltip={
                isClickable
                    ? isExpanded
                        ? "Cerrar estadisticas"
                        : "Ver estadisticas"
                    : undefined
            }
        >
            <div
                className="w-24 h-10 outline-none focus:outline-none relative"
                style={{ outline: "none" }}
            >
                {hasData ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={sparklineData}>
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke={isEnabled ? "#ef5844" : "#d4d4d4"}
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="w-16 h-[2px] bg-neutral-200 dark:bg-neutral-700 rounded" />
                    </div>
                )}
                {/* Expand icon overlay on hover */}
                {isClickable && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 dark:bg-neutral-900/80 rounded">
                        <BarChart3
                            size={16}
                            className={
                                isExpanded
                                    ? "text-brand-500"
                                    : "text-neutral-400"
                            }
                        />
                    </div>
                )}
            </div>
            <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-semibold tabular-nums">
                {clicks.toLocaleString()} clicks
            </span>
        </button>
    );
};
