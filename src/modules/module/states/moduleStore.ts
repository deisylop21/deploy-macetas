import { create } from 'zustand';
import { moduleService, ModuleFilters } from "../services/moduleService";
import type { Module, CreateModuleDTO } from "../lib/types";

interface ModuleState {
    modules: Module[];
    isLoading: boolean;
    error: string | null;
    creating: boolean;
    updating: boolean;
    deleting: boolean;
    toggling: boolean;
    createError: Error | null;
    updateError: Error | null;
    deleteError: Error | null;
    toggleError: Error | null;
    totalItems: number;
    totalPages: number;
    filters: ModuleFilters;

    fetchModules: () => Promise<void>;
    createModule: (data: CreateModuleDTO) => Promise<void>;
    updateModule: (id: string, data: Partial<Module>) => Promise<void>;
    deleteModule: (id: string) => Promise<void>;
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
    updating: false,
    deleting: false,
    toggling: false,
    createError: null,
    updateError: null,
    deleteError: null,
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
            await get().fetchModules();
        } catch (error) {
            set({
                creating: false,
                createError: error instanceof Error ? error : new Error("Error al crear el módulo")
            });
            throw error;
        }
    },

    updateModule: async (id: string, data: Partial<Module>) => {
        set({ updating: true, updateError: null });
        try {
            await moduleService.updateModule(id, data);
            set({ updating: false });
            await get().fetchModules();
        } catch (error) {
            set({
                updating: false,
                updateError: error instanceof Error ? error : new Error("Error al actualizar el módulo")
            });
            throw error;
        }
    },

    deleteModule: async (id: string) => {
        set({ deleting: true, deleteError: null });
        try {
            await moduleService.deleteModule(id);
            set({ deleting: false });
            await get().fetchModules();
        } catch (error) {
            set({
                deleting: false,
                deleteError: error instanceof Error ? error : new Error("Error al eliminar el módulo")
            });
            throw error;
        }
    },

    toggleModuleStatus: async (moduleId: string, activate: boolean) => {
        set({ toggling: true, toggleError: null });
        try {
            await moduleService.updateModuleStatus(moduleId, activate);
            set({ toggling: false });
            await get().fetchModules();
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