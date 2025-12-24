import { clsx, type ClassValue } from "clsx";
import { InputHTMLAttributes, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    label?: string;
    id: string; // id is required for accessibility with label
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, error, label, id, ...props }, ref) => {
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
                <div className="relative">
                    <input
                        id={id}
                        ref={ref}
                        className={cn(
                            "flex w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 text-sm text-neutral-900 dark:text-white ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-600 transition-all shadow-sm",
                            error &&
                                "border-red-500 focus-visible:ring-red-500",
                            className
                        )}
                        {...props}
                    />
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

Input.displayName = "Input";
