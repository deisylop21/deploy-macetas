import { useEffect } from "react";
import { useUserStore } from "../states/userStore";
import { CreateUserDTO, EditUserDTO } from "../lib/types";

export function useUsers() {
    const {
        users,
        roles,
        isLoading,
        error,
        creating,
        updating,
        totalItems,
        totalPages,
        filters,
        userDetails,
        fetchingDetails,
        fetchUsers,
        fetchRoles,
        fetchUserDetails,
        createUser,
        updateUser,
        setFilters,
        clearUserDetails
    } = useUserStore();
    {/*hasta aqui*/}
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
        updating,
        totalItems,
        totalPages,
        filters,
        userDetails,
        fetchingDetails,
        fetchUserDetails,
        createUser,
        updateUser,
        handleSearch,
        handlePageChange,
        handleSortChange,
        setFilters,
        clearUserDetails,
    };
}
{/*HOLA aqui pausa1*/}