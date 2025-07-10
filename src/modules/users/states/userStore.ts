import { create } from 'zustand';
import { userService } from "../services/userService";
import { User, CreateUserDTO, EditUserDTO, Role, UserFilters } from "../lib/types";
{/*pausaaa*/}
interface UserState {
    users: User[];
    roles: Role[];
    isLoading: boolean;
    error: string | null;
    creating: boolean;
    updating: boolean;
    fetchingDetails: boolean;
    userDetails: User | null;
    filters: UserFilters;
    totalItems: number;
    totalPages: number;

    fetchUsers: () => Promise<void>;
    fetchRoles: () => Promise<void>;
    fetchUserDetails: (id: string) => Promise<void>;
    createUser: (userData: CreateUserDTO) => Promise<void>;
    updateUser: (id: string, data: EditUserDTO) => Promise<void>;
    setFilters: (filters: Partial<UserFilters>) => void;
    clearUserDetails: () => void;
}

const initialFilters: UserFilters = {
    page: 1,
    limit: 10,
    search: '',
    sortBy: 'name',
    sortOrder: 'asc',
    roleId: '',
};

export const useUserStore = create<UserState>((set, get) => ({
    users: [],
    roles: [],
    isLoading: false,
    error: null,
    creating: false,
    updating: false,
    fetchingDetails: false,
    userDetails: null,
    filters: initialFilters,
    totalItems: 0,
    totalPages: 0,

    fetchUsers: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await userService.getAllUsers(get().filters);
            set({
                users: response.data,
                isLoading: false,
                totalItems: response.meta.totalItems,
                totalPages: response.meta.totalPages
            });
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

    fetchUserDetails: async (id: string) => {
        set({ fetchingDetails: true, error: null });
        try {
            const user = await userService.getUserById(id);
            set({ userDetails: user, fetchingDetails: false });
        } catch (error) {
            set({
                fetchingDetails: false,
                error: error instanceof Error ? error.message : "Error al obtener detalles del usuario"
            });
        }
    },

    createUser: async (userData: CreateUserDTO) => {
        set({ creating: true, error: null });
        try {
            await userService.createUser(userData);
            set({ creating: false });
            get().fetchUsers();
        } catch (error) {
            set({
                creating: false,
                error: error instanceof Error ? error.message : "Error al crear el usuario"
            });
            throw error;
        }
    },

    updateUser: async (id: string, data: EditUserDTO) => {
        set({ updating: true, error: null });
        try {
            await userService.updateUser(id, data);
            set({ updating: false });
            await get().fetchUsers();
        } catch (error) {
            set({
                updating: false,
                error: error instanceof Error ? error.message : "Error al actualizar el usuario"
            });
            throw error;
        }
    },

    setFilters: (filters: Partial<UserFilters>) => {
        set(state => ({
            filters: { ...state.filters, ...filters }
        }));
        get().fetchUsers();
    },

    clearUserDetails: () => {
        set({ userDetails: null });
    }
}));
{/*HOLA aqui pausa1*/}