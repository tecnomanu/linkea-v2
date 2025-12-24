import { clsx, type ClassValue } from "clsx";
import React from "react";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type BadgeVariant =
    | "default"
    | "success"
    | "warning"
    | "error"
    | "info"
    | "brand";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant;
    /** Makes badge pill shaped */
    pill?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
    default:
        "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300",
    success:
        "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
    warning:
        "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
    error: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
    info: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
    brand: "bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400",
};

export const Badge: React.FC<BadgeProps> = ({
    className,
    variant = "default",
    pill = false,
    children,
    ...props
}) => {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold",
                pill ? "rounded-full" : "rounded-lg",
                variantClasses[variant],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
};

Badge.displayName = "Badge";

