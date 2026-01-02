import { UserAvatar } from "@/Components/Shared/UserAvatar";
import {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    Transition,
} from "@headlessui/react";
import { useForm } from "@inertiajs/react";
import { LogOut, Moon, Sun } from "lucide-react";
import { Fragment } from "react";

interface AdminUserDropdownProps {
    user: any;
    isDarkMode: boolean;
    toggleTheme: () => void;
}

export const AdminUserDropdown: React.FC<AdminUserDropdownProps> = ({
    user,
    isDarkMode,
    toggleTheme,
}) => {
    const { post } = useForm({});

    const handleLogout = () => {
        post(route("logout"));
    };

    return (
        <Menu as="div" className="relative w-full">
            <MenuButton className="w-full flex items-center gap-3 px-3 py-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer">
                <UserAvatar
                    avatar={user?.avatar}
                    avatarThumb={user?.avatar_thumb}
                    name={user?.name}
                    size="sm"
                    variant="admin"
                />
                <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                        {user?.name || "Admin"}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                        {user?.email || ""}
                    </p>
                </div>
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
                <MenuItems className="absolute left-0 bottom-full mb-2 w-full origin-bottom-left bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 focus:outline-none z-50">
                    <div className="p-2">
                        {/* Theme Toggle */}
                        <MenuItem>
                            {({ focus }: { focus: boolean }) => (
                                <button
                                    onClick={toggleTheme}
                                    className={`${
                                        focus
                                            ? "bg-neutral-100 dark:bg-neutral-700"
                                            : ""
                                    } w-full flex items-center gap-3 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-200 rounded-lg transition-colors`}
                                >
                                    {isDarkMode ? (
                                        <Sun size={16} />
                                    ) : (
                                        <Moon size={16} />
                                    )}
                                    <span>
                                        {isDarkMode
                                            ? "Modo claro"
                                            : "Modo oscuro"}
                                    </span>
                                </button>
                            )}
                        </MenuItem>

                        {/* Divider */}
                        <div className="my-1 border-t border-neutral-200 dark:border-neutral-700" />

                        {/* Logout Button */}
                        <MenuItem>
                            {({ focus }: { focus: boolean }) => (
                                <button
                                    onClick={handleLogout}
                                    className={`${
                                        focus
                                            ? "bg-red-50 dark:bg-red-900/20"
                                            : ""
                                    } w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 rounded-lg transition-colors`}
                                >
                                    <LogOut size={16} />
                                    <span>Cerrar sesion</span>
                                </button>
                            )}
                        </MenuItem>
                    </div>
                </MenuItems>
            </Transition>
        </Menu>
    );
};
