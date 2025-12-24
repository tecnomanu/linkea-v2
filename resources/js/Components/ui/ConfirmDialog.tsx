import { DialogTitle } from "@headlessui/react";
import { clsx, type ClassValue } from "clsx";
import {
    AlertTriangle,
    CheckCircle,
    HelpCircle,
    Info,
    LucideIcon,
    XCircle,
} from "lucide-react";
import React, { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { Button } from "./Button";
import { Dialog, DialogBody, DialogContent } from "./Dialog";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// ============================================================================
// Types
// ============================================================================

type ConfirmDialogVariant =
    | "warning"
    | "danger"
    | "success"
    | "info"
    | "question";

interface ConfirmDialogAction {
    label: string;
    onClick: () => void | Promise<void>;
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
    isLoading?: boolean;
}

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    /** Visual variant determines icon and colors. Default: 'warning' */
    variant?: ConfirmDialogVariant;
    /** Custom icon to override variant default */
    icon?: LucideIcon;
    /** Dialog title */
    title: string;
    /** Dialog message/description */
    message?: string | ReactNode;
    /** Primary action button */
    primaryAction?: ConfirmDialogAction;
    /** Secondary action button (stacked below primary) */
    secondaryAction?: ConfirmDialogAction;
    /** Cancel text. Pass null to hide cancel button. Default: 'Cancelar' */
    cancelText?: string | null;
    /** Disable all interactions while loading */
    isLoading?: boolean;
    /** Close on outside click. Default: true */
    closeOnOutsideClick?: boolean;
}

// ============================================================================
// Variant Configuration
// ============================================================================

const variantConfig: Record<
    ConfirmDialogVariant,
    { icon: LucideIcon; iconBg: string; iconColor: string }
> = {
    warning: {
        icon: AlertTriangle,
        iconBg: "bg-amber-100 dark:bg-amber-900/30",
        iconColor: "text-amber-600 dark:text-amber-400",
    },
    danger: {
        icon: XCircle,
        iconBg: "bg-red-100 dark:bg-red-900/30",
        iconColor: "text-red-600 dark:text-red-400",
    },
    success: {
        icon: CheckCircle,
        iconBg: "bg-green-100 dark:bg-green-900/30",
        iconColor: "text-green-600 dark:text-green-400",
    },
    info: {
        icon: Info,
        iconBg: "bg-blue-100 dark:bg-blue-900/30",
        iconColor: "text-blue-600 dark:text-blue-400",
    },
    question: {
        icon: HelpCircle,
        iconBg: "bg-brand-100 dark:bg-brand-900/30",
        iconColor: "text-brand-600 dark:text-brand-400",
    },
};

// ============================================================================
// ConfirmDialog Component
// ============================================================================

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    onClose,
    variant = "warning",
    icon: CustomIcon,
    title,
    message,
    primaryAction,
    secondaryAction,
    cancelText = "Cancelar",
    isLoading = false,
    closeOnOutsideClick = true,
}) => {
    const config = variantConfig[variant];
    const IconComponent = CustomIcon || config.icon;

    // Determine if any action is loading
    const anyLoading =
        isLoading || primaryAction?.isLoading || secondaryAction?.isLoading;

    const handlePrimaryClick = async () => {
        if (primaryAction?.onClick) {
            await primaryAction.onClick();
        }
    };

    const handleSecondaryClick = async () => {
        if (secondaryAction?.onClick) {
            await secondaryAction.onClick();
        }
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            closeOnOutsideClick={closeOnOutsideClick && !anyLoading}
            zIndex={200}
        >
            <DialogContent maxWidth="md">
                <DialogBody className="p-6">
                    {/* Icon */}
                    <div
                        className={cn(
                            "mx-auto flex h-16 w-16 items-center justify-center rounded-full mb-4",
                            config.iconBg
                        )}
                    >
                        <IconComponent
                            className={cn("h-8 w-8", config.iconColor)}
                        />
                    </div>

                    {/* Title */}
                    <DialogTitle
                        as="h3"
                        className="text-xl font-bold text-center text-neutral-900 dark:text-white mb-2"
                    >
                        {title}
                    </DialogTitle>

                    {/* Message */}
                    {message && (
                        <div className="text-center text-neutral-600 dark:text-neutral-400 mb-6">
                            {typeof message === "string" ? (
                                <p>{message}</p>
                            ) : (
                                message
                            )}
                        </div>
                    )}

                    {/* Actions - Stacked vertically */}
                    <div className="flex flex-col gap-3">
                        {/* Primary Action */}
                        {primaryAction && (
                            <Button
                                variant={primaryAction.variant || "primary"}
                                onClick={handlePrimaryClick}
                                isLoading={primaryAction.isLoading}
                                disabled={anyLoading}
                                className="w-full py-3"
                            >
                                {primaryAction.label}
                            </Button>
                        )}

                        {/* Secondary Action */}
                        {secondaryAction && (
                            <Button
                                variant={secondaryAction.variant || "secondary"}
                                onClick={handleSecondaryClick}
                                isLoading={secondaryAction.isLoading}
                                disabled={anyLoading}
                                className="w-full py-3"
                            >
                                {secondaryAction.label}
                            </Button>
                        )}

                        {/* Cancel */}
                        {cancelText !== null && (
                            <button
                                onClick={onClose}
                                disabled={anyLoading}
                                className="w-full px-4 py-2 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 font-medium text-sm transition-colors disabled:opacity-50"
                            >
                                {cancelText}
                            </button>
                        )}
                    </div>
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
};
