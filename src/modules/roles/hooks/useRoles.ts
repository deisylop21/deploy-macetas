import { useEffect } from "react";
import { useRoleStore } from "../states/roleStore";
import { CreateRoleDTO } from "../lib/types";

export function useRoles() {
    const {
        roles,
        modules,
        isLoading,
        error,
        creating,
        totalItems,
        totalPages,
        filters,
        fetchRoles,
        fetchModules,
        createRole,
        setFilters
    } = useRoleStore();

    useEffect(() => {
        fetchRoles();
        fetchModules();
        // eslint-disable-next-line
    }, []);

    const handleSearch = (search: string) => {
        setFilters({ search, page: 1 });
    };

    const handlePageChange = (page: number) => {
        setFilters({ page });
    };

    const handleSortChange = (sortBy: string, sortOrder: 'asc' | 'desc') => {
        setFilters({ sortBy, sortOrder });
    };

    return {
        roles,
        modules,
        isLoading,
        error,
        creating,
        totalItems,
        totalPages,
        filters,
        fetchRoles: () => {
            fetchRoles();
            fetchModules();
        },
        createRole,
        handleSearch,
        handlePageChange,
        handleSortChange,
        setFilters
    };
}