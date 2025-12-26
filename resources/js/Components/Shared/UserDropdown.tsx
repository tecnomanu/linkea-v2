import {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    Transition,
} from "@headlessui/react";
import { Link, useForm } from "@inertiajs/react";
import { LogOut, User } from "lucide-react";
import { Fragment } from "react";
import { UserAvatar } from "./UserAvatar";

interface UserDropdownProps {
    user: any;
}

export const UserDropdown: React.FC<UserDropdownProps> = ({ user }) => {
    const { post } = useForm({});

    const handleLogout = () => {
        post(route("logout") as string);
    };

    return (
        <Menu as="div" className="relative">
            <MenuButton className="flex items-center justify-center w-10 h-10 rounded-full hover:ring-2 hover:ring-brand-500/50 transition-all">
                <UserAvatar
                    avatar={user?.avatar}
                    name={user?.name}
                    size="sm"
                    variant="panel"
                />
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
                <MenuItems className="absolute left-14 bottom-0 w-48 origin-bottom-left bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 focus:outline-none z-50">
                    <div className="p-2">
                        {/* User Info */}
                        <div className="px-3 py-2 border-b border-neutral-200 dark:border-neutral-700 mb-1">
                            <p className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                                {user?.name || "Usuario"}
                            </p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                                {user?.email}
                            </p>
                        </div>

                        {/* Profile Link */}
                        <MenuItem>
                            {({ focus }: { focus: boolean }) => (
                                <Link
                                    href={route("panel.profile") as string}
                                    className={`${
                                        focus
                                            ? "bg-neutral-100 dark:bg-neutral-700"
                                            : ""
                                    } flex items-center gap-3 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-200 rounded-lg transition-colors`}
                                >
                                    <User size={16} />
                                    <span>Mi Perfil</span>
                                </Link>
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
                                    <span>Cerrar Sesion</span>
                                </button>
                            )}
                        </MenuItem>
                    </div>
                </MenuItems>
            </Transition>
        </Menu>
    );
};
