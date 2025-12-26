import { HandleStatus } from "@/hooks/useHandleValidation";
import { usePage } from "@inertiajs/react";
import { Check, Loader2, X } from "lucide-react";
import { forwardRef, InputHTMLAttributes, useMemo } from "react";

interface HandleInputProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
    /** Current handle value (without @) */
    value: string;
    /** Change handler - receives raw input value */
    onChange: (value: string) => void;
    /** Validation status */
    status: HandleStatus;
    /** Validation message (only shown for errors or when available) */
    message?: string;
    /** Label text */
    label?: string;
    /** Optional custom prefix (defaults to app URL) */
    prefix?: string;
    /** Server-side error message */
    error?: string;
    /** Whether the value has changed from original */
    hasChanged?: boolean;
}

/**
 * Specialized input for handle/username with prefix and validation indicators.
 * Shows app_url/ prefix, real-time validation status (check/X/loader).
 * 
 * Visual states:
 * - current: check icon (neutral color), no border highlight, no message
 * - available: check icon (green), green border, "Disponible" message
 * - checking: loader icon, neutral border
 * - taken/invalid: X icon (red), red border, error message
 */
export const HandleInput = forwardRef<HTMLInputElement, HandleInputProps>(
    (
        {
            value,
            onChange,
            status,
            message,
            label,
            prefix: customPrefix,
            error,
            hasChanged = false,
            className,
            id = "handle",
            placeholder = "tu-linkea",
            ...props
        },
        ref
    ) => {
        const { appUrl } = usePage<{ appUrl?: string }>().props;

        // Generate display prefix
        const displayPrefix = useMemo(() => {
            if (customPrefix) return customPrefix;
            const baseUrl = appUrl?.replace(/^https?:\/\//, "") || "linkea.ar";
            return `${baseUrl}/`;
        }, [appUrl, customPrefix]);

        // Generate preview URL
        const previewUrl = useMemo(() => {
            const baseUrl = appUrl?.replace(/^https?:\/\//, "") || "linkea.ar";
            return `${baseUrl}/${value || placeholder}`;
        }, [appUrl, value, placeholder]);

        // Determine visual state
        const hasError = error || status === "taken" || status === "invalid";
        const isAvailable = status === "available";
        const isCurrent = status === "current";
        const isChecking = status === "checking";
        const showIndicator = value.length >= 3;

        // Border color based on state
        const borderClass = hasError
            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
            : isAvailable
            ? "border-green-500 focus:border-green-500 focus:ring-green-500/20"
            : "border-neutral-300 dark:border-neutral-600 focus:border-brand-500 focus:ring-brand-500/20";

        return (
            <div className="w-full space-y-1.5">
                {label && (
                    <label
                        htmlFor={id}
                        className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                    >
                        {label}
                    </label>
                )}

                <div className="flex items-stretch relative">
                    {/* Prefix badge */}
                    <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-neutral-300 dark:border-neutral-600 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm font-medium select-none">
                        {displayPrefix}
                    </span>

                    {/* Input field */}
                    <input
                        ref={ref}
                        id={id}
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        className={`flex-1 px-4 py-3 pr-10 rounded-r-xl border text-sm font-bold transition-colors
                            ${borderClass}
                            bg-white dark:bg-neutral-900 
                            text-neutral-900 dark:text-white 
                            placeholder:text-neutral-400 dark:placeholder:text-neutral-600
                            focus:outline-none focus:ring-2
                            ${className || ""}`}
                        {...props}
                    />

                    {/* Status indicator icon */}
                    {showIndicator && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            {isChecking && (
                                <Loader2
                                    size={18}
                                    className="text-neutral-400 animate-spin"
                                />
                            )}
                            {isCurrent && (
                                <Check
                                    size={18}
                                    className="text-neutral-400"
                                    strokeWidth={3}
                                />
                            )}
                            {isAvailable && (
                                <Check
                                    size={18}
                                    className="text-green-500"
                                    strokeWidth={3}
                                />
                            )}
                            {hasError && (
                                <X size={18} className="text-red-500" strokeWidth={3} />
                            )}
                        </div>
                    )}
                </div>

                {/* Messages - keep it simple */}
                <div className="min-h-[20px]">
                    {/* Server error */}
                    {error && (
                        <p className="text-sm text-red-500 animate-in slide-in-from-top-1 fade-in duration-200">
                            {error}
                        </p>
                    )}

                    {/* Validation error (taken/invalid) */}
                    {!error && hasError && message && (
                        <p className="text-sm text-red-500">{message}</p>
                    )}

                    {/* Available - show URL preview */}
                    {!error && isAvailable && (
                        <p className="text-xs text-green-600 dark:text-green-400">
                            {message || "Disponible"} · {previewUrl}
                        </p>
                    )}

                    {/* Current (unchanged) - just show URL, no extra text */}
                    {!error && isCurrent && value && (
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            {previewUrl}
                        </p>
                    )}
                </div>
            </div>
        );
    }
);

HandleInput.displayName = "HandleInput";
