import { clsx, type ClassValue } from "clsx";
import React from "react";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Padding size */
    padding?: "none" | "sm" | "md" | "lg";
    /** Whether the card has a border */
    bordered?: boolean;
    /** Whether the card has shadow */
    shadow?: boolean;
}

const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6 md:p-8",
    lg: "p-8 md:p-10",
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    (
        {
            className,
            padding = "md",
            bordered = true,
            shadow = true,
            children,
            ...props
        },
        ref
    ) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "bg-white dark:bg-neutral-900 rounded-[32px] overflow-hidden transition-colors",
                    bordered && "border border-neutral-100 dark:border-neutral-800",
                    shadow && "shadow-soft-xl",
                    paddingClasses[padding],
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = "Card";

// Card Header component for sections with icon and title
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Header icon */
    icon?: React.ReactNode;
    /** Icon background color class */
    iconBg?: string;
    /** Icon text color class */
    iconColor?: string;
    /** Main title */
    title: string;
    /** Subtitle/description */
    subtitle?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
    className,
    icon,
    iconBg = "bg-brand-50 dark:bg-brand-900/30",
    iconColor = "text-brand-600 dark:text-brand-400",
    title,
    subtitle,
    ...props
}) => {
    return (
        <div
            className={cn(
                "flex items-center gap-3 p-6 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50",
                className
            )}
            {...props}
        >
            {icon && (
                <div className={cn("p-2 rounded-xl", iconBg, iconColor)}>
                    {icon}
                </div>
            )}
            <div>
                <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                    {title}
                </h2>
                {subtitle && (
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );
};

CardHeader.displayName = "CardHeader";

// Card Body component
interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardBody: React.FC<CardBodyProps> = ({
    className,
    children,
    ...props
}) => {
    return (
        <div className={cn("p-6 md:p-8", className)} {...props}>
            {children}
        </div>
    );
};

CardBody.displayName = "CardBody";

// Card Footer component
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardFooter: React.FC<CardFooterProps> = ({
    className,
    children,
    ...props
}) => {
    return (
        <div
            className={cn(
                "p-4 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

CardFooter.displayName = "CardFooter";

