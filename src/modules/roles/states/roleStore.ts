import { create } from 'zustand';
import { roleService } from "../services/roleService";
import { Role, CreateRoleDTO, validatePermissions } from "../lib/types";
import { Module } from "../../module/lib/types";

interface RoleState {
    roles: Role[];
    modules: Module[];
    isLoading: boolean;
    error: string | null;
    creating: boolean;


    fetchRoles: () => Promise<void>;
    fetchModules: () => Promise<void>;
    createRole: (roleData: CreateRoleDTO) => Promise<void>;
}

export const useRoleStore = create<RoleState>((set, get) => ({
    roles: [],
    modules: [],
    isLoading: false,
    error: null,
    creating: false,

    fetchRoles: async () => {
        set({ isLoading: true, error: null });
        try {
            const roles = await roleService.getAllRoles();
            set({ roles, isLoading: false });
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
            // Validación de permisos
            const hasInvalidPermissions = roleData.permissions.some(
                modulePermission => !validatePermissions(modulePermission.permissions)
            );
            if (hasInvalidPermissions) {
                throw new Error("Si se selecciona Crear, Editar o Eliminar, el permiso Ver debe estar incluido");
            }

            // Crear el rol
            const newRole = await roleService.createRole(roleData);

            // Actualizar el estado
            set(state => ({
                roles: [...state.roles, newRole],
                creating: false
            }));
        } catch (error) {
            set({
                creating: false,
                error: error instanceof Error ? error.message : "Error al crear el rol"
            });
            throw error;
        }
    }
}));