import { create } from 'zustand';
import { userService } from "../services/userService";
import { User, CreateUserDTO, Role } from "../lib/types";

interface UserState {
    users: User[];
    roles: Role[];
    isLoading: boolean;
    error: string | null;
    creating: boolean;

    fetchUsers: () => Promise<void>;
    fetchRoles: () => Promise<void>;
    createUser: (userData: CreateUserDTO) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
    users: [],
    roles: [],
    isLoading: false,
    error: null,
    creating: false,

    fetchUsers: async () => {
        set({ isLoading: true, error: null });
        try {
            const users = await userService.getAllUsers();
            set({ users, isLoading: false });
        } catch (error) {
            set({
                isLoading: false,
                error: error instanceof Error ? error.message : "Error al obtener los usuarios"
            });
        }
    },

    fetchRoles: async () => {
        set({ isLoading: true, error: null });
        try {
            const roles = await userService.getAllRoles();
            set({ roles, isLoading: false });
        } catch (error) {
            set({
                isLoading: false,
                error: error instanceof Error ? error.message : "Error al obtener los roles"
            });
        }
    },

    createUser: async (userData: CreateUserDTO) => {
        set({ creating: true, error: null });
        try {
            // Crear el usuario
            const newUser = await userService.createUser(userData);

            // Actualizar el estado
            set(state => ({
                users: [...state.users, newUser],
                creating: false
            }));
        } catch (error) {
            set({
                creating: false,
                error: error instanceof Error ? error.message : "Error al crear el usuario"
            });
            throw error;
        }
    }
}));