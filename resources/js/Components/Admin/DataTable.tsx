import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    ChevronsLeft,
    ChevronsRight,
    Search,
    X,
} from "lucide-react";
import React, { useState } from "react";

interface Column<T> {
    key: string;
    label: string;
    sortable?: boolean;
    render?: (item: T) => React.ReactNode;
    className?: string;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    totalItems: number;
    currentPage: number;
    perPage: number;
    searchPlaceholder?: string;
    onSearch?: (query: string) => void;
    onPageChange?: (page: number) => void;
    onPerPageChange?: (perPage: number) => void;
    onSort?: (key: string, direction: "asc" | "desc") => void;
    sortKey?: string;
    sortDirection?: "asc" | "desc";
    isLoading?: boolean;
    emptyMessage?: string;
    actions?: (item: T) => React.ReactNode;
}

export function DataTable<T extends { id: string }>({
    data,
    columns,
    totalItems,
    currentPage,
    perPage,
    searchPlaceholder = "Buscar...",
    onSearch,
    onPageChange,
    onPerPageChange,
    onSort,
    sortKey,
    sortDirection = "desc",
    isLoading = false,
    emptyMessage = "No hay datos disponibles",
    actions,
}: DataTableProps<T>) {
    const [searchQuery, setSearchQuery] = useState("");
    const totalPages = Math.ceil(totalItems / perPage);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch?.(searchQuery);
    };

    const clearSearch = () => {
        setSearchQuery("");
        onSearch?.("");
    };

    const handleSort = (key: string) => {
        if (!onSort) return;
        const newDirection =
            sortKey === key && sortDirection === "asc" ? "desc" : "asc";
        onSort(key, newDirection);
    };

    const renderSortIcon = (columnKey: string) => {
        if (sortKey !== columnKey) return null;
        return sortDirection === "asc" ? (
            <ChevronUp size={14} />
        ) : (
            <ChevronDown size={14} />
        );
    };

    const perPageOptions = [10, 25, 50, 100];

    return (
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
            {/* Header with search and per page */}
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between rounded-t-xl">
                <form
                    onSubmit={handleSearch}
                    className="relative flex-1 max-w-sm"
                >
                    <Search
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                    />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={searchPlaceholder}
                        className="w-full pl-9 pr-9 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={clearSearch}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                        >
                            <X size={14} />
                        </button>
                    )}
                </form>

                <div className="flex items-center gap-2 text-sm">
                    <span className="text-neutral-500 dark:text-neutral-400">
                        Mostrar
                    </span>
                    <select
                        value={perPage}
                        onChange={(e) =>
                            onPerPageChange?.(Number(e.target.value))
                        }
                        className="px-2 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    >
                        {perPageOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                    <span className="text-neutral-500 dark:text-neutral-400">
                        por pagina
                    </span>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto overlay-scrollbar">
                <table className="w-full">
                    <thead>
                        <tr className="bg-neutral-50 dark:bg-neutral-800/50">
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className={`px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider ${
                                        column.sortable
                                            ? "cursor-pointer hover:text-neutral-700 dark:hover:text-neutral-300"
                                            : ""
                                    } ${column.className || ""}`}
                                    onClick={() =>
                                        column.sortable &&
                                        handleSort(column.key)
                                    }
                                >
                                    <div className="flex items-center gap-1">
                                        {column.label}
                                        {column.sortable &&
                                            renderSortIcon(column.key)}
                                    </div>
                                </th>
                            ))}
                            {actions && (
                                <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                                    Acciones
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                        {isLoading ? (
                            <tr>
                                <td
                                    colSpan={columns.length + (actions ? 1 : 0)}
                                    className="px-4 py-12 text-center"
                                >
                                    <div className="flex items-center justify-center gap-2 text-neutral-500">
                                        <div className="w-5 h-5 border-2 border-neutral-300 dark:border-neutral-600 border-t-red-500 rounded-full animate-spin" />
                                        <span>Cargando...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length + (actions ? 1 : 0)}
                                    className="px-4 py-12 text-center text-neutral-500 dark:text-neutral-400"
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            data.map((item) => (
                                <tr
                                    key={item.id}
                                    className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors"
                                >
                                    {columns.map((column) => (
                                        <td
                                            key={column.key}
                                            className={`px-4 py-3 text-sm text-neutral-900 dark:text-neutral-100 ${
                                                column.className || ""
                                            }`}
                                        >
                                            {column.render
                                                ? column.render(item)
                                                : (item as any)[column.key]}
                                        </td>
                                    ))}
                                    {actions && (
                                        <td className="px-4 py-3 text-right">
                                            {actions(item)}
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row gap-4 items-center justify-between rounded-b-xl">
                <div className="text-sm text-neutral-500 dark:text-neutral-400">
                    Mostrando{" "}
                    <span className="font-medium text-neutral-900 dark:text-white">
                        {(currentPage - 1) * perPage + 1}
                    </span>{" "}
                    a{" "}
                    <span className="font-medium text-neutral-900 dark:text-white">
                        {Math.min(currentPage * perPage, totalItems)}
                    </span>{" "}
                    de{" "}
                    <span className="font-medium text-neutral-900 dark:text-white">
                        {totalItems}
                    </span>{" "}
                    resultados
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onPageChange?.(1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronsLeft size={16} />
                    </button>
                    <button
                        onClick={() => onPageChange?.(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft size={16} />
                    </button>

                    <div className="flex items-center gap-1 px-2">
                        {Array.from(
                            { length: Math.min(5, totalPages) },
                            (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => onPageChange?.(pageNum)}
                                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                                            currentPage === pageNum
                                                ? "bg-red-500 text-white"
                                                : "hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            }
                        )}
                    </div>

                    <button
                        onClick={() => onPageChange?.(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight size={16} />
                    </button>
                    <button
                        onClick={() => onPageChange?.(totalPages)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronsRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
