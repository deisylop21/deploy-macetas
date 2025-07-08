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
        updating,
        deleting,
        toggling,
        createError,
        updateError,
        deleteError,
        toggleError,
        fetchModules,
        createModule,
        updateModule,
        deleteModule,
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
        updating,
        deleting,
        toggling,
        createError,
        updateError,
        deleteError,
        toggleError,
        fetchModules,
        createModule,
        updateModule,
        deleteModule,
        toggleModuleStatus,
        handleSearch,
        handlePageChange,
        handleLimitChange,
        handleSortChange,
        setFilters
    };
}