import {
    PlantCatalogBasic,
    PlantCatalogDetail,
    PlantCatalogResponse,
    PlantCatalogFilters,
    CreatePlantCatalogDTO,
    UpdatePlantCatalogDTO,
    ImageUploadResponse
} from "../../lib/plant-catalogy/types.ts";
import { API_ENDPOINTS } from "../../../core/lib/enpoints.ts";
import {getHeaders, getheadersima, getHeadersimage} from "../../../core/utils/UtilsFuntions.ts";
import { compressImage, isFileTooLarge } from "../../utils/plant-catalogy/ImageCompressor";

export const plantCatalogService = {
    getAllPlants: async (filters: PlantCatalogFilters): Promise<PlantCatalogResponse> => {
        try {
            const { page, search, planttype, sortBy, sortOrder } = filters;
            const searchParam = search ? `&search=${search}` : '';
            const typeParam = planttype && planttype !== "Todas las categorías" ? `&planttype=${planttype}` : '';
            const sortByParam = sortBy ? `&sortBy=${sortBy}` : '';
            const sortOrderParam = sortOrder ? `&sortOrder=${sortOrder}` : '';

            const url = `${API_ENDPOINTS.CATALOG_PLANTS}?page=${page}${searchParam}${typeParam}${sortByParam}${sortOrderParam}`;

            const response = await fetch(url, {
                headers: getHeaders()
            });

            if (!response.ok) {
                throw new Error("Error al obtener el catálogo de plantas");
            }

            return await response.json();
        } catch (error) {
            console.error("Error en getAllPlants:", error);
            throw error;
        }
    },

    getPlantById: async (id: string): Promise<PlantCatalogDetail> => {
        try {
            const response = await fetch(API_ENDPOINTS.CATALOG_PLANT_BY_ID(id), {
                headers: getHeaders()
            });

            if (!response.ok) {
                throw new Error("Error al obtener la planta");
            }

            return await response.json();
        } catch (error) {
            console.error("Error en getPlantById:", error);
            throw error;
        }
    },

    createPlant: async (plantData: CreatePlantCatalogDTO): Promise<PlantCatalogDetail> => {
        try {
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
        } catch (error) {
            console.error("Error en createPlant:", error);
            throw error;
        }
    },

    updatePlant: async (id: string, plantData: UpdatePlantCatalogDTO): Promise<PlantCatalogDetail> => {
        try {
            const transformedData: any = { ...plantData };

            if (transformedData.familyId || transformedData.genusId || transformedData.speciesId) {
                transformedData.taxonomy = {
                    update: {}
                };

                if (transformedData.familyId) {
                    transformedData.taxonomy.update.family = {
                        connect: { id: transformedData.familyId }
                    };
                    delete transformedData.familyId;
                }

                if (transformedData.genusId) {
                    transformedData.taxonomy.update.genus = {
                        connect: { id: transformedData.genusId }
                    };
                    delete transformedData.genusId;
                }

                if (transformedData.speciesId) {
                    transformedData.taxonomy.update.species = {
                        connect: { id: transformedData.speciesId }
                    };
                    delete transformedData.speciesId;
                }
            }

            const response = await fetch(API_ENDPOINTS.CATALOG_PLANT_BY_ID(id), {
                method: "PUT",
                headers: getHeaders(),
                body: JSON.stringify(transformedData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al actualizar la planta");
            }

            return await response.json();
        } catch (error) {
            console.error("Error en updatePlant:", error);
            throw error;
        }
    },

    deletePlant: async (id: string): Promise<void> => {
        try {
            const response = await fetch(API_ENDPOINTS.CATALOG_PLANT_BY_ID(id), {
                method: "DELETE",
                headers: getHeaders()
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al eliminar la planta");
            }
        } catch (error) {
            console.error("Error en deletePlant:", error);
            throw error;
        }
    },

    uploadImages: async (files: File[]): Promise<ImageUploadResponse> => {
        try {
            const formData = new FormData();

            files.forEach(file => {
                formData.append('images', file);
            });

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
                } catch (parseError) {
                    console.error("La respuesta no es JSON:", responseText);
                }

                throw new Error(errorMessage);
            }

            try {
                return await response.json();
            } catch (jsonError) {
                console.error("Error al parsear la respuesta JSON:", jsonError);
                const text = await response.text();
                console.log("Respuesta cruda:", text);

                return {
                    urls: [],
                    message: "Procesado pero sin poder parsear la respuesta"
                };
            }
        } catch (error) {
            console.error("Error en uploadImages:", error);
            throw error;
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
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al añadir imagen a la planta");
            }

            return await response.json();
        } catch (error) {
            console.error("Error en addImageToPlant:", error);
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
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al actualizar imagen");
            }

            return await response.json();
        } catch (error) {
            console.error("Error en updateImageFile:", error);
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
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al eliminar imagen");
            }
        } catch (error) {
            console.error("Error en deleteImage:", error);
            throw error;
        }
    }
};