import { Button } from "@/Components/ui/Button";
import { Toggle } from "@/Components/ui/Toggle";
import { useAutoSaveContext } from "@/contexts/AutoSaveContext";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { Check, Save, Settings } from "lucide-react";

// Helper to format last saved time
function formatLastSaved(lastSaved: Date | null): string {
    if (!lastSaved) return "Nunca";
    const now = new Date();
    const diff = now.getTime() - lastSaved.getTime();
    const seconds = Math.floor(diff / 1000);

    if (seconds < 60) return "Hace un momento";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `Hace ${minutes} minuto${minutes > 1 ? "s" : ""}`;
    const hours = Math.floor(minutes / 60);
    return `Hace ${hours} hora${hours > 1 ? "s" : ""}`;
}

// Save status indicator component
export function SaveStatus() {
    const { isSaving, lastSaved, hasChanges } = useAutoSaveContext();

    return (
        <div className="flex items-center gap-2 text-xs">
            {isSaving ? (
                <>
                    <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-neutral-600 dark:text-neutral-400">
                        Guardando...
                    </span>
                </>
            ) : hasChanges ? (
                <>
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                    <span className="text-amber-600 dark:text-amber-400">
                        Cambios pendientes
                    </span>
                </>
            ) : lastSaved ? (
                <>
                    <Check size={16} className="text-green-500" />
                    <span className="text-neutral-600 dark:text-neutral-400">
                        Guardado {formatLastSaved(lastSaved)}
                    </span>
                </>
            ) : (
                <span className="text-neutral-400 dark:text-neutral-500">
                    Sin cambios
                </span>
            )}
        </div>
    );
}

export function AutoSaveSettings() {
    const { autoSaveEnabled, setAutoSaveEnabled } = useAutoSaveContext();

    return (
        <Popover className="relative">
            <PopoverButton className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors outline-none">
                <Settings
                    size={20}
                    className="text-neutral-600 dark:text-neutral-400"
                />
            </PopoverButton>

            <PopoverPanel
                transition
                anchor="right start"
                className="z-50 w-72 origin-bottom-left rounded-2xl bg-white dark:bg-neutral-900 shadow-lg border border-neutral-200 dark:border-neutral-700 p-4 transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
            >
                <div className="flex flex-col gap-4">
                    {/* Header */}
                    <div>
                        <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                            Configuración
                        </h3>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                            Personaliza tu experiencia
                        </p>
                    </div>

                    {/* Auto Save Toggle */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800">
                        <div className="flex-1">
                            <div className="text-sm font-medium text-neutral-900 dark:text-white">
                                Auto Guardado
                            </div>
                            <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                                Guarda cambios automáticamente
                            </div>
                        </div>
                        <Toggle
                            checked={autoSaveEnabled}
                            onChange={setAutoSaveEnabled}
                            size="md"
                        />
                    </div>

                    {/* Save Status */}
                    <SaveStatus />
                </div>
            </PopoverPanel>
        </Popover>
    );
}

// Alternative: Badge version for showing status inline
export function AutoSaveBadge() {
    const { autoSaveEnabled, isSaving, hasChanges, lastSaved } =
        useAutoSaveContext();

    // When autoSave is enabled, show auto-save status
    if (autoSaveEnabled) {
        return (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400">
                {isSaving ? (
                    <>
                        <div className="w-3 h-3 border-2 border-green-600 dark:border-green-400 border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs font-medium">
                            Guardando...
                        </span>
                    </>
                ) : hasChanges ? (
                    <>
                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                        <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                            Cambios pendientes
                        </span>
                    </>
                ) : (
                    <>
                        <Check size={14} />
                        <span className="text-xs font-medium">
                            Auto Guardado activado
                        </span>
                    </>
                )}
            </div>
        );
    }

    // When autoSave is disabled, show last saved or no changes state
    if (lastSaved && !hasChanges) {
        return (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                <Check size={14} className="text-green-500" />
                <span className="text-xs font-medium">
                    Guardado {formatLastSaved(lastSaved)}
                </span>
            </div>
        );
    }

    // No changes and never saved - show nothing
    return null;
}

// Manual Save Button (always visible when auto-save is disabled)
export function ManualSaveButton({ onClick }: { onClick: () => void }) {
    const { autoSaveEnabled, isSaving, hasChanges } = useAutoSaveContext();

    // Don't show when autoSave is enabled
    if (autoSaveEnabled) return null;

    return (
        <div className="flex items-center gap-3">
            {/* Pending changes indicator */}
            {hasChanges && !isSaving && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                    <span className="text-xs font-medium">
                        Cambios pendientes
                    </span>
                </div>
            )}

            {/* Saving indicator */}
            {isSaving && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400">
                    <div className="w-3 h-3 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-medium">Guardando...</span>
                </div>
            )}

            {/* Save button */}
            <Button
                onClick={onClick}
                disabled={!hasChanges}
                isLoading={isSaving}
            >
                <Save size={16} className="mr-2" />
                Guardar
            </Button>
        </div>
    );
}
