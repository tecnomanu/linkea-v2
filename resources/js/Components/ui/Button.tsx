import { clsx, type ClassValue } from "clsx";
import { Loader2 } from "lucide-react";
import React, { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "link";
    size?: "sm" | "md" | "lg" | "icon";
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = "primary",
            size = "md",
            isLoading,
            children,
            disabled,
            ...props
        },
        ref
    ) => {
        const variants = {
            primary:
                "bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/20 border border-transparent",
            secondary:
                "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 shadow-sm",
            outline:
                "bg-transparent border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white",
            ghost: "bg-transparent text-neutral-600 dark:text-neutral-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10",
            danger: "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20",
            link: "text-brand-500 underline-offset-4 hover:underline p-0 h-auto font-normal",
        };

        const sizes = {
            sm: "h-8 px-3 text-xs rounded-lg",
            md: "h-10 px-4 py-2 rounded-xl",
            lg: "h-12 px-8 text-lg rounded-2xl",
            icon: "h-10 w-10 p-0 rounded-xl flex items-center justify-center",
        };

        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={cn(
                    "inline-flex items-center justify-center font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
);

Button.displayName = "Button";
