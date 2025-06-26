import { create } from 'zustand';
import { plantFamilyService } from "../../services/plant-family/plantFamilyService";
import type {
    PlantFamily,
    CreatePlantFamilyDTO,
    UpdatePlantFamilyDTO,
    PlantFamilyFilters
} from "../../lib/plant-family/types";

interface PlantFamilyState {
    families: PlantFamily[];
    isLoading: boolean;
    error: string | null;
    creating: boolean;
    updating: boolean;
    deleting: boolean;
    totalItems: number;
    totalPages: number;
    filters: PlantFamilyFilters;

    fetchFamilies: () => Promise<void>;
    createFamily: (data: CreatePlantFamilyDTO) => Promise<void>;
    updateFamily: (id: string, data: UpdatePlantFamilyDTO) => Promise<void>;
    deleteFamily: (id: string) => Promise<void>;
    setFilters: (filters: Partial<PlantFamilyFilters>) => void;
}

const initialFilters: PlantFamilyFilters = {
    page: 1,
    limit: 10,
    search: '',
    sortBy: 'name',
    sortOrder: 'asc'
};

export const usePlantFamilyStore = create<PlantFamilyState>((set, get) => ({
    families: [],
    isLoading: false,
    error: null,
    creating: false,
    updating: false,
    deleting: false,
    totalItems: 0,
    totalPages: 0,
    filters: initialFilters,

    fetchFamilies: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await plantFamilyService.getPlantFamilies(get().filters);
            set({
                families: response.data,
                isLoading: false,
                totalItems: response.meta.totalItems,
                totalPages: response.meta.totalPages
            });
        } catch (error) {
            set({
                isLoading: false,
                error: error instanceof Error ? error.message : "Error al obtener familias de plantas"
            });
        }
    },

    createFamily: async (data: CreatePlantFamilyDTO) => {
        set({ creating: true, error: null });
        try {
            await plantFamilyService.createPlantFamily(data);
            set({ creating: false });
            get().fetchFamilies();
        } catch (error) {
            set({
                creating: false,
                error: error instanceof Error ? error.message : "Error al crear familia de planta"
            });
            throw error;
        }
    },

    updateFamily: async (id: string, data: UpdatePlantFamilyDTO) => {
        set({ updating: true, error: null });
        try {
            await plantFamilyService.updatePlantFamily(id, data);
            set({ updating: false });
            get().fetchFamilies();
        } catch (error) {
            set({
                updating: false,
                error: error instanceof Error ? error.message : "Error al actualizar familia de planta"
            });
            throw error;
        }
    },

    deleteFamily: async (id: string) => {
        set({ deleting: true, error: null });
        try {
            await plantFamilyService.deletePlantFamily(id);
            set({ deleting: false });
            get().fetchFamilies();
        } catch (error) {
            set({
                deleting: false,
                error: error instanceof Error ? error.message : "Error al eliminar familia de planta"
            });
            throw error;
        }
    },

    setFilters: (filters: Partial<PlantFamilyFilters>) => {
        set(state => ({
            filters: { ...state.filters, ...filters }
        }));
        get().fetchFamilies();
    }
}));