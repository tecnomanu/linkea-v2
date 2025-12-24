import AdminLayout from "@/Layouts/AdminLayout";
import { DataTable } from "@/Components/Admin/DataTable";
import { ConfirmModal } from "@/Components/Admin/ConfirmModal";
import { router } from "@inertiajs/react";
import {
    Eye,
    Mail,
    MailCheck,
    MoreHorizontal,
    Pencil,
    Plus,
    Send,
    Trash2,
} from "lucide-react";
import React, { useState } from "react";
import { formatDistanceToNow, format } from "date-fns";
import { es } from "date-fns/locale";

interface Newsletter {
    id: string;
    subject: string;
    message: string;
    status: string;
    sent: boolean;
    viewed_count: number;
    recipients_count: number;
    created_at: string;
    updated_at: string;
}

interface NewslettersProps {
    auth: {
        user: any;
    };
    newsletters: {
        data: Newsletter[];
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

export default function Newsletters({
    auth,
    newsletters,
    filters,
}: NewslettersProps) {
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        newsletter: Newsletter | null;
    }>({
        isOpen: false,
        newsletter: null,
    });
    const [sendModal, setSendModal] = useState<{
        isOpen: boolean;
        newsletter: Newsletter | null;
    }>({
        isOpen: false,
        newsletter: null,
    });
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const handleSearch = (query: string) => {
        router.get(
            route("admin.newsletters"),
            { search: query, page: 1 },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handlePageChange = (page: number) => {
        router.get(
            route("admin.newsletters"),
            { ...filters, page },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handlePerPageChange = (perPage: number) => {
        router.get(
            route("admin.newsletters"),
            { ...filters, per_page: perPage, page: 1 },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleSort = (key: string, direction: "asc" | "desc") => {
        router.get(
            route("admin.newsletters"),
            { ...filters, sort: key, direction },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleDelete = async () => {
        if (!deleteModal.newsletter) return;

        setIsDeleting(true);
        router.delete(
            route("admin.newsletters.destroy", deleteModal.newsletter.id),
            {
                onSuccess: () => {
                    setDeleteModal({ isOpen: false, newsletter: null });
                    setIsDeleting(false);
                },
                onError: () => {
                    setIsDeleting(false);
                },
            }
        );
    };

    const handleSend = async () => {
        if (!sendModal.newsletter) return;

        setIsSending(true);
        router.post(
            route("admin.newsletters.send", sendModal.newsletter.id),
            {},
            {
                onSuccess: () => {
                    setSendModal({ isOpen: false, newsletter: null });
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
            key: "subject",
            label: "Asunto",
            sortable: true,
            render: (newsletter: Newsletter) => (
                <div className="flex items-center gap-3">
                    <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                            newsletter.sent
                                ? "bg-green-100 dark:bg-green-500/20 text-green-500"
                                : "bg-orange-100 dark:bg-orange-500/20 text-orange-500"
                        }`}
                    >
                        {newsletter.sent ? (
                            <MailCheck size={18} />
                        ) : (
                            <Mail size={18} />
                        )}
                    </div>
                    <div>
                        <p className="font-medium">{newsletter.subject}</p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1 max-w-[200px]">
                            {newsletter.message?.replace(/<[^>]*>/g, "").substring(0, 50)}...
                        </p>
                    </div>
                </div>
            ),
        },
        {
            key: "sent",
            label: "Estado",
            render: (newsletter: Newsletter) => (
                <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        newsletter.sent
                            ? "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400"
                            : "bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400"
                    }`}
                >
                    {newsletter.sent ? "Enviado" : "Borrador"}
                </span>
            ),
        },
        {
            key: "recipients_count",
            label: "Destinatarios",
            className: "text-center",
            render: (newsletter: Newsletter) => (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400">
                    {newsletter.recipients_count || 0}
                </span>
            ),
        },
        {
            key: "viewed_count",
            label: "Aperturas",
            sortable: true,
            className: "text-center",
            render: (newsletter: Newsletter) => (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400">
                    <Eye size={12} />
                    {newsletter.viewed_count || 0}
                </span>
            ),
        },
        {
            key: "created_at",
            label: "Creado",
            sortable: true,
            render: (newsletter: Newsletter) => (
                <span className="text-neutral-500 dark:text-neutral-400">
                    {formatDistanceToNow(new Date(newsletter.created_at), {
                        addSuffix: true,
                        locale: es,
                    })}
                </span>
            ),
        },
    ];

    const renderActions = (newsletter: Newsletter) => (
        <div className="relative">
            <button
                onClick={() =>
                    setOpenDropdown(
                        openDropdown === newsletter.id ? null : newsletter.id
                    )
                }
                className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
                <MoreHorizontal size={16} />
            </button>

            {openDropdown === newsletter.id && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setOpenDropdown(null)}
                    />
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 py-1 z-20">
                        <button
                            onClick={() => {
                                router.visit(
                                    route("admin.newsletters.edit", newsletter.id)
                                );
                                setOpenDropdown(null);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                        >
                            <Pencil size={14} />
                            Editar
                        </button>
                        {!newsletter.sent && (
                            <button
                                onClick={() => {
                                    setSendModal({ isOpen: true, newsletter });
                                    setOpenDropdown(null);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-500/10"
                            >
                                <Send size={14} />
                                Enviar
                            </button>
                        )}
                        <hr className="my-1 border-neutral-200 dark:border-neutral-700" />
                        <button
                            onClick={() => {
                                setDeleteModal({ isOpen: true, newsletter });
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
        <AdminLayout title="Admin - Newsletters" user={auth.user}>
            <div className="p-6 md:p-8 pt-20 md:pt-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                            Newsletters
                        </h1>
                        <p className="text-neutral-500 dark:text-neutral-400 mt-1">
                            Gestiona los newsletters del sistema
                        </p>
                    </div>
                    <button
                        onClick={() => router.visit(route("admin.newsletters.create"))}
                        className="flex items-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium text-sm transition-colors"
                    >
                        <Plus size={18} />
                        Nuevo Newsletter
                    </button>
                </div>

                {/* Data Table */}
                <DataTable
                    data={newsletters.data}
                    columns={columns}
                    totalItems={newsletters.total}
                    currentPage={newsletters.current_page}
                    perPage={newsletters.per_page}
                    searchPlaceholder="Buscar por asunto..."
                    onSearch={handleSearch}
                    onPageChange={handlePageChange}
                    onPerPageChange={handlePerPageChange}
                    onSort={handleSort}
                    sortKey={filters.sort}
                    sortDirection={filters.direction}
                    actions={renderActions}
                    emptyMessage="No se encontraron newsletters"
                />
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, newsletter: null })}
                onConfirm={handleDelete}
                title="Eliminar newsletter"
                message={`¿Estas seguro que deseas eliminar "${deleteModal.newsletter?.subject}"? Esta accion no se puede deshacer.`}
                confirmText="Eliminar"
                isLoading={isDeleting}
                variant="danger"
            />

            {/* Send Confirmation Modal */}
            <ConfirmModal
                isOpen={sendModal.isOpen}
                onClose={() => setSendModal({ isOpen: false, newsletter: null })}
                onConfirm={handleSend}
                title="Enviar newsletter"
                message={`¿Estas seguro que deseas enviar "${sendModal.newsletter?.subject}" a todos los usuarios?`}
                confirmText="Enviar"
                isLoading={isSending}
                variant="info"
            />
        </AdminLayout>
    );
}

