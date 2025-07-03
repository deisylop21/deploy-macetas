import { useEffect } from "react";
import { useUserStore } from "../states/userStore";
import { CreateUserDTO } from "../lib/types";

export function useUsers() {
    const {
        users,
        roles,
        isLoading,
        error,
        creating,
        totalItems,
        totalPages,
        filters,
        fetchUsers,
        fetchRoles,
        createUser,
        setFilters
    } = useUserStore();

    useEffect(() => {
        fetchUsers();
        fetchRoles();
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
        users,
        roles,
        isLoading,
        error,
        creating,
        totalItems,
        totalPages,
        filters,
        fetchUsers: () => {
            fetchUsers();
            fetchRoles();
        },
        createUser,
        handleSearch,
        handlePageChange,
        handleSortChange,
        setFilters
    };
}