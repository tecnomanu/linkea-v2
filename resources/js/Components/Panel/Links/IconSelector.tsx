import { Button } from "@/Components/ui/Button";
import {
    Dialog,
    DialogBody,
    DialogCloseButton,
    DialogContent,
    DialogFooter,
    DialogHeader,
} from "@/Components/ui/Dialog";
import {
    Icon,
    ICONS_BRANDS,
    ICONS_COLORS,
    ICONS_REGULAR,
    ICONS_SOLID,
    IconType,
} from "@/constants/icons";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { Check, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface IconSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectIcon: (icon: Icon) => void;
    currentIcon?: Icon;
    onlyBrands?: boolean;
}

export const IconSelector: React.FC<IconSelectorProps> = ({
    isOpen,
    onClose,
    onSelectIcon,
    currentIcon,
    onlyBrands = false,
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const gridRef = useRef<HTMLDivElement>(null);
    const selectedIconRef = useRef<HTMLButtonElement>(null);

    const iconCategories = useMemo(
        () => [
            { name: "Sólidos", type: "solid" as IconType, icons: ICONS_SOLID },
            {
                name: "Lineal",
                type: "regular" as IconType,
                icons: ICONS_REGULAR,
            },
            { name: "Marcas", type: "brands" as IconType, icons: ICONS_BRANDS },
            { name: "Color", type: "colors" as IconType, icons: ICONS_COLORS },
        ],
        []
    );

    // Find the initial tab index based on current icon type
    const getInitialTabIndex = useCallback(() => {
        if (!currentIcon) return 0;
        const index = iconCategories.findIndex(
            (cat) => cat.type === currentIcon.type
        );
        return index >= 0 ? index : 0;
    }, [currentIcon, iconCategories]);

    const [selectedTabIndex, setSelectedTabIndex] =
        useState(getInitialTabIndex);

    // Reset tab index when modal opens with a different icon
    useEffect(() => {
        if (isOpen) {
            setSelectedTabIndex(getInitialTabIndex());
            setSearchTerm("");
        }
    }, [isOpen, getInitialTabIndex]);

    // Scroll to selected icon when modal opens or tab changes
    useEffect(() => {
        if (isOpen && selectedIconRef.current && gridRef.current) {
            const timer = setTimeout(() => {
                selectedIconRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [isOpen, selectedTabIndex]);

    // Filter icons by search term only (keep original order)
    const filterIcons = (icons: string[]) => {
        if (!searchTerm) return icons;
        return icons.filter((icon) =>
            icon.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const handleSelectIcon = (name: string, type: IconType) => {
        onSelectIcon({ name, type });
        onClose();
    };

    const isSelected = (name: string, type: IconType) => {
        return currentIcon?.name === name && currentIcon?.type === type;
    };

    const isColorIcon = (type: IconType) => type === "colors";

    return (
        <Dialog isOpen={isOpen} onClose={onClose} zIndex={300}>
            <DialogContent maxWidth="3xl">
                {/* Header with Search */}
                <DialogHeader className="border-b border-neutral-200 dark:border-neutral-800 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                            Seleccionar Icono
                        </h2>
                        <DialogCloseButton
                            onClick={onClose}
                            variant="minimal"
                        />
                    </div>

                    <div className="relative">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                            size={18}
                        />
                        <input
                            type="text"
                            placeholder="Buscar icono..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-neutral-900 dark:text-white"
                        />
                    </div>
                </DialogHeader>

                {/* Tabs */}
                <TabGroup
                    selectedIndex={selectedTabIndex}
                    onChange={setSelectedTabIndex}
                >
                    <TabList className="flex gap-1 px-6 pt-4 border-b border-neutral-200 dark:border-neutral-800">
                        {iconCategories.map((category) => {
                            if (onlyBrands && category.type !== "brands")
                                return null;

                            const hasSelectedIcon =
                                currentIcon?.type === category.type;

                            return (
                                <Tab
                                    key={category.type}
                                    className={({ selected }) =>
                                        `relative px-4 py-2.5 text-sm font-medium transition-all outline-none ${
                                            selected
                                                ? "text-brand-500"
                                                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                                        }`
                                    }
                                >
                                    {({ selected }) => (
                                        <>
                                            <span className="flex items-center gap-1.5">
                                                {category.name}
                                                {hasSelectedIcon && (
                                                    <span className="w-2 h-2 rounded-full bg-green-500" />
                                                )}
                                            </span>
                                            {selected && (
                                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full" />
                                            )}
                                        </>
                                    )}
                                </Tab>
                            );
                        })}
                    </TabList>

                    <TabPanels>
                        {iconCategories.map((category) => {
                            if (onlyBrands && category.type !== "brands")
                                return null;

                            const filteredIcons = filterIcons(category.icons);

                            return (
                                <TabPanel key={category.type}>
                                    <DialogBody className="p-6">
                                        {/* Category description */}
                                        <div className="mb-4 text-xs text-neutral-500 dark:text-neutral-400">
                                            {category.type === "solid" &&
                                                "Iconos sólidos rellenos - ideales para botones y acciones"}
                                            {category.type === "regular" &&
                                                "Iconos lineales/outline - estilo minimalista"}
                                            {category.type === "brands" &&
                                                "Logos de marcas en un solo color"}
                                            {category.type === "colors" &&
                                                "Logos de marcas con sus colores oficiales"}
                                        </div>

                                        {/* Grid with padding to prevent clipping of ring/checkmark */}
                                        <div
                                            ref={gridRef}
                                            className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-2 max-h-72 overflow-y-auto p-1"
                                        >
                                            {filteredIcons.map((iconName) => {
                                                const selected = isSelected(
                                                    iconName,
                                                    category.type
                                                );

                                                return (
                                                    <button
                                                        key={iconName}
                                                        ref={
                                                            selected
                                                                ? selectedIconRef
                                                                : null
                                                        }
                                                        onClick={() =>
                                                            handleSelectIcon(
                                                                iconName,
                                                                category.type
                                                            )
                                                        }
                                                        className={`group relative flex flex-col items-center justify-center p-2 rounded-lg transition-all hover:scale-105 ${
                                                            selected
                                                                ? "bg-brand-500 ring-2 ring-brand-500 ring-offset-2 dark:ring-offset-neutral-900 shadow-lg"
                                                                : "bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                                                        }`}
                                                        title={iconName}
                                                    >
                                                        {selected && (
                                                            <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                                                                <Check
                                                                    size={12}
                                                                    className="text-white"
                                                                />
                                                            </div>
                                                        )}

                                                        <img
                                                            src={`/assets/images/icons/${category.type}/${iconName}.svg`}
                                                            alt={iconName}
                                                            className="w-6 h-6"
                                                            style={{
                                                                filter:
                                                                    selected &&
                                                                    !isColorIcon(
                                                                        category.type
                                                                    )
                                                                        ? "brightness(0) invert(1)"
                                                                        : "none",
                                                            }}
                                                            onError={(e) => {
                                                                (
                                                                    e.target as HTMLImageElement
                                                                ).style.display =
                                                                    "none";
                                                            }}
                                                        />
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {filteredIcons.length === 0 && (
                                            <div className="text-center py-8 text-neutral-500 text-sm">
                                                No se encontraron iconos para "
                                                {searchTerm}"
                                            </div>
                                        )}

                                        <div className="mt-4 text-xs text-neutral-400 text-center">
                                            {filteredIcons.length} iconos
                                            {searchTerm && " encontrados"}
                                        </div>
                                    </DialogBody>
                                </TabPanel>
                            );
                        })}
                    </TabPanels>
                </TabGroup>

                {/* Footer */}
                <DialogFooter className="border-t border-neutral-200 dark:border-neutral-800 p-6">
                    {currentIcon && (
                        <div className="flex-1 flex items-center gap-3 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
                            <img
                                src={`/assets/images/icons/${currentIcon.type}/${currentIcon.name}.svg`}
                                alt={currentIcon.name}
                                className="w-6 h-6"
                            />
                            <div className="text-sm">
                                <span className="font-medium text-neutral-900 dark:text-white">
                                    {currentIcon.name}
                                </span>
                                <span className="text-neutral-400 ml-2">
                                    ({currentIcon.type})
                                </span>
                            </div>
                        </div>
                    )}
                    <Button variant="secondary" onClick={onClose}>
                        Cancelar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
