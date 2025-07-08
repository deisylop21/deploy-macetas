import { create } from 'zustand';
import { roleService } from "../services/roleService";
import { Role, CreateRoleDTO, validatePermissions, RoleFilters, RoleResponse } from "../lib/types";
import { Module } from "../../module/lib/types";

interface RoleState {
    roles: Role[];
    modules: Module[];
    isLoading: boolean;
    error: string | null;
    creating: boolean;
    totalItems: number;
    totalPages: number;
    filters: RoleFilters;

    fetchRoles: () => Promise<void>;
    fetchModules: () => Promise<void>;
    createRole: (roleData: CreateRoleDTO) => Promise<void>;
    setFilters: (filters: Partial<RoleFilters>) => void;
}

const initialFilters: RoleFilters = {
    page: 1,
    limit: 10,
    search: '',
    sortBy: 'name',
    sortOrder: 'asc'
};

export const useRoleStore = create<RoleState>((set, get) => ({
    roles: [],
    modules: [],
    isLoading: false,
    error: null,
    creating: false,
    totalItems: 0,
    totalPages: 0,
    filters: initialFilters,

    fetchRoles: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await roleService.getAllRoles(get().filters);
            set({
                roles: response.data,
                totalItems: response.meta.totalItems,
                totalPages: response.meta.totalPages,
                isLoading: false
            });
        } catch (error) {
            set({
                isLoading: false,
                error: error instanceof Error ? error.message : "Error al obtener los roles"
            });
        }
    },

    fetchModules: async () => {
        set({ isLoading: true, error: null });
        try {
            const modules = await roleService.getAllModules();
            set({ modules, isLoading: false });
        } catch (error) {
            set({
                isLoading: false,
                error: error instanceof Error ? error.message : "Error al obtener los módulos"
            });
        }
    },

    createRole: async (roleData: CreateRoleDTO) => {
        set({ creating: true, error: null });
        try {
            const hasInvalidPermissions = roleData.permissions.some(
                modulePermission => !validatePermissions(modulePermission.permissions)
            );
            if (hasInvalidPermissions) {
                throw new Error("Si se selecciona Crear, Editar o Eliminar, el permiso Ver debe estar incluido");
            }

            await roleService.createRole(roleData);

            await get().fetchRoles();

            set({ creating: false });
        } catch (error) {
            set({
                creating: false,
                error: error instanceof Error ? error.message : "Error al crear el rol"
            });
            throw error;
        }
    },

    setFilters: (filters: Partial<RoleFilters>) => {
        set(state => ({
            filters: { ...state.filters, ...filters }
        }));
        get().fetchRoles();
    }
}));