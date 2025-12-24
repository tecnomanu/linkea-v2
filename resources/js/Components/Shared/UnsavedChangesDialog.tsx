import { ConfirmDialog } from "@/Components/ui/ConfirmDialog";
import { useAutoSaveContext } from "@/contexts/AutoSaveContext";

export function UnsavedChangesDialog() {
    const {
        showNavigationDialog,
        confirmNavigation,
        cancelNavigation,
        saveAllChanges,
        isSaving,
    } = useAutoSaveContext();

    const handleSaveAndContinue = async () => {
        await saveAllChanges();
        confirmNavigation();
    };

    return (
        <ConfirmDialog
            isOpen={showNavigationDialog}
            onClose={cancelNavigation}
            variant="warning"
            title="Cambios sin guardar"
            message="Tienes cambios que no se han guardado. ¿Qué deseas hacer?"
            isLoading={isSaving}
            closeOnOutsideClick={!isSaving}
            primaryAction={{
                label: isSaving ? "Guardando..." : "Guardar y continuar",
                onClick: handleSaveAndContinue,
                isLoading: isSaving,
            }}
            secondaryAction={{
                label: "Descartar cambios",
                onClick: confirmNavigation,
                variant: "secondary",
            }}
        />
    );
}
