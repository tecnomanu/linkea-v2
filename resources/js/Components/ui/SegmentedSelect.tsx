import { clsx, type ClassValue } from "clsx";
import React from "react";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface SelectOption {
    value: string;
    label: string;
}

interface SegmentedSelectProps {
    /** Field label */
    label?: string;
    /** Currently selected value */
    value: string;
    /** Array of options */
    options: SelectOption[];
    /** Change handler */
    onChange: (value: string) => void;
    /** Number of columns for grid layout */
    columns?: 2 | 3 | 4;
    /** Additional class for container */
    className?: string;
    /** Whether to use uppercase for labels */
    uppercase?: boolean;
}

const columnClasses = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
};

export const SegmentedSelect: React.FC<SegmentedSelectProps> = ({
    label,
    value,
    options,
    onChange,
    columns = 3,
    className,
    uppercase = false,
}) => {
    return (
        <div className={cn("space-y-1.5", className)}>
            {label && (
                <label
                    className={cn(
                        "text-xs font-bold text-neutral-500 dark:text-neutral-400 tracking-wider",
                        uppercase && "uppercase"
                    )}
                >
                    {label}
                </label>
            )}
            <div className={cn("grid gap-2", columnClasses[columns])}>
                {options.map((opt) => (
                    <button
                        key={opt.value}
                        type="button"
                        onClick={() => onChange(opt.value)}
                        className={cn(
                            "py-2 px-3 text-sm font-bold rounded-lg border transition-all",
                            value === opt.value
                                ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-md"
                                : "bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
                        )}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

SegmentedSelect.displayName = "SegmentedSelect";
