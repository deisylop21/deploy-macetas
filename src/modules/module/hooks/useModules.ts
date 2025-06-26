import { useEffect } from "react";
import { useModuleStore } from "../states/moduleStore";
import type { CreateModuleDTO } from "../lib/types";

export function useModules() {
    const {
        modules,
        isLoading,
        error,
        creating,
        toggling,
        createError,
        toggleError,
        fetchModules,
        createModule,
        toggleModuleStatus
    } = useModuleStore();

    useEffect(() => {
        fetchModules();
    }, [fetchModules]);

    return {
        modules,
        isLoading,
        error,
        refetch: fetchModules,
        createModule,
        toggleModuleStatus,
        creating,
        toggling,
        createError,
        toggleError
    };
}