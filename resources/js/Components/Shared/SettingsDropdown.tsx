import { Toggle } from "@/Components/ui/Toggle";
import { useAutoSaveContext } from "@/contexts/AutoSaveContext";
import {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    Transition,
} from "@headlessui/react";
import { Check, Save, Settings } from "lucide-react";
import { Fragment } from "react";

/**
 * Settings dropdown for sidebar - contains system preferences
 * Currently includes: Auto-save toggle
 * Future: More settings can be added here
 */
export function SettingsDropdown() {
    const { autoSaveEnabled, setAutoSaveEnabled, isSaving, lastSaved, hasChanges } =
        useAutoSaveContext();

    const formatLastSaved = () => {
        if (!lastSaved) return "Nunca";
        const now = new Date();
        const diff = now.getTime() - lastSaved.getTime();
        const seconds = Math.floor(diff / 1000);

        if (seconds < 60) return "Hace un momento";
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60)
            return `Hace ${minutes} minuto${minutes > 1 ? "s" : ""}`;
        const hours = Math.floor(minutes / 60);
        return `Hace ${hours} hora${hours > 1 ? "s" : ""}`;
    };

    return (
        <Menu as="div" className="relative">
            <MenuButton className="group flex items-center justify-center w-10 h-10 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors relative">
                <Settings
                    size={20}
                    className="text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors"
                />
                {/* Indicator dot when there are pending changes */}
                {hasChanges && !autoSaveEnabled && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                )}
                {/* Tooltip */}
                <span className="absolute left-14 bg-neutral-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                    Configuración
                </span>
            </MenuButton>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <MenuItems className="absolute left-14 bottom-0 w-72 origin-bottom-left bg-white dark:bg-neutral-900 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-700 focus:outline-none z-50 p-4">
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
                        <MenuItem disabled>
                            {() => (
                                <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white dark:bg-neutral-700 rounded-lg shadow-sm">
                                            <Save size={16} className="text-brand-500" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-neutral-900 dark:text-white">
                                                Auto Guardado
                                            </div>
                                            <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                                                Guarda automáticamente
                                            </div>
                                        </div>
                                    </div>
                                    <Toggle
                                        checked={autoSaveEnabled}
                                        onChange={setAutoSaveEnabled}
                                        size="md"
                                    />
                                </div>
                            )}
                        </MenuItem>

                        {/* Save Status */}
                        <div className="flex items-center gap-2 text-xs px-1">
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
                                        Guardado {formatLastSaved()}
                                    </span>
                                </>
                            ) : (
                                <span className="text-neutral-400 dark:text-neutral-500">
                                    Sin cambios recientes
                                </span>
                            )}
                        </div>

                        {/* Divider */}
                        <div className="border-t border-neutral-200 dark:border-neutral-700" />

                        {/* Future settings placeholder */}
                        <p className="text-[10px] text-neutral-400 dark:text-neutral-500 text-center uppercase tracking-wider">
                            Más opciones próximamente
                        </p>
                    </div>
                </MenuItems>
            </Transition>
        </Menu>
    );
}

