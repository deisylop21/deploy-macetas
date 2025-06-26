import { PlantSpecies, PlantSpeciesResponse, CreatePlantSpeciesDTO, UpdatePlantSpeciesDTO, PlantSpeciesFilters } from "../../lib/plant-species/types.ts";
import { API_ENDPOINTS } from "../../../core/lib/enpoints.ts";
import { getHeaders } from "../../../core/utils/UtilsFuntions.ts";

export const plantSpeciesService = {
    getPlantSpecies: async (filters: PlantSpeciesFilters): Promise<PlantSpeciesResponse> => {
        try {
            const { page, search, sortBy, sortOrder } = filters;
            const searchParam = search ? `&search=${search}` : '';
            const sortParams = sortBy ? `&sortBy=${sortBy}&sortOrder=${sortOrder}` : '';

            const url = `${API_ENDPOINTS.PLANT_SPECIES}?page=${page}&${searchParam}${sortParams}`;

            const response = await fetch(url, {
                headers: getHeaders()
            });

            if (!response.ok) {
                throw new Error("Error al obtener las especies de plantas");
            }

            return await response.json();
        } catch (error) {
            console.error("Error en getPlantSpecies:", error);
            throw error;
        }
    },

    getPlantSpeciesById: async (id: string): Promise<PlantSpecies> => {
        try {
            const response = await fetch(API_ENDPOINTS.PLANT_SPECIES_BY_ID(id), {
                headers: getHeaders()
            });

            if (!response.ok) {
                throw new Error("Error al obtener la especie de planta");
            }

            return await response.json();
        } catch (error) {
            console.error("Error en getPlantSpeciesById:", error);
            throw error;
        }
    },

    createPlantSpecies: async (speciesData: CreatePlantSpeciesDTO): Promise<PlantSpecies> => {
        try {
            const response = await fetch(API_ENDPOINTS.PLANT_SPECIES, {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify(speciesData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al crear la especie de planta");
            }

            return await response.json();
        } catch (error) {
            console.error("Error en createPlantSpecies:", error);
            throw error;
        }
    },

    updatePlantSpecies: async (id: string, speciesData: UpdatePlantSpeciesDTO): Promise<PlantSpecies> => {
        try {
            const response = await fetch(API_ENDPOINTS.PLANT_SPECIES_BY_ID(id), {
                method: "PUT",
                headers: getHeaders(),
                body: JSON.stringify(speciesData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al actualizar la especie de planta");
            }

            return await response.json();
        } catch (error) {
            console.error("Error en updatePlantSpecies:", error);
            throw error;
        }
    },

    deletePlantSpecies: async (id: string): Promise<void> => {
        try {
            const response = await fetch(API_ENDPOINTS.PLANT_SPECIES_BY_ID(id), {
                method: "DELETE",
                headers: getHeaders()
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al eliminar la especie de planta");
            }
        } catch (error) {
            console.error("Error en deletePlantSpecies:", error);
            throw error;
        }
    }
};