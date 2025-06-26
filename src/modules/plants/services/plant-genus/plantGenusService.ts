import { PlantGenus, PlantGenusResponse, CreatePlantGenusDTO, UpdatePlantGenusDTO, PlantGenusFilters } from "../../lib/plant-genus/types.ts";
import { API_ENDPOINTS } from "../../../core/lib/enpoints.ts";
import { getHeaders } from "../../../core/utils/UtilsFuntions.ts";

export const plantGenusService = {
    getPlantGenera: async (filters: PlantGenusFilters): Promise<PlantGenusResponse> => {
        try {
            const { page, search, sortBy, sortOrder } = filters;
            const searchParam = search ? `&search=${search}` : '';
            const sortParams = sortBy ? `&sortBy=${sortBy}&sortOrder=${sortOrder}` : '';

            const url = `${API_ENDPOINTS.PLANT_GENERA}?page=${page}&${searchParam}${sortParams}`;

            const response = await fetch(url, {
                headers: getHeaders()
            });

            if (!response.ok) {
                throw new Error("Error al obtener los géneros de plantas");
            }

            return await response.json();
        } catch (error) {
            console.error("Error en getPlantGenera:", error);
            throw error;
        }
    },

    getPlantGenusById: async (id: string): Promise<PlantGenus> => {
        try {
            const response = await fetch(API_ENDPOINTS.PLANT_GENUS_BY_ID(id), {
                headers: getHeaders()
            });

            if (!response.ok) {
                throw new Error("Error al obtener el género de planta");
            }

            return await response.json();
        } catch (error) {
            console.error("Error en getPlantGenusById:", error);
            throw error;
        }
    },

    createPlantGenus: async (genusData: CreatePlantGenusDTO): Promise<PlantGenus> => {
        try {
            const response = await fetch(API_ENDPOINTS.PLANT_GENERA, {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify(genusData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al crear el género de planta");
            }

            return await response.json();
        } catch (error) {
            console.error("Error en createPlantGenus:", error);
            throw error;
        }
    },

    updatePlantGenus: async (id: string, genusData: UpdatePlantGenusDTO): Promise<PlantGenus> => {
        try {
            const response = await fetch(API_ENDPOINTS.PLANT_GENUS_BY_ID(id), {
                method: "PUT",
                headers: getHeaders(),
                body: JSON.stringify(genusData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al actualizar el género de planta");
            }

            return await response.json();
        } catch (error) {
            console.error("Error en updatePlantGenus:", error);
            throw error;
        }
    },

    deletePlantGenus: async (id: string): Promise<void> => {
        try {
            const response = await fetch(API_ENDPOINTS.PLANT_GENUS_BY_ID(id), {
                method: "DELETE",
                headers: getHeaders()
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al eliminar el género de planta");
            }
        } catch (error) {
            console.error("Error en deletePlantGenus:", error);
            throw error;
        }
    }
};