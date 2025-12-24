import AdminLayout from "@/Layouts/AdminLayout";
import { DataTable } from "@/Components/Admin/DataTable";
import { ConfirmModal } from "@/Components/Admin/ConfirmModal";
import { router } from "@inertiajs/react";
import {
    Bell,
    BellRing,
    Eye,
    MoreHorizontal,
    Pencil,
    Plus,
    Send,
    Trash2,
    Users,
} from "lucide-react";
import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface Notification {
    id: string;
    title: string;
    text: string;
    type: string | null;
    icon: any;
    read_count: number;
    viewed_count: number;
    recipients_count: number;
    created_at: string;
    updated_at: string;
}

interface NotificationsProps {
    auth: {
        user: any;
    };
    notifications: {
        data: Notification[];
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

export default function Notifications({
    auth,
    notifications,
    filters,
}: NotificationsProps) {
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        notification: Notification | null;
    }>({
        isOpen: false,
        notification: null,
    });
    const [sendModal, setSendModal] = useState<{
        isOpen: boolean;
        notification: Notification | null;
    }>({
        isOpen: false,
        notification: null,
    });
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const handleSearch = (query: string) => {
        router.get(
            route("admin.notifications"),
            { search: query, page: 1 },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handlePageChange = (page: number) => {
        router.get(
            route("admin.notifications"),
            { ...filters, page },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handlePerPageChange = (perPage: number) => {
        router.get(
            route("admin.notifications"),
            { ...filters, per_page: perPage, page: 1 },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleSort = (key: string, direction: "asc" | "desc") => {
        router.get(
            route("admin.notifications"),
            { ...filters, sort: key, direction },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleDelete = async () => {
        if (!deleteModal.notification) return;

        setIsDeleting(true);
        router.delete(
            route("admin.notifications.destroy", deleteModal.notification.id),
            {
                onSuccess: () => {
                    setDeleteModal({ isOpen: false, notification: null });
                    setIsDeleting(false);
                },
                onError: () => {
                    setIsDeleting(false);
                },
            }
        );
    };

    const handleSend = async () => {
        if (!sendModal.notification) return;

        setIsSending(true);
        router.post(
            route("admin.notifications.send", sendModal.notification.id),
            {},
            {
                onSuccess: () => {
                    setSendModal({ isOpen: false, notification: null });
                    setIsSending(false);
                },
                onError: () => {
                    setIsSending(false);
                },
            }
        );
    };

    const columns = [
        {
            key: "title",
            label: "Titulo",
            sortable: true,
            render: (notification: Notification) => (
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-amber-100 dark:bg-amber-500/20 text-amber-500">
                        {notification.recipients_count > 0 ? (
                            <BellRing size={18} />
                        ) : (
                            <Bell size={18} />
                        )}
                    </div>
                    <div>
                        <p className="font-medium">{notification.title}</p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1 max-w-[200px]">
                            {notification.text?.substring(0, 50)}...
                        </p>
                    </div>
                </div>
            ),
        },
        {
            key: "type",
            label: "Tipo",
            render: (notification: Notification) => (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                    {notification.type || "General"}
                </span>
            ),
        },
        {
            key: "recipients_count",
            label: "Destinatarios",
            className: "text-center",
            render: (notification: Notification) => (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400">
                    <Users size={12} />
                    {notification.recipients_count || 0}
                </span>
            ),
        },
        {
            key: "read_count",
            label: "Leidas",
            sortable: true,
            className: "text-center",
            render: (notification: Notification) => (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400">
                    <Eye size={12} />
                    {notification.read_count || 0}
                </span>
            ),
        },
        {
            key: "created_at",
            label: "Creado",
            sortable: true,
            render: (notification: Notification) => (
                <span className="text-neutral-500 dark:text-neutral-400">
                    {formatDistanceToNow(new Date(notification.created_at), {
                        addSuffix: true,
                        locale: es,
                    })}
                </span>
            ),
        },
    ];

    const renderActions = (notification: Notification) => (
        <div className="relative">
            <button
                onClick={() =>
                    setOpenDropdown(
                        openDropdown === notification.id ? null : notification.id
                    )
                }
                className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
                <MoreHorizontal size={16} />
            </button>

            {openDropdown === notification.id && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setOpenDropdown(null)}
                    />
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 py-1 z-20">
                        <button
                            onClick={() => {
                                router.visit(
                                    route("admin.notifications.edit", notification.id)
                                );
                                setOpenDropdown(null);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                        >
                            <Pencil size={14} />
                            Editar
                        </button>
                        {notification.recipients_count === 0 && (
                            <button
                                onClick={() => {
                                    setSendModal({ isOpen: true, notification });
                                    setOpenDropdown(null);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-500/10"
                            >
                                <Send size={14} />
                                Enviar a todos
                            </button>
                        )}
                        <hr className="my-1 border-neutral-200 dark:border-neutral-700" />
                        <button
                            onClick={() => {
                                setDeleteModal({ isOpen: true, notification });
                                setOpenDropdown(null);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
                        >
                            <Trash2 size={14} />
                            Eliminar
                        </button>
                    </div>
                </>
            )}
        </div>
    );

    return (
        <AdminLayout title="Admin - Notificaciones" user={auth.user}>
            <div className="p-6 md:p-8 pt-20 md:pt-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                            Notificaciones
                        </h1>
                        <p className="text-neutral-500 dark:text-neutral-400 mt-1">
                            Gestiona las notificaciones del sistema
                        </p>
                    </div>
                    <button
                        onClick={() => router.visit(route("admin.notifications.create"))}
                        className="flex items-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium text-sm transition-colors"
                    >
                        <Plus size={18} />
                        Nueva Notificacion
                    </button>
                </div>

                {/* Data Table */}
                <DataTable
                    data={notifications.data}
                    columns={columns}
                    totalItems={notifications.total}
                    currentPage={notifications.current_page}
                    perPage={notifications.per_page}
                    searchPlaceholder="Buscar por titulo..."
                    onSearch={handleSearch}
                    onPageChange={handlePageChange}
                    onPerPageChange={handlePerPageChange}
                    onSort={handleSort}
                    sortKey={filters.sort}
                    sortDirection={filters.direction}
                    actions={renderActions}
                    emptyMessage="No se encontraron notificaciones"
                />
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, notification: null })}
                onConfirm={handleDelete}
                title="Eliminar notificacion"
                message={`¿Estas seguro que deseas eliminar "${deleteModal.notification?.title}"? Esta accion no se puede deshacer.`}
                confirmText="Eliminar"
                isLoading={isDeleting}
                variant="danger"
            />

            {/* Send Confirmation Modal */}
            <ConfirmModal
                isOpen={sendModal.isOpen}
                onClose={() => setSendModal({ isOpen: false, notification: null })}
                onConfirm={handleSend}
                title="Enviar notificacion"
                message={`¿Estas seguro que deseas enviar "${sendModal.notification?.title}" a todos los usuarios?`}
                confirmText="Enviar"
                isLoading={isSending}
                variant="info"
            />
        </AdminLayout>
    );
}

