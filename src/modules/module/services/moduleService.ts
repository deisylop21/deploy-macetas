import { Module, CreateModuleDTO } from "../lib/types.ts";
import { API_ENDPOINTS } from "../../core/lib/enpoints.ts";
import { getHeaders } from "../../core/utils/UtilsFuntions.ts";

export const moduleService = {
    getAllModules: async (): Promise<Module[]> => {
        try {
            const response = await fetch(API_ENDPOINTS.MODULE, {
                headers: getHeaders()
            });

            if (!response.ok) {
                throw new Error("Error al obtener los módulos");
            }
            const json = await response.json();

            if (Array.isArray(json)) {
                return json;
            } else if (Array.isArray(json.data)) {
                return json.data;
            } else {
                return [];
            }
        } catch (error) {
            console.error("Error en getAllModules:", error);
            throw error;
        }
    },

    createModule: async (moduleData: CreateModuleDTO): Promise<Module> => {
        try {
            const response = await fetch(API_ENDPOINTS.MODULE, {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify(moduleData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al crear el módulo");
            }

            return await response.json();
        } catch (error) {
            console.error("Error en createModule:", error);
            throw error;
        }
    },

    updateModuleStatus: async (moduleId: string, isActive: boolean): Promise<Module> => {
        try {
            const response = await fetch(API_ENDPOINTS.MODULE_BY_ID(moduleId), {
                method: "PUT",
                headers: getHeaders(),
                body: JSON.stringify({
                    is_active: isActive
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al actualizar el estado del módulo");
            }

            return await response.json();
        } catch (error) {
            console.error("Error en updateModuleStatus:", error);
            throw error;
        }
    },
};