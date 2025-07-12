import { create } from 'zustand';
import { plantCatalogService } from "../../services/plant-catalogy/plantCatalogService";
import type {
    PlantCatalogBasic,
    PlantCatalogDetail,
    PlantCatalogFilters,
    CreatePlantCatalogDTO,
    UpdatePlantCatalogDTO
} from "../../lib/plant-catalogy/types";

interface PlantCatalogState {
    plants: PlantCatalogBasic[];
    selectedPlant: PlantCatalogDetail | null;
    isLoading: boolean;
    isLoadingDetail: boolean;
    error: string | null;

    creating: boolean;
    updating: boolean;
    deleting: boolean;
    uploading: boolean;

    totalItems: number;
    totalPages: number;
    filters: PlantCatalogFilters;

    uploadedImageUrls: string[];

    fetchPlants: () => Promise<void>;
    fetchPlantById: (id: string) => Promise<void>;
    createPlant: (data: CreatePlantCatalogDTO) => Promise<void>;
    updatePlant: (id: string, data: UpdatePlantCatalogDTO) => Promise<void>;
    deletePlant: (id: string) => Promise<void>;
    uploadImages: (files: File[]) => Promise<void>;
    setFilters: (filters: Partial<PlantCatalogFilters>) => void;
    resetUploadedImages: () => void;
}

const initialFilters: PlantCatalogFilters = {
    page: 1,
    search: '',
    planttype: 'Todas las categorías'
};

export const usePlantCatalogStore = create<PlantCatalogState>((set, get) => ({
    plants: [],
    selectedPlant: null,
    isLoading: false,
    isLoadingDetail: false,
    error: null,
    creating: false,
    updating: false,
    deleting: false,
    uploading: false,
    totalItems: 0,
    totalPages: 0,
    filters: initialFilters,
    uploadedImageUrls: [],

    fetchPlants: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await plantCatalogService.getAllPlants(get().filters);
            set({
                plants: response.data,
                isLoading: false,
                totalItems: response.meta.totalItems,
                totalPages: response.meta.totalPages
            });
        } catch (error) {
            set({
                isLoading: false,
                error: error instanceof Error ? error.message : "Error al obtener plantas"
            });
        }
    },

    fetchPlantById: async (id: string) => {
        set({ isLoadingDetail: true, error: null });
        try {
            const plant = await plantCatalogService.getPlantById(id, true); // fulldata=true para taxonomía
            set({ selectedPlant: plant, isLoadingDetail: false });
        } catch (error) {
            set({
                isLoadingDetail: false,
                error: error instanceof Error ? error.message : "Error al obtener detalle de planta"
            });
        }
    },

    createPlant: async (data: CreatePlantCatalogDTO) => {
        set({ creating: true, error: null });
        try {
            await plantCatalogService.createPlant(data);
            set({ creating: false, uploadedImageUrls: [] });
            get().fetchPlants();
        } catch (error) {
            set({
                creating: false,
                error: error instanceof Error ? error.message : "Error al crear planta"
            });
            throw error;
        }
    },

    updatePlant: async (id: string, data: UpdatePlantCatalogDTO) => {
        set({ updating: true, error: null });
        try {
            const updatedPlant = await plantCatalogService.updatePlant(id, data);
            set({
                updating: false,
                selectedPlant: updatedPlant,
                uploadedImageUrls: []
            });
            get().fetchPlants();
        } catch (error) {
            set({
                updating: false,
                error: error instanceof Error ? error.message : "Error al actualizar planta"
            });
            throw error;
        }
    },

    deletePlant: async (id: string) => {
        set({ deleting: true, error: null });
        try {
            await plantCatalogService.deletePlant(id);
            set({
                deleting: false,
                plants: get().plants.filter(plant => plant.id !== id),
                selectedPlant: null
            });
        } catch (error) {
            set({
                deleting: false,
                error: error instanceof Error ? error.message : "Error al eliminar planta"
            });
            throw error;
        }
    },

    uploadImages: async (files: File[]) => {
        if (files.length === 0) return;

        set({ uploading: true, error: null });
        try {
            const response = await plantCatalogService.uploadImages(files);
            set({
                uploading: false,
                uploadedImageUrls: [...get().uploadedImageUrls, ...response.urls].slice(0, 5)
            });
        } catch (error) {
            set({
                uploading: false,
                error: error instanceof Error ? error.message : "Error al cargar imágenes"
            });
            throw error;
        }
    },

    setFilters: (filters: Partial<PlantCatalogFilters>) => {
        set(state => ({
            filters: { ...state.filters, ...filters }
        }));
        get().fetchPlants();
    },

    resetUploadedImages: () => {
        set({ uploadedImageUrls: [] });
    }
}));