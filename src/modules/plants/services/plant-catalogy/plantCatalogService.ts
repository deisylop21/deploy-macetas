import {
    PlantCatalogBasic,
    PlantCatalogDetail,
    PlantCatalogResponse,
    PlantCatalogFilters,
    CreatePlantCatalogDTO,
    UpdatePlantCatalogDTO,
    ImageUploadResponse,
    PlantImage
} from "../../lib/plant-catalogy/types";
import { API_ENDPOINTS } from "../../../core/lib/enpoints";
import { getHeaders, getheadersima } from "../../../core/utils/UtilsFuntions";

export const plantCatalogService = {
    getAllPlants: async (filters: PlantCatalogFilters): Promise<PlantCatalogResponse> => {
        const { page, search, planttype, sortBy, sortOrder } = filters;
        const searchParam = search ? `&search=${search}` : '';
        const typeParam = planttype && planttype !== "Todas las categorías" ? `&planttype=${planttype}` : '';
        const sortByParam = sortBy ? `&sortBy=${sortBy}` : '';
        const sortOrderParam = sortOrder ? `&sortOrder=${sortOrder}` : '';

        const url = `${API_ENDPOINTS.CATALOG_PLANTS}?page=${page}${searchParam}${typeParam}${sortByParam}${sortOrderParam}`;

        const response = await fetch(url, { headers: getHeaders() });
        if (!response.ok) throw new Error("Error al obtener el catálogo de plantas");
        return await response.json();
    },

    getPlantById: async (id: string, fulldata = false): Promise<PlantCatalogDetail> => {
        const url = `${API_ENDPOINTS.CATALOG_PLANT_BY_ID(id)}${fulldata ? "?fulldata=true" : ""}`;
        const response = await fetch(url, { headers: getHeaders() });
        if (!response.ok) throw new Error("Error al obtener la planta");
        return await response.json();
    },

    createPlant: async (plantData: CreatePlantCatalogDTO): Promise<PlantCatalogDetail> => {
        const response = await fetch(API_ENDPOINTS.CATALOG_PLANTS, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(plantData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error al crear la planta");
        }
        return await response.json();
    },

    updatePlant: async (id: string, plantData: UpdatePlantCatalogDTO): Promise<PlantCatalogDetail> => {
        const response = await fetch(API_ENDPOINTS.CATALOG_PLANT_BY_ID(id), {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(plantData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error al actualizar la planta");
        }
        return await response.json();
    },

    deletePlant: async (id: string): Promise<void> => {
        const response = await fetch(API_ENDPOINTS.CATALOG_PLANT_BY_ID(id), {
            method: "DELETE",
            headers: getHeaders()
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error al eliminar la planta");
        }
    },

    uploadImages: async (files: File[]): Promise<ImageUploadResponse> => {
        const formData = new FormData();
        files.forEach(file => formData.append('images', file));
        const response = await fetch(API_ENDPOINTS.PLANT_IMAGES_UPLOAD, {
            method: "POST",
            headers: getheadersima(),
            body: formData
        });
        if (!response.ok) {
            const responseText = await response.text();
            let errorMessage = `Error ${response.status}: ${response.statusText}`;
            try {
                const errorData = JSON.parse(responseText);
                errorMessage = errorData.message || errorMessage;
            } catch {}
            throw new Error(errorMessage);
        }
        try {
            return await response.json();
        } catch {
            return { urls: [], message: "Procesado pero sin poder parsear la respuesta" };
        }
    },

    addImageToPlant: async (plantId: string, formData: FormData): Promise<PlantImage> => {
        try {
            const response = await fetch(`${API_ENDPOINTS.PLANT_IMAGES_LINK}/${plantId}`, {
                method: "POST",
                headers: getheadersima(),
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("❌ Error response:", errorText);
                let errorMessage = `Error ${response.status}: ${response.statusText}`;
                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    console.error("Error parsing error response:", e);
                }
                throw new Error(errorMessage);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error("❌ Error en addImageToPlant:", error);
            throw error;
        }
    },

    updateImageFile: async (imageId: string, formData: FormData): Promise<PlantImage> => {
        try {
            const response = await fetch(`${API_ENDPOINTS.PLANT_IMAGES_BY_ID(imageId)}/update-file`, {
                method: "PUT",
                headers: getheadersima(),
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("❌ Error response:", errorText);
                let errorMessage = `Error ${response.status}: ${response.statusText}`;
                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    console.error("Error parsing error response:", e);
                }
                throw new Error(errorMessage);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error("❌ Error en updateImageFile:", error);
            throw error;
        }
    },

    deleteImage: async (imageId: string): Promise<void> => {
        try {
            const response = await fetch(API_ENDPOINTS.PLANT_IMAGES_BY_ID(imageId), {
                method: "DELETE",
                headers: getHeaders()
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("❌ Error response:", errorText);
                let errorMessage = `Error ${response.status}: ${response.statusText}`;
                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    console.error("Error parsing error response:", e);
                }
                throw new Error(errorMessage);
            }

        } catch (error) {
            console.error("❌ Error en deleteImage:", error);
            throw error;
        }
    }
};