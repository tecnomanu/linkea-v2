/**
 * PositionSelector - Visual position picker for background images
 * 
 * A 3x3 grid that allows clicking to select position (top, center, bottom × left, center, right)
 */

import React from "react";

type Position = 
    | "top left" | "top" | "top right"
    | "left" | "center" | "right"
    | "bottom left" | "bottom" | "bottom right";

interface PositionSelectorProps {
    value: string;
    onChange: (position: string) => void;
    label?: string;
    className?: string;
}

const POSITIONS: { position: Position; row: number; col: number }[] = [
    { position: "top left", row: 0, col: 0 },
    { position: "top", row: 0, col: 1 },
    { position: "top right", row: 0, col: 2 },
    { position: "left", row: 1, col: 0 },
    { position: "center", row: 1, col: 1 },
    { position: "right", row: 1, col: 2 },
    { position: "bottom left", row: 2, col: 0 },
    { position: "bottom", row: 2, col: 1 },
    { position: "bottom right", row: 2, col: 2 },
];

// Map display values to internal values
const normalizePosition = (pos: string): string => {
    const normalized = pos.toLowerCase().trim();
    // Handle single values
    if (normalized === "top") return "top";
    if (normalized === "bottom") return "bottom";
    if (normalized === "left") return "left";
    if (normalized === "right") return "right";
    if (normalized === "center" || normalized === "center center") return "center";
    return normalized;
};

export const PositionSelector: React.FC<PositionSelectorProps> = ({
    value,
    onChange,
    label,
    className = "",
}) => {
    const normalizedValue = normalizePosition(value);

    return (
        <div className={`space-y-2 ${className}`}>
            {label && (
                <label className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
                    {label}
                </label>
            )}
            <div className="inline-grid grid-cols-3 gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
                {POSITIONS.map(({ position }) => {
                    const isSelected = normalizePosition(position) === normalizedValue || 
                        (position === "center" && (normalizedValue === "center" || normalizedValue === "center center"));
                    
                    return (
                        <button
                            key={position}
                            type="button"
                            onClick={() => onChange(position)}
                            className={`
                                w-8 h-8 rounded-lg transition-all duration-200
                                flex items-center justify-center
                                ${isSelected 
                                    ? "bg-brand-500 shadow-md scale-105" 
                                    : "bg-white dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                                }
                            `}
                            title={position}
                        >
                            <div 
                                className={`
                                    w-2 h-2 rounded-full transition-colors
                                    ${isSelected 
                                        ? "bg-white" 
                                        : "bg-neutral-400 dark:bg-neutral-500"
                                    }
                                `}
                            />
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default PositionSelector;

