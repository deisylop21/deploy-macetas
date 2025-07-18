import { useEffect } from "react";
import { useUserGeneralStore } from "../states/userGeneralStore";
import { UpdateUserGeneralDTO } from "../lib/types";

export function useUsersGenerales() {
    const {
        users,
        isLoading,
        error,
        fetchingDetails,
        userDetails,
        updating,
        fetchUsers,
        fetchUserDetails,
        updateUserStatus,
        setFilters,
        clearUserDetails,
        filters,
        totalItems,
        totalPages,
    } = useUserGeneralStore();

    useEffect(() => {
        fetchUsers();
        // eslint-disable-next-line
    }, []);

    const handleSearch = (search: string) => {
        setFilters({ search, page: 1 });
    };

    const handleSortChange = (sortBy: string, sortOrder: 'asc' | 'desc') => {
        setFilters({ sortBy, sortOrder });
    };

    const handlePageChange = (page: number) => {
        setFilters({ page });
    };

    return {
        users,
        isLoading,
        error,
        fetchingDetails,
        userDetails,
        updating,
        fetchUserDetails,
        updateUserStatus,
        setFilters,
        clearUserDetails,
        filters,
        totalItems,
        totalPages,
        handleSearch,
        handleSortChange,
        handlePageChange
    };
}