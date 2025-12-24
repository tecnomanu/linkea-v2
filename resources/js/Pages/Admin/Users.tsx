import AdminLayout from "@/Layouts/AdminLayout";
import { DataTable } from "@/Components/Admin/DataTable";
import { ConfirmModal } from "@/Components/Admin/ConfirmModal";
import { router } from "@inertiajs/react";
import {
    MoreHorizontal,
    Pencil,
    Shield,
    Trash2,
    UserCheck,
    UserX,
} from "lucide-react";
import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface User {
    id: string;
    name: string;
    first_name?: string;
    last_name?: string;
    email: string;
    avatar?: string;
    role_name?: string;
    status: "verify" | "pending";
    landings_count: number;
    company?: {
        id: string;
        name: string;
    };
    created_at: string;
    verified_at?: string;
}

interface UsersProps {
    auth: {
        user: any;
    };
    users: {
        data: User[];
        total: number;
        current_page: number;
        per_page: number;
    };
    filters: {
        search?: string;
        sort?: string;
        direction?: "asc" | "desc";
    };
}

export default function Users({ auth, users, filters }: UsersProps) {
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        user: User | null;
    }>({
        isOpen: false,
        user: null,
    });
    const [isDeleting, setIsDeleting] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const handleSearch = (query: string) => {
        router.get(
            route("admin.users"),
            { search: query, page: 1 },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handlePageChange = (page: number) => {
        router.get(
            route("admin.users"),
            { ...filters, page },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handlePerPageChange = (perPage: number) => {
        router.get(
            route("admin.users"),
            { ...filters, per_page: perPage, page: 1 },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleSort = (key: string, direction: "asc" | "desc") => {
        router.get(
            route("admin.users"),
            { ...filters, sort: key, direction },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleDelete = async () => {
        if (!deleteModal.user) return;

        setIsDeleting(true);
        router.delete(route("admin.users.destroy", deleteModal.user.id), {
            onSuccess: () => {
                setDeleteModal({ isOpen: false, user: null });
                setIsDeleting(false);
            },
            onError: () => {
                setIsDeleting(false);
            },
        });
    };

    const getRoleBadgeColor = (role?: string) => {
        switch (role) {
            case "root":
                return "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400";
            case "admin":
                return "bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400";
            default:
                return "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300";
        }
    };

    const columns = [
        {
            key: "name",
            label: "Usuario",
            sortable: true,
            render: (user: User) => (
                <div className="flex items-center gap-3">
                    {user.avatar ? (
                        <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-9 h-9 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-9 h-9 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center text-green-500 font-medium">
                            {user.name?.charAt(0).toUpperCase() ||
                                user.email?.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div>
                        <p className="font-medium">{user.name || user.text}</p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            {user.email}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            key: "role_name",
            label: "Rol",
            render: (user: User) => (
                <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(
                        user.role_name
                    )}`}
                >
                    {user.role_name === "root" && <Shield size={12} />}
                    {user.role_name || "user"}
                </span>
            ),
        },
        {
            key: "company",
            label: "Empresa",
            render: (user: User) =>
                user.company ? (
                    <span className="text-neutral-700 dark:text-neutral-300">
                        {user.company.name}
                    </span>
                ) : (
                    <span className="text-neutral-400">-</span>
                ),
        },
        {
            key: "landings_count",
            label: "Landings",
            sortable: true,
            className: "text-center",
            render: (user: User) => (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400">
                    {user.landings_count || 0}
                </span>
            ),
        },
        {
            key: "status",
            label: "Estado",
            render: (user: User) => (
                <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.status === "verify"
                            ? "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400"
                            : "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400"
                    }`}
                >
                    {user.status === "verify" ? (
                        <>
                            <UserCheck size={12} />
                            Verificado
                        </>
                    ) : (
                        <>
                            <UserX size={12} />
                            Pendiente
                        </>
                    )}
                </span>
            ),
        },
        {
            key: "created_at",
            label: "Registro",
            sortable: true,
            render: (user: User) => (
                <span className="text-neutral-500 dark:text-neutral-400">
                    {formatDistanceToNow(new Date(user.created_at), {
                        addSuffix: true,
                        locale: es,
                    })}
                </span>
            ),
        },
    ];

    const renderActions = (user: User) => (
        <div className="relative">
            <button
                onClick={() =>
                    setOpenDropdown(openDropdown === user.id ? null : user.id)
                }
                className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
                <MoreHorizontal size={16} />
            </button>

            {openDropdown === user.id && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setOpenDropdown(null)}
                    />
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 py-1 z-20">
                        <button
                            onClick={() => {
                                router.visit(route("admin.users.edit", user.id));
                                setOpenDropdown(null);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                        >
                            <Pencil size={14} />
                            Editar
                        </button>
                        {user.role_name !== "root" && (
                            <>
                                <hr className="my-1 border-neutral-200 dark:border-neutral-700" />
                                <button
                                    onClick={() => {
                                        setDeleteModal({ isOpen: true, user });
                                        setOpenDropdown(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
                                >
                                    <Trash2 size={14} />
                                    Eliminar
                                </button>
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );

    return (
        <AdminLayout title="Admin - Usuarios" user={auth.user}>
            <div className="p-6 md:p-8 pt-20 md:pt-8">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                        Usuarios
                    </h1>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-1">
                        Gestiona los usuarios del sistema
                    </p>
                </div>

                {/* Data Table */}
                <DataTable
                    data={users.data}
                    columns={columns}
                    totalItems={users.total}
                    currentPage={users.current_page}
                    perPage={users.per_page}
                    searchPlaceholder="Buscar por nombre o email..."
                    onSearch={handleSearch}
                    onPageChange={handlePageChange}
                    onPerPageChange={handlePerPageChange}
                    onSort={handleSort}
                    sortKey={filters.sort}
                    sortDirection={filters.direction}
                    actions={renderActions}
                    emptyMessage="No se encontraron usuarios"
                />
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, user: null })}
                onConfirm={handleDelete}
                title="Eliminar usuario"
                message={`¿Estas seguro que deseas eliminar a "${deleteModal.user?.name}"? Esta accion no se puede deshacer.`}
                confirmText="Eliminar"
                isLoading={isDeleting}
                variant="danger"
            />
        </AdminLayout>
    );
}

