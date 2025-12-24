import AdminLayout from "@/Layouts/AdminLayout";
import { DataTable } from "@/Components/Admin/DataTable";
import { ConfirmModal } from "@/Components/Admin/ConfirmModal";
import { router } from "@inertiajs/react";
import {
    Building2,
    MoreHorizontal,
    Pencil,
    Trash2,
    Users,
} from "lucide-react";
import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface Company {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    description?: string;
    users_count: number;
    landings_count: number;
    created_at: string;
}

interface CompaniesProps {
    auth: {
        user: any;
    };
    companies: {
        data: Company[];
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

export default function Companies({ auth, companies, filters }: CompaniesProps) {
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        company: Company | null;
    }>({
        isOpen: false,
        company: null,
    });
    const [isDeleting, setIsDeleting] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const handleSearch = (query: string) => {
        router.get(
            route("admin.companies"),
            { search: query, page: 1 },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handlePageChange = (page: number) => {
        router.get(
            route("admin.companies"),
            { ...filters, page },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handlePerPageChange = (perPage: number) => {
        router.get(
            route("admin.companies"),
            { ...filters, per_page: perPage, page: 1 },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleSort = (key: string, direction: "asc" | "desc") => {
        router.get(
            route("admin.companies"),
            { ...filters, sort: key, direction },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleDelete = async () => {
        if (!deleteModal.company) return;

        setIsDeleting(true);
        router.delete(route("admin.companies.destroy", deleteModal.company.id), {
            onSuccess: () => {
                setDeleteModal({ isOpen: false, company: null });
                setIsDeleting(false);
            },
            onError: () => {
                setIsDeleting(false);
            },
        });
    };

    const columns = [
        {
            key: "name",
            label: "Empresa",
            sortable: true,
            render: (company: Company) => (
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center text-purple-500">
                        <Building2 size={18} />
                    </div>
                    <div>
                        <p className="font-medium">{company.name}</p>
                        {company.email && (
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                {company.email}
                            </p>
                        )}
                    </div>
                </div>
            ),
        },
        {
            key: "phone",
            label: "Telefono",
            render: (company: Company) =>
                company.phone ? (
                    <span className="text-neutral-700 dark:text-neutral-300">
                        {company.phone}
                    </span>
                ) : (
                    <span className="text-neutral-400">-</span>
                ),
        },
        {
            key: "users_count",
            label: "Usuarios",
            sortable: true,
            className: "text-center",
            render: (company: Company) => (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400">
                    <Users size={12} />
                    {company.users_count || 0}
                </span>
            ),
        },
        {
            key: "landings_count",
            label: "Landings",
            sortable: true,
            className: "text-center",
            render: (company: Company) => (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400">
                    {company.landings_count || 0}
                </span>
            ),
        },
        {
            key: "created_at",
            label: "Creada",
            sortable: true,
            render: (company: Company) => (
                <span className="text-neutral-500 dark:text-neutral-400">
                    {formatDistanceToNow(new Date(company.created_at), {
                        addSuffix: true,
                        locale: es,
                    })}
                </span>
            ),
        },
    ];

    const renderActions = (company: Company) => (
        <div className="relative">
            <button
                onClick={() =>
                    setOpenDropdown(openDropdown === company.id ? null : company.id)
                }
                className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
                <MoreHorizontal size={16} />
            </button>

            {openDropdown === company.id && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setOpenDropdown(null)}
                    />
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 py-1 z-20">
                        <button
                            onClick={() => {
                                router.visit(
                                    route("admin.companies.edit", company.id)
                                );
                                setOpenDropdown(null);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                        >
                            <Pencil size={14} />
                            Editar
                        </button>
                        <hr className="my-1 border-neutral-200 dark:border-neutral-700" />
                        <button
                            onClick={() => {
                                setDeleteModal({ isOpen: true, company });
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
        <AdminLayout title="Admin - Empresas" user={auth.user}>
            <div className="p-6 md:p-8 pt-20 md:pt-8">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                        Empresas
                    </h1>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-1">
                        Gestiona las empresas del sistema
                    </p>
                </div>

                {/* Data Table */}
                <DataTable
                    data={companies.data}
                    columns={columns}
                    totalItems={companies.total}
                    currentPage={companies.current_page}
                    perPage={companies.per_page}
                    searchPlaceholder="Buscar por nombre o email..."
                    onSearch={handleSearch}
                    onPageChange={handlePageChange}
                    onPerPageChange={handlePerPageChange}
                    onSort={handleSort}
                    sortKey={filters.sort}
                    sortDirection={filters.direction}
                    actions={renderActions}
                    emptyMessage="No se encontraron empresas"
                />
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, company: null })}
                onConfirm={handleDelete}
                title="Eliminar empresa"
                message={`¿Estas seguro que deseas eliminar "${deleteModal.company?.name}"? Esta accion no se puede deshacer.`}
                confirmText="Eliminar"
                isLoading={isDeleting}
                variant="danger"
            />
        </AdminLayout>
    );
}

