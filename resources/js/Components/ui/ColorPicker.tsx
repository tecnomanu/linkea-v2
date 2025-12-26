import { clsx, type ClassValue } from "clsx";
import React from "react";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ColorPickerProps {
    /** Current color value (hex) */
    value: string;
    /** Change handler */
    onChange: (color: string) => void;
    /** Optional label */
    label?: string;
    /** Size variant */
    size?: "sm" | "md" | "lg";
    /** Whether to show hex code */
    showHex?: boolean;
    /** Additional class for container */
    className?: string;
    /** Disabled state (read-only visual) */
    disabled?: boolean;
}

const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-12 h-12",
    lg: "w-14 h-14",
};

export const ColorPicker: React.FC<ColorPickerProps> = ({
    value,
    onChange,
    label,
    size = "md",
    showHex = false,
    className,
    disabled = false,
}) => {
    return (
        <div className={cn("space-y-2", disabled && "opacity-50", className)}>
            {label && (
                <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    {label}
                </span>
            )}
            <div className="flex items-center gap-3">
                <div
                    className={cn(
                        "relative rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700 shadow-sm",
                        sizeClasses[size],
                        disabled && "pointer-events-none"
                    )}
                >
                    <input
                        type="color"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        disabled={disabled}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] p-0 cursor-pointer border-0 disabled:cursor-not-allowed"
                    />
                </div>
                {showHex && (
                    <span className="font-mono text-sm text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 rounded-lg">
                        {value}
                    </span>
                )}
            </div>
        </div>
    );
};

ColorPicker.displayName = "ColorPicker";
