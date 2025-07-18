import { create } from 'zustand';
import { userGeneralService } from "../services/userGeneralService";
import { UserGeneral, UserGeneralFilters, UpdateUserGeneralDTO } from "../lib/types";

interface UserGeneralState {
    users: UserGeneral[];
    isLoading: boolean;
    error: string | null;
    fetchingDetails: boolean;
    userDetails: UserGeneral | null;
    filters: UserGeneralFilters;
    totalItems: number;
    totalPages: number;
    updating: boolean;

    fetchUsers: () => Promise<void>;
    fetchUserDetails: (id: string) => Promise<void>;
    updateUserStatus: (id: string, data: UpdateUserGeneralDTO) => Promise<void>;
    setFilters: (filters: Partial<UserGeneralFilters>) => void;
    clearUserDetails: () => void;
}

const initialFilters: UserGeneralFilters = {
    page: 1,
    limit: 10,
    search: '',
    sortBy: 'name',
    sortOrder: 'asc',
};

export const useUserGeneralStore = create<UserGeneralState>((set, get) => ({
    users: [],
    isLoading: false,
    error: null,
    fetchingDetails: false,
    userDetails: null,
    filters: initialFilters,
    totalItems: 0,
    totalPages: 0,
    updating: false,

    fetchUsers: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await userGeneralService.getAll(get().filters);
            set({
                users: response.data,
                isLoading: false,
                totalItems: response.meta?.totalItems || 0,
                totalPages: response.meta?.totalPages || 1
            });
        } catch (error) {
            set({
                isLoading: false,
                error: error instanceof Error ? error.message : "Error al obtener los usuarios generales"
            });
        }
    },

    fetchUserDetails: async (id: string) => {
        set({ fetchingDetails: true, error: null });
        try {
            const user = await userGeneralService.getById(id);
            set({ userDetails: user, fetchingDetails: false });
        } catch (error) {
            set({
                fetchingDetails: false,
                error: error instanceof Error ? error.message : "Error al obtener detalles del usuario"
            });
        }
    },

    updateUserStatus: async (id: string, data: UpdateUserGeneralDTO) => {
        set({ updating: true, error: null });
        try {
            await userGeneralService.updateStatus(id, data);
            set({ updating: false });
            await get().fetchUsers();
        } catch (error) {
            set({
                updating: false,
                error: error instanceof Error ? error.message : "Error al actualizar el estado"
            });
        }
    },

    setFilters: (filters: Partial<UserGeneralFilters>) => {
        set(state => ({
            filters: { ...state.filters, ...filters }
        }));
        get().fetchUsers();
    },

    clearUserDetails: () => {
        set({ userDetails: null });
    }
}));