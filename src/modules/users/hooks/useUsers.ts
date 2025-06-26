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
        fetchUsers,
        fetchRoles,
        createUser
    } = useUserStore();

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, [fetchUsers, fetchRoles]);

    return {
        users,
        roles,
        isLoading,
        error,
        creating,
        fetchUsers: () => {
            fetchUsers();
            fetchRoles();
        },
        createUser,
    };
}