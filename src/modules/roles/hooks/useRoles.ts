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
        fetchRoles,
        fetchModules,
        createRole
    } = useRoleStore();

    useEffect(() => {
        fetchRoles();
        fetchModules();
    }, [fetchRoles, fetchModules]);

    return {
        roles,
        modules,
        isLoading,
        error,
        creating,
        fetchRoles: () => {
            fetchRoles();
            fetchModules();
        },
        createRole,
    };
}