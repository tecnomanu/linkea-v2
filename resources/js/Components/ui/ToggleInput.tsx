import { clsx, type ClassValue } from "clsx";
import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Mini toggle component for inline use
const MiniToggle: React.FC<{
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    title?: string;
}> = ({ checked, onChange, disabled, title }) => (
    <button
        type="button"
        role="switch"
        aria-checked={checked}
        title={title}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
            "relative w-9 h-5 rounded-full transition-colors duration-200 flex-shrink-0",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50",
            checked ? "bg-brand-500" : "bg-neutral-300 dark:bg-neutral-600",
            disabled && "opacity-50 cursor-not-allowed"
        )}
    >
        <span
            className={cn(
                "absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200",
                checked && "translate-x-4"
            )}
        />
    </button>
);

// --- ToggleInput ---

interface ToggleInputProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
    id: string;
    label?: string;
    error?: string;
    /** Current input value */
    value: string;
    /** Called when input value changes */
    onChange: (value: string) => void;
    /** Whether the field is enabled (toggle state) */
    enabled?: boolean;
    /** Called when toggle state changes */
    onEnabledChange?: (enabled: boolean) => void;
    /** Show the toggle switch */
    showToggle?: boolean;
    /** Tooltip for toggle */
    toggleTitle?: string;
}

export const ToggleInput = forwardRef<HTMLInputElement, ToggleInputProps>(
    (
        {
            id,
            label,
            error,
            value,
            onChange,
            enabled = true,
            onEnabledChange,
            showToggle = true,
            toggleTitle = "Activar/desactivar",
            className,
            ...props
        },
        ref
    ) => {
        const isDisabled = !enabled || props.disabled;

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={id}
                        className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-1.5 ml-1"
                    >
                        {label}
                    </label>
                )}
                <div
                    className={cn(
                        "flex items-center gap-2 rounded-xl border bg-white dark:bg-neutral-900 transition-all shadow-sm",
                        "focus-within:ring-2 focus-within:ring-brand-500 focus-within:ring-offset-2",
                        isDisabled
                            ? "border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950"
                            : "border-neutral-200 dark:border-neutral-700",
                        error && "border-red-500 focus-within:ring-red-500"
                    )}
                >
                    <input
                        id={id}
                        ref={ref}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        disabled={isDisabled}
                        className={cn(
                            "flex-1 bg-transparent px-4 py-3 text-sm text-neutral-900 dark:text-white",
                            "placeholder:text-neutral-400 dark:placeholder:text-neutral-600",
                            "focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                            className
                        )}
                        {...props}
                    />
                    {showToggle && onEnabledChange && (
                        <div className="pr-3">
                            <MiniToggle
                                checked={enabled}
                                onChange={onEnabledChange}
                                title={toggleTitle}
                            />
                        </div>
                    )}
                </div>
                {error && (
                    <p className="mt-1.5 text-xs text-red-500 font-medium ml-1 animate-in slide-in-from-top-1 fade-in duration-200">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

ToggleInput.displayName = "ToggleInput";

// --- ToggleTextarea ---

interface ToggleTextareaProps
    extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
    id: string;
    label?: string;
    error?: string;
    /** Current textarea value */
    value: string;
    /** Called when textarea value changes */
    onChange: (value: string) => void;
    /** Whether the field is enabled (toggle state) */
    enabled?: boolean;
    /** Called when toggle state changes */
    onEnabledChange?: (enabled: boolean) => void;
    /** Show the toggle switch */
    showToggle?: boolean;
    /** Tooltip for toggle */
    toggleTitle?: string;
}

export const ToggleTextarea = forwardRef<
    HTMLTextAreaElement,
    ToggleTextareaProps
>(
    (
        {
            id,
            label,
            error,
            value,
            onChange,
            enabled = true,
            onEnabledChange,
            showToggle = true,
            toggleTitle = "Activar/desactivar",
            className,
            rows = 2,
            ...props
        },
        ref
    ) => {
        const isDisabled = !enabled || props.disabled;

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={id}
                        className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-1.5 ml-1"
                    >
                        {label}
                    </label>
                )}
                <div
                    className={cn(
                        "flex items-start gap-2 rounded-xl border bg-white dark:bg-neutral-900 transition-all shadow-sm",
                        "focus-within:ring-2 focus-within:ring-brand-500 focus-within:ring-offset-2",
                        isDisabled
                            ? "border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950"
                            : "border-neutral-200 dark:border-neutral-700",
                        error && "border-red-500 focus-within:ring-red-500"
                    )}
                >
                    <textarea
                        id={id}
                        ref={ref}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        disabled={isDisabled}
                        rows={rows}
                        className={cn(
                            "flex-1 bg-transparent px-4 py-3 text-sm text-neutral-900 dark:text-white resize-none",
                            "placeholder:text-neutral-400 dark:placeholder:text-neutral-600",
                            "focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                            className
                        )}
                        {...props}
                    />
                    {showToggle && onEnabledChange && (
                        <div className="pr-3 pt-3">
                            <MiniToggle
                                checked={enabled}
                                onChange={onEnabledChange}
                                title={toggleTitle}
                            />
                        </div>
                    )}
                </div>
                {error && (
                    <p className="mt-1.5 text-xs text-red-500 font-medium ml-1 animate-in slide-in-from-top-1 fade-in duration-200">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

ToggleTextarea.displayName = "ToggleTextarea";

