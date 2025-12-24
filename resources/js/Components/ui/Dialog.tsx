import {
    DialogBackdrop,
    DialogPanel,
    DialogTitle,
    Dialog as HeadlessDialog,
} from "@headlessui/react";
import { clsx, type ClassValue } from "clsx";
import { X } from "lucide-react";
import React, { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// ============================================================================
// Dialog Root Component
// ============================================================================

interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    /** Enable backdrop blur effect. Default: true */
    backdropBlur?: boolean;
    /** Show dark overlay. Default: true */
    showOverlay?: boolean;
    /** Close dialog on outside click. Default: true */
    closeOnOutsideClick?: boolean;
    /** Additional class for the container */
    className?: string;
    /** Z-index level. Default: 100 */
    zIndex?: number;
}

export const Dialog: React.FC<DialogProps> = ({
    isOpen,
    onClose,
    children,
    backdropBlur = true,
    showOverlay = true,
    closeOnOutsideClick = true,
    className,
    zIndex = 100,
}) => {
    const handleClose = () => {
        if (closeOnOutsideClick) {
            onClose();
        }
    };

    return (
        <HeadlessDialog
            open={isOpen}
            onClose={handleClose}
            className={cn("relative", className)}
            style={{ zIndex }}
        >
            {/* Backdrop */}
            <DialogBackdrop
                transition
                className={cn(
                    "fixed inset-0 transition-opacity duration-300 ease-out data-[closed]:opacity-0",
                    showOverlay && "bg-black/50",
                    backdropBlur && "backdrop-blur-sm"
                )}
            />

            {/* Container */}
            <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                    {children}
                </div>
            </div>
        </HeadlessDialog>
    );
};

// ============================================================================
// Dialog Content (Panel)
// ============================================================================

interface DialogContentProps {
    children: ReactNode;
    /** Max width class. Default: 'max-w-lg' */
    maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full";
    /** Additional class */
    className?: string;
}

const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    full: "max-w-full",
};

export const DialogContent: React.FC<DialogContentProps> = ({
    children,
    maxWidth = "lg",
    className,
}) => {
    return (
        <DialogPanel
            transition
            className={cn(
                "w-full transform overflow-hidden rounded-3xl bg-white dark:bg-neutral-900 shadow-2xl",
                "transition-all duration-300 ease-out data-[closed]:opacity-0 data-[closed]:scale-95",
                maxWidthClasses[maxWidth],
                className
            )}
        >
            {children}
        </DialogPanel>
    );
};

// ============================================================================
// Dialog Header
// ============================================================================

interface DialogHeaderProps {
    children?: ReactNode;
    title?: string;
    description?: string;
    onClose?: () => void;
    /** Show close button. Default: true when onClose is provided */
    showClose?: boolean;
    /** Additional class */
    className?: string;
}

export const DialogHeader: React.FC<DialogHeaderProps> = ({
    children,
    title,
    description,
    onClose,
    showClose = !!onClose,
    className,
}) => {
    // Custom children mode - full control
    if (children) {
        return (
            <div
                className={cn(
                    "border-b border-neutral-200 dark:border-neutral-800 p-6",
                    className
                )}
            >
                {children}
            </div>
        );
    }

    // Standard title/description mode
    return (
        <div
            className={cn(
                "flex justify-between items-start p-6 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50",
                className
            )}
        >
            <div className="flex-1">
                {title && (
                    <DialogTitle className="text-xl font-bold text-neutral-900 dark:text-white">
                        {title}
                    </DialogTitle>
                )}
                {description && (
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                        {description}
                    </p>
                )}
            </div>
            {showClose && onClose && (
                <DialogCloseButton onClick={onClose} className="ml-4" />
            )}
        </div>
    );
};

// ============================================================================
// Dialog Body
// ============================================================================

interface DialogBodyProps {
    children: ReactNode;
    /** Additional class */
    className?: string;
    /** Add padding. Default: true */
    padding?: boolean;
}

export const DialogBody: React.FC<DialogBodyProps> = ({
    children,
    className,
    padding = true,
}) => {
    return <div className={cn(padding && "p-6", className)}>{children}</div>;
};

// ============================================================================
// Dialog Footer
// ============================================================================

interface DialogFooterProps {
    children: ReactNode;
    /** Additional class */
    className?: string;
}

export const DialogFooter: React.FC<DialogFooterProps> = ({
    children,
    className,
}) => {
    return (
        <div
            className={cn(
                "border-t border-neutral-200 dark:border-neutral-800 p-4 flex gap-3",
                className
            )}
        >
            {children}
        </div>
    );
};

// ============================================================================
// Dialog Close Button
// ============================================================================

interface DialogCloseButtonProps {
    onClick: () => void;
    className?: string;
    /** Visual style. Default: 'floating' */
    variant?: "floating" | "minimal";
}

export const DialogCloseButton: React.FC<DialogCloseButtonProps> = ({
    onClick,
    className,
    variant = "floating",
}) => {
    const variants = {
        floating:
            "p-2 bg-white dark:bg-neutral-800 rounded-full text-neutral-400 hover:text-neutral-900 dark:hover:text-white shadow-sm border border-neutral-100 dark:border-neutral-700 transition-colors",
        minimal:
            "p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors text-neutral-500",
    };

    return (
        <button onClick={onClick} className={cn(variants[variant], className)}>
            <X size={20} />
        </button>
    );
};
