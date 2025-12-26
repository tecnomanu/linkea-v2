import { Link } from "@inertiajs/react";
import { clsx, type ClassValue } from "clsx";
import React, { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type NavLinkVariant = "panel" | "admin";

interface NavLinkProps {
    /** Route URL */
    href: string;
    /** Icon element */
    icon: ReactNode;
    /** Label text */
    label: string;
    /** Whether this link is currently active */
    isActive?: boolean;
    /** Color variant: panel (brand/amber) or admin (red) */
    variant?: NavLinkVariant;
    /** Show only icon (for collapsed sidebar) */
    iconOnly?: boolean;
    /** Show tooltip on hover (for iconOnly mode) */
    showTooltip?: boolean;
    /** Additional click handler */
    onClick?: () => void;
    /** Additional classes */
    className?: string;
}

// Color configurations per variant
const variantStyles = {
    panel: {
        active: "bg-neutral-100 dark:bg-neutral-800 text-brand-500",
        inactive:
            "text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/50",
        indicator: "bg-brand-500",
    },
    admin: {
        active: "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400",
        inactive:
            "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800",
        indicator: "bg-red-500",
    },
};

export const NavLink: React.FC<NavLinkProps> = ({
    href,
    icon,
    label,
    isActive = false,
    variant = "panel",
    iconOnly = false,
    showTooltip = true,
    onClick,
    className,
}) => {
    const styles = variantStyles[variant];

    // Icon-only mode (collapsed sidebar)
    if (iconOnly) {
        return (
            <Link
                href={href}
                onClick={onClick}
                className={cn(
                    "group relative flex items-center justify-center w-full aspect-square rounded-2xl transition-all duration-300",
                    isActive ? styles.active : styles.inactive,
                    className
                )}
                data-tooltip={showTooltip ? label : undefined}
                data-tooltip-position="right"
            >
                {icon}

                {/* Active Indicator */}
                {isActive && (
                    <div
                        className={cn(
                            "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full",
                            styles.indicator
                        )}
                    />
                )}
            </Link>
        );
    }

    // Full mode (expanded sidebar with text)
    return (
        <Link
            href={href}
            onClick={onClick}
            className={cn(
                "group relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                isActive ? styles.active : styles.inactive,
                className
            )}
        >
            {icon}
            <span className="text-sm font-medium">{label}</span>

            {/* Active Indicator */}
            {isActive && (
                <div
                    className={cn(
                        "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full",
                        styles.indicator
                    )}
                />
            )}
        </Link>
    );
};

// Mobile variant - expands when active
interface MobileNavLinkProps
    extends Omit<NavLinkProps, "iconOnly" | "showTooltip"> {
    /** Expand to show label when active */
    expandOnActive?: boolean;
}

export const MobileNavLink: React.FC<MobileNavLinkProps> = ({
    href,
    icon,
    label,
    isActive = false,
    variant = "panel",
    onClick,
    expandOnActive = true,
    className,
}) => {
    const baseStyles = {
        panel: {
            active: "flex-grow bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 font-bold px-4",
            inactive:
                "w-12 text-neutral-400 dark:text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-neutral-600",
        },
        admin: {
            active: "flex-grow bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-bold px-4",
            inactive:
                "w-12 text-neutral-400 dark:text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-neutral-600",
        },
    };

    const styles = baseStyles[variant];

    return (
        <Link
            href={href}
            onClick={onClick}
            className={cn(
                "flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all duration-300 ease-out",
                isActive ? styles.active : styles.inactive,
                className
            )}
        >
            {icon}
            {expandOnActive && isActive && (
                <span className="text-sm whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">
                    {label}
                </span>
            )}
        </Link>
    );
};
