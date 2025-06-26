import { create } from 'zustand';
import { moduleService } from "../services/moduleService";
import type { Module, CreateModuleDTO } from "../lib/types";

interface ModuleState {
    modules: Module[];
    isLoading: boolean;
    error: string | null;
    creating: boolean;
    toggling: boolean;
    createError: Error | null;
    toggleError: Error | null;

    fetchModules: () => Promise<void>;
    createModule: (data: CreateModuleDTO) => Promise<void>;
    toggleModuleStatus: (moduleId: string, activate: boolean) => Promise<void>;
}

export const useModuleStore = create<ModuleState>((set, get) => ({
    modules: [],
    isLoading: false,
    error: null,
    creating: false,
    toggling: false,
    createError: null,
    toggleError: null,

    fetchModules: async () => {
        set({ isLoading: true, error: null });
        try {
            const modules = await moduleService.getAllModules();
            set({ modules, isLoading: false });
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
            const newModule = await moduleService.createModule(data);
            set(state => ({
                modules: [...state.modules, newModule],
                creating: false
            }));
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
            const updatedModule = await moduleService.updateModuleStatus(moduleId, activate);

            set(state => ({
                modules: state.modules.map(module =>
                    module.id === moduleId ? updatedModule : module
                ),
                toggling: false
            }));
        } catch (error) {
            set({
                toggling: false,
                toggleError: error instanceof Error ? error : new Error("Error al cambiar el estado del módulo")
            });
            throw error;
        }
    }
}));