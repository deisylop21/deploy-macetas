import { useEffect } from "react";
import { useRoleStore } from "../states/roleStore";
import { CreateRoleDTO, Role } from "../lib/types";

export function useRoles() {
    const {
        roles,
        modules,
        isLoading,
        error,
        creating,
        updating,
        totalItems,
        totalPages,
        filters,
        fetchRoles,
        fetchModules,
        createRole,
        updateRole,
        getRoleById,
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
        updating,
        totalItems,
        totalPages,
        filters,
        fetchRoles: () => {
            fetchRoles();
            fetchModules();
        },
        createRole,
        updateRole,
        getRoleById,
        handleSearch,
        handlePageChange,
        handleSortChange,
        setFilters
    };
}