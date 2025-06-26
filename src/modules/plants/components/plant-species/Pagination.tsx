"use client";

import { Button } from "../../../core/components/ui/button";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    isDark?: boolean;
}

export function Pagination({ currentPage, totalPages, onPageChange, isDark = false }: PaginationProps) {
    const generatePageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        pages.push(1);

        if (totalPages <= maxVisiblePages) {
            for (let i = 2; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage > 3) {
                pages.push('...');
            }

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push('...');
            }

            if (totalPages > 1) {
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const pages = generatePageNumbers();

    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center items-center gap-1 mt-6">
            <Button
                variant="outline"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={isDark ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600" : ""}
                size="sm"
            >
                &laquo;
            </Button>

            {pages.map((page, index) => (
                page === '...' ? (
                    <span
                        key={`ellipsis-${index}`}
                        className={`px-3 py-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
                    >
                        ...
                    </span>
                ) : (
                    <Button
                        key={`page-${page}`}
                        variant={currentPage === page ? "default" : "outline"}
                        onClick={() => typeof page === 'number' && onPageChange(page)}
                        className={
                            currentPage === page
                                ? (isDark ? "bg-green-600 text-white" : "")
                                : (isDark ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600" : "")
                        }
                        size="sm"
                    >
                        {page}
                    </Button>
                )
            ))}

            <Button
                variant="outline"
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={isDark ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600" : ""}
                size="sm"
            >
                &raquo;
            </Button>
        </div>
    );
}