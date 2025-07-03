import { create } from 'zustand';
import { moduleService, ModuleFilters } from "../services/moduleService";
import type { Module, CreateModuleDTO } from "../lib/types";

interface ModuleState {
    modules: Module[];
    isLoading: boolean;
    error: string | null;
    creating: boolean;
    toggling: boolean;
    createError: Error | null;
    toggleError: Error | null;
    totalItems: number;
    totalPages: number;
    filters: ModuleFilters;

    fetchModules: () => Promise<void>;
    createModule: (data: CreateModuleDTO) => Promise<void>;
    toggleModuleStatus: (moduleId: string, activate: boolean) => Promise<void>;
    setFilters: (filters: Partial<ModuleFilters>) => void;
}

const initialFilters: ModuleFilters = {
    page: 1,
    limit: 10,
    search: '',
    sortBy: 'name',
    sortOrder: 'asc'
};

export const useModuleStore = create<ModuleState>((set, get) => ({
    modules: [],
    isLoading: false,
    error: null,
    creating: false,
    toggling: false,
    createError: null,
    toggleError: null,
    totalItems: 0,
    totalPages: 0,
    filters: initialFilters,

    fetchModules: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await moduleService.getAllModules(get().filters);
            set({
                modules: response.data,
                isLoading: false,
                totalItems: response.meta.totalItems,
                totalPages: response.meta.totalPages
            });
        } catch (error) {
            set({
                isLoading: false,
                error: error instanceof Error ? error.message : "Error al obtener los módulos"
            });
        }
    },

    createModule: async (data: CreateModuleDTO) => {
        set({ creating: true, createError: null });
        try {
            await moduleService.createModule(data);
            set({ creating: false });
            get().fetchModules();
        } catch (error) {
            set({
                creating: false,
                createError: error instanceof Error ? error : new Error("Error al crear el módulo")
            });
            throw error;
        }
    },

    toggleModuleStatus: async (moduleId: string, activate: boolean) => {
        set({ toggling: true, toggleError: null });
        try {
            await moduleService.updateModuleStatus(moduleId, activate);
            set({ toggling: false });
            get().fetchModules();
        } catch (error) {
            set({
                toggling: false,
                toggleError: error instanceof Error ? error : new Error("Error al cambiar el estado del módulo")
            });
            throw error;
        }
    },

    setFilters: (filters: Partial<ModuleFilters>) => {
        set(state => ({
            filters: { ...state.filters, ...filters }
        }));
        get().fetchModules();
    }
}));