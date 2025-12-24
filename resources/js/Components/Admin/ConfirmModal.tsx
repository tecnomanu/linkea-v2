import { ConfirmDialog } from "@/Components/ui/ConfirmDialog";
import React from "react";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
    variant?: "danger" | "warning" | "info";
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    isLoading = false,
    variant = "danger",
}) => {
    return (
        <ConfirmDialog
            isOpen={isOpen}
            onClose={onClose}
            variant={variant}
            title={title}
            message={message}
            cancelText={cancelText}
            isLoading={isLoading}
            primaryAction={{
                label: confirmText,
                onClick: onConfirm,
                variant: variant === "danger" ? "danger" : "primary",
                isLoading,
            }}
        />
    );
};
