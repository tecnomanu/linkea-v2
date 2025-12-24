import { clsx, type ClassValue } from "clsx";
import { TextareaHTMLAttributes, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: string;
    label?: string;
    id: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
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
                <textarea
                    id={id}
                    ref={ref}
                    className={cn(
                        "flex w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 text-sm text-neutral-900 dark:text-white ring-offset-white placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-600 transition-all shadow-sm resize-none",
                        error && "border-red-500 focus-visible:ring-red-500",
                        className
                    )}
                    {...props}
                />
                {error && (
                    <p className="mt-1.5 text-xs text-red-500 font-medium ml-1 animate-in slide-in-from-top-1 fade-in duration-200">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Textarea.displayName = "Textarea";

