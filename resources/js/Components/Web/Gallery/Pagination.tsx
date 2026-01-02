/**
 * Pagination - Gallery pagination component
 */

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    lastPage: number;
    onPageChange: (page: number) => void;
}

export function Pagination({
    currentPage,
    lastPage,
    onPageChange,
}: PaginationProps) {
    if (lastPage <= 1) return null;

    // Generate visible page numbers
    const getVisiblePages = () => {
        const pages: (number | string)[] = [];
        const delta = 2;

        for (let i = 1; i <= lastPage; i++) {
            if (
                i === 1 ||
                i === lastPage ||
                (i >= currentPage - delta && i <= currentPage + delta)
            ) {
                pages.push(i);
            } else if (pages[pages.length - 1] !== "...") {
                pages.push("...");
            }
        }

        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-2 mt-12">
            {/* Previous */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                <ChevronLeft size={16} />
                Anterior
            </button>

            {/* Page numbers */}
            <div className="hidden sm:flex items-center gap-1">
                {getVisiblePages().map((page, idx) =>
                    page === "..." ? (
                        <span
                            key={`ellipsis-${idx}`}
                            className="px-3 py-2 text-gray-400"
                        >
                            ...
                        </span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => onPageChange(page as number)}
                            className={`min-w-[40px] h-10 rounded-xl text-sm font-medium transition-all ${
                                currentPage === page
                                    ? "bg-brand-500 text-white shadow-lg shadow-brand-500/30"
                                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                            }`}
                        >
                            {page}
                        </button>
                    )
                )}
            </div>

            {/* Mobile page indicator */}
            <span className="sm:hidden text-sm text-gray-500">
                Pagina {currentPage} de {lastPage}
            </span>

            {/* Next */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === lastPage}
                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                Siguiente
                <ChevronRight size={16} />
            </button>
        </div>
    );
}
