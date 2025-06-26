import {
    PlantFamily,
    PlantFamilyResponse,
    CreatePlantFamilyDTO,
    UpdatePlantFamilyDTO,
    PlantFamilyFilters,
} from "../../lib/plant-family/types";
import { API_ENDPOINTS } from "../../../core/lib/enpoints";
import { getHeaders } from "../../../core/utils/UtilsFuntions";

export const plantFamilyService = {
    getPlantFamilies: async (filters: PlantFamilyFilters): Promise<PlantFamilyResponse> => {
        const { page, search, sortBy, sortOrder } = filters;
        const params = [
            `page=${page}`,
            search ? `search=${encodeURIComponent(search)}` : "",
            sortBy ? `sortBy=${sortBy}` : "",
            sortOrder ? `sortOrder=${sortOrder}` : ""
        ].filter(Boolean).join("&");
        const url = `${API_ENDPOINTS.PLANT_FAMILIES}?${params}`;

        const response = await fetch(url, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error("Error al obtener familias de plantas");
        return await response.json();
    },

    getPlantFamilyById: async (id: string): Promise<PlantFamily> => {
        const response = await fetch(API_ENDPOINTS.PLANT_FAMILY_BY_ID(id), {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error("Error al obtener la familia de planta");
        return await response.json();
    },

    createPlantFamily: async (data: CreatePlantFamilyDTO): Promise<PlantFamily> => {
        const response = await fetch(API_ENDPOINTS.PLANT_FAMILIES, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error al crear la familia");
        }
        return await response.json();
    },

    updatePlantFamily: async (id: string, data: UpdatePlantFamilyDTO): Promise<PlantFamily> => {
        const response = await fetch(API_ENDPOINTS.PLANT_FAMILY_BY_ID(id), {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error al actualizar la familia");
        }
        return await response.json();
    },

    deletePlantFamily: async (id: string): Promise<void> => {
        const response = await fetch(API_ENDPOINTS.PLANT_FAMILY_BY_ID(id), {
            method: "DELETE",
            headers: getHeaders()
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error al eliminar la familia");
        }
    }
};