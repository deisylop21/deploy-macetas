import { create } from 'zustand';
import { plantSpeciesService } from "../../services/plant-species/plantSpeciesService";
import type { PlantSpecies, CreatePlantSpeciesDTO, UpdatePlantSpeciesDTO, PlantSpeciesFilters } from "../../lib/plant-species/types";

interface PlantSpeciesState {
    species: PlantSpecies[];
    isLoading: boolean;
    error: string | null;
    creating: boolean;
    updating: boolean;
    deleting: boolean;
    totalItems: number;
    totalPages: number;
    filters: PlantSpeciesFilters;

    fetchSpecies: () => Promise<void>;
    createSpecies: (data: CreatePlantSpeciesDTO) => Promise<void>;
    updateSpecies: (id: string, data: UpdatePlantSpeciesDTO) => Promise<void>;
    deleteSpecies: (id: string) => Promise<void>;
    setFilters: (filters: Partial<PlantSpeciesFilters>) => void;
}

const initialFilters: PlantSpeciesFilters = {
    page: 1,
    search: '',
    sortBy: 'name',
    sortOrder: 'asc'
};

export const usePlantSpeciesStore = create<PlantSpeciesState>((set, get) => ({
    species: [],
    isLoading: false,
    error: null,
    creating: false,
    updating: false,
    deleting: false,
    totalItems: 0,
    totalPages: 0,
    filters: initialFilters,

    fetchSpecies: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await plantSpeciesService.getPlantSpecies(get().filters);
            set({
                species: response.data,
                isLoading: false,
                totalItems: response.meta.totalItems,
                totalPages: response.meta.totalPages
            });
        } catch (error) {
            set({
                isLoading: false,
                error: error instanceof Error ? error.message : "Error al obtener especies de plantas"
            });
        }
    },

    createSpecies: async (data: CreatePlantSpeciesDTO) => {
        set({ creating: true, error: null });
        try {
            const newSpecies = await plantSpeciesService.createPlantSpecies(data);
            set(state => ({
                species: [...state.species, newSpecies],
                creating: false
            }));
            get().fetchSpecies();
        } catch (error) {
            set({
                creating: false,
                error: error instanceof Error ? error.message : "Error al crear especie de planta"
            });
            throw error;
        }
    },

    updateSpecies: async (id: string, data: UpdatePlantSpeciesDTO) => {
        set({ updating: true, error: null });
        try {
            const updatedSpecies = await plantSpeciesService.updatePlantSpecies(id, data);
            set(state => ({
                species: state.species.map(species =>
                    species.id === id ? updatedSpecies : species
                ),
                updating: false
            }));
        } catch (error) {
            set({
                updating: false,
                error: error instanceof Error ? error.message : "Error al actualizar especie de planta"
            });
            throw error;
        }
    },

    deleteSpecies: async (id: string) => {
        set({ deleting: true, error: null });
        try {
            await plantSpeciesService.deletePlantSpecies(id);
            set(state => ({
                species: state.species.filter(species => species.id !== id),
                deleting: false
            }));
            get().fetchSpecies();
        } catch (error) {
            set({
                deleting: false,
                error: error instanceof Error ? error.message : "Error al eliminar especie de planta"
            });
            throw error;
        }
    },

    setFilters: (filters: Partial<PlantSpeciesFilters>) => {
        set(state => ({
            filters: { ...state.filters, ...filters }
        }));
        get().fetchSpecies();
    }
}));