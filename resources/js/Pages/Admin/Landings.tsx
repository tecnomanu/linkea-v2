import { ConfirmModal } from "@/Components/Admin/ConfirmModal";
import { DataTable } from "@/Components/Admin/DataTable";
import AdminLayout from "@/Layouts/AdminLayout";
import { router } from "@inertiajs/react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { ExternalLink, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Landing {
    id: string;
    name: string;
    slug: string;
    domain_name?: string;
    user?: {
        id: string;
        name: string;
        email: string;
    };
    company?: {
        id: string;
        name: string;
    };
    links_count: number;
    views: number;
    total_clicks: number;
    verify: boolean;
    created_at: string;
    updated_at: string;
}

interface LandingsProps {
    auth: {
        user: any;
    };
    landings: {
        data: Landing[];
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

export default function Landings({ auth, landings, filters }: LandingsProps) {
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        landing: Landing | null;
    }>({
        isOpen: false,
        landing: null,
    });
    const [isDeleting, setIsDeleting] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const handleSearch = (query: string) => {
        router.get(
            route("admin.landings"),
            { search: query, page: 1 },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handlePageChange = (page: number) => {
        router.get(
            route("admin.landings"),
            { ...filters, page },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handlePerPageChange = (perPage: number) => {
        router.get(
            route("admin.landings"),
            { ...filters, per_page: perPage, page: 1 },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleSort = (key: string, direction: "asc" | "desc") => {
        router.get(
            route("admin.landings"),
            { ...filters, sort: key, direction },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleDelete = async () => {
        if (!deleteModal.landing) return;

        setIsDeleting(true);
        router.delete(route("admin.landings.destroy", deleteModal.landing.id), {
            onSuccess: () => {
                setDeleteModal({ isOpen: false, landing: null });
                setIsDeleting(false);
            },
            onError: () => {
                setIsDeleting(false);
            },
        });
    };

    const openLanding = (landing: Landing) => {
        const url = landing.domain_name || landing.slug;
        window.open(`/${url}`, "_blank");
    };

    const columns = [
        {
            key: "name",
            label: "Nombre",
            sortable: true,
            render: (landing: Landing) => (
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-500 font-medium">
                        {landing.name?.charAt(0).toUpperCase() || "L"}
                    </div>
                    <div>
                        <p className="font-medium">
                            {landing.name || "Sin nombre"}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            /{landing.domain_name || landing.slug}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            key: "user",
            label: "Usuario",
            render: (landing: Landing) =>
                landing.user ? (
                    <div>
                        <p className="font-medium">{landing.user.name}</p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            {landing.user.email}
                        </p>
                    </div>
                ) : (
                    <span className="text-neutral-400">-</span>
                ),
        },
        {
            key: "links_count",
            label: "Links",
            sortable: true,
            className: "text-center",
            render: (landing: Landing) => (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                    {landing.links_count || 0}
                </span>
            ),
        },
        {
            key: "views",
            label: "Views",
            sortable: true,
            className: "text-center",
            render: (landing: Landing) => (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400">
                    {(landing.views || 0).toLocaleString()}
                </span>
            ),
        },
        {
            key: "total_clicks",
            label: "Clicks",
            sortable: true,
            className: "text-center",
            render: (landing: Landing) => (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400">
                    {(landing.total_clicks || 0).toLocaleString()}
                </span>
            ),
        },
        {
            key: "verify",
            label: "Estado",
            render: (landing: Landing) => (
                <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        landing.verify
                            ? "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400"
                            : "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400"
                    }`}
                >
                    {landing.verify ? "Verificado" : "No verificado"}
                </span>
            ),
        },
        {
            key: "created_at",
            label: "Creado",
            sortable: true,
            render: (landing: Landing) => (
                <span className="text-neutral-500 dark:text-neutral-400">
                    {formatDistanceToNow(new Date(landing.created_at), {
                        addSuffix: true,
                        locale: es,
                    })}
                </span>
            ),
        },
    ];

    const ActionDropdown = ({ landing }: { landing: Landing }) => {
        const buttonRef = useRef<HTMLButtonElement>(null);
        const [dropdownPosition, setDropdownPosition] = useState({
            top: 0,
            left: 0,
        });
        const isOpen = openDropdown === landing.id;

        useEffect(() => {
            if (isOpen && buttonRef.current) {
                const rect = buttonRef.current.getBoundingClientRect();
                setDropdownPosition({
                    top: rect.bottom + 4,
                    left: rect.right - 192, // 192px = w-48
                });
            }
        }, [isOpen]);

        return (
            <>
                <button
                    ref={buttonRef}
                    onClick={() => setOpenDropdown(isOpen ? null : landing.id)}
                    className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                    <MoreHorizontal size={16} />
                </button>

                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setOpenDropdown(null)}
                        />
                        <div
                            className="fixed w-48 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 py-1 z-50"
                            style={{
                                top: dropdownPosition.top,
                                left: dropdownPosition.left,
                            }}
                        >
                            <button
                                onClick={() => {
                                    openLanding(landing);
                                    setOpenDropdown(null);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                            >
                                <ExternalLink size={14} />
                                Ver landing
                            </button>
                            <button
                                onClick={() => {
                                    router.visit(
                                        route("admin.landings.edit", landing.id)
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
                                    setDeleteModal({ isOpen: true, landing });
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
            </>
        );
    };

    const renderActions = (landing: Landing) => (
        <ActionDropdown landing={landing} />
    );

    return (
        <AdminLayout title="Admin - Landings" user={auth.user}>
            <div className="p-6 md:p-8 pt-20 md:pt-8">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                        Landings
                    </h1>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-1">
                        Gestiona todas las landings del sistema
                    </p>
                </div>

                {/* Data Table */}
                <DataTable
                    data={landings.data}
                    columns={columns}
                    totalItems={landings.total}
                    currentPage={landings.current_page}
                    perPage={landings.per_page}
                    searchPlaceholder="Buscar por nombre o slug..."
                    onSearch={handleSearch}
                    onPageChange={handlePageChange}
                    onPerPageChange={handlePerPageChange}
                    onSort={handleSort}
                    sortKey={filters.sort}
                    sortDirection={filters.direction}
                    actions={renderActions}
                    emptyMessage="No se encontraron landings"
                />
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, landing: null })}
                onConfirm={handleDelete}
                title="Eliminar landing"
                message={`¿Estas seguro que deseas eliminar "${deleteModal.landing?.name}"? Esta accion no se puede deshacer.`}
                confirmText="Eliminar"
                isLoading={isDeleting}
                variant="danger"
            />
        </AdminLayout>
    );
}
