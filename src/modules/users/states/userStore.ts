import { create } from 'zustand';
import { userService } from "../services/userService";
import { User, CreateUserDTO, Role, UserFilters } from "../lib/types";

interface UserState {
    users: User[];
    roles: Role[];
    isLoading: boolean;
    error: string | null;
    creating: boolean;
    totalItems: number;
    totalPages: number;
    filters: UserFilters;

    fetchUsers: () => Promise<void>;
    fetchRoles: () => Promise<void>;
    createUser: (userData: CreateUserDTO) => Promise<void>;
    setFilters: (filters: Partial<UserFilters>) => void;
}

const initialFilters: UserFilters = {
    page: 1,
    limit: 10,
    search: '',
    sortBy: 'name',
    sortOrder: 'asc'
};

export const useUserStore = create<UserState>((set, get) => ({
    users: [],
    roles: [],
    isLoading: false,
    error: null,
    creating: false,
    totalItems: 0,
    totalPages: 0,
    filters: initialFilters,

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

    setFilters: (filters: Partial<UserFilters>) => {
        set(state => ({
            filters: { ...state.filters, ...filters }
        }));
        get().fetchUsers();
    }
}));