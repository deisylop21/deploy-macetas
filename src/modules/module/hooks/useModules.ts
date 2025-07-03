import { useEffect } from "react";
import { useModuleStore } from "../states/moduleStore";
import type { CreateModuleDTO } from "../lib/types";

export function useModules() {
    const {
        modules,
        isLoading,
        error,
        totalItems,
        totalPages,
        filters,
        creating,
        toggling,
        createError,
        toggleError,
        fetchModules,
        createModule,
        toggleModuleStatus,
        setFilters
    } = useModuleStore();

    useEffect(() => {
        fetchModules();
        // eslint-disable-next-line
    }, []);

    const handleSearch = (search: string) => {
        setFilters({ search, page: 1 });
    };

    const handlePageChange = (page: number) => {
        setFilters({ page });
    };

    // Puedes agregar limit y sort igual que familias si los usas
    const handleLimitChange = (limit: number) => {
        setFilters({ limit, page: 1 });
    };

    const handleSortChange = (sortBy: string, sortOrder: 'asc' | 'desc') => {
        setFilters({ sortBy, sortOrder });
    };

    return {
        modules,
        isLoading,
        error,
        totalItems,
        totalPages,
        filters,
        creating,
        toggling,
        createError,
        toggleError,
        fetchModules,
        createModule,
        toggleModuleStatus,
        handleSearch,
        handlePageChange,
        handleLimitChange,
        handleSortChange,
        setFilters
    };
}