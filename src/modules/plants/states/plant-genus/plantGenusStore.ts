import { create } from 'zustand';
import { plantGenusService } from "../../services/plant-genus/plantGenusService";
import type { PlantGenus, CreatePlantGenusDTO, UpdatePlantGenusDTO, PlantGenusFilters } from "../../lib/plant-genus/types";

interface PlantGenusState {
    genera: PlantGenus[];
    isLoading: boolean;
    error: string | null;
    creating: boolean;
    updating: boolean;
    deleting: boolean;
    totalItems: number;
    totalPages: number;
    filters: PlantGenusFilters;

    fetchGenera: () => Promise<void>;
    createGenus: (data: CreatePlantGenusDTO) => Promise<void>;
    updateGenus: (id: string, data: UpdatePlantGenusDTO) => Promise<void>;
    deleteGenus: (id: string) => Promise<void>;
    setFilters: (filters: Partial<PlantGenusFilters>) => void;
}

const initialFilters: PlantGenusFilters = {
    page: 1,
    limit: 10,
    search: '',
    sortBy: 'name',
    sortOrder: 'asc'
};

export const usePlantGenusStore = create<PlantGenusState>((set, get) => ({
    genera: [],
    isLoading: false,
    error: null,
    creating: false,
    updating: false,
    deleting: false,
    totalItems: 0,
    totalPages: 0,
    filters: initialFilters,

    fetchGenera: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await plantGenusService.getPlantGenera(get().filters);
            set({
                genera: response.data,
                isLoading: false,
                totalItems: response.meta.totalItems,
                totalPages: response.meta.totalPages
            });
        } catch (error) {
            set({
                isLoading: false,
                error: error instanceof Error ? error.message : "Error al obtener géneros de plantas"
            });
        }
    },

    createGenus: async (data: CreatePlantGenusDTO) => {
        set({ creating: true, error: null });
        try {
            const newGenus = await plantGenusService.createPlantGenus(data);
            set(state => ({
                genera: [...state.genera, newGenus],
                creating: false
            }));
            get().fetchGenera();
        } catch (error) {
            set({
                creating: false,
                error: error instanceof Error ? error.message : "Error al crear género de planta"
            });
            throw error;
        }
    },

    updateGenus: async (id: string, data: UpdatePlantGenusDTO) => {
        set({ updating: true, updateError: null });
        try {
            await plantGenusService.updatePlantGenus(id, data);
            await get().fetchGenera();
            set({ updating: false });
        } catch (error) {
            set({
                updating: false,
                updateError: error instanceof Error ? error : new Error("Error al actualizar género de planta")
            });
            throw error;
        }
    },

    deleteGenus: async (id: string) => {
        set({ deleting: true, error: null });
        try {
            await plantGenusService.deletePlantGenus(id);
            set(state => ({
                genera: state.genera.filter(genus => genus.id !== id),
                deleting: false
            }));
            get().fetchGenera();
        } catch (error) {
            set({
                deleting: false,
                error: error instanceof Error ? error.message : "Error al eliminar género de planta"
            });
            throw error;
        }
    },

    setFilters: (filters: Partial<PlantGenusFilters>) => {
        set(state => ({
            filters: { ...state.filters, ...filters }
        }));
        get().fetchGenera();
    }
}));