import { Module, CreateModuleDTO } from "../lib/types.ts";
import { API_ENDPOINTS } from "../../core/lib/enpoints.ts";
import { getHeaders } from "../../core/utils/UtilsFuntions.ts";
import { ModuleFilters, ModuleResponse } from "../lib/types"

export const moduleService = {
    getAllModules: async (filters: ModuleFilters): Promise<ModuleResponse> => {
        const { page, limit, search, sortBy, sortOrder } = filters;
        const params = [
            `page=${page}`,
            `limit=${limit}`,
            search ? `search=${encodeURIComponent(search)}` : "",
            sortBy ? `sortBy=${sortBy}` : "",
            sortOrder ? `sortOrder=${sortOrder}` : ""
        ].filter(Boolean).join("&");
        const url = `${API_ENDPOINTS.MODULE}?${params}`;

        const response = await fetch(url, {
            headers: getHeaders()
        });

        if (!response.ok) throw new Error("Error al obtener los módulos");
        return await response.json();
    },

    createModule: async (moduleData: CreateModuleDTO): Promise<Module> => {
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
    },

    updateModule: async (moduleId: string, data: Partial<Module>): Promise<Module> => {
        const response = await fetch(API_ENDPOINTS.MODULE_BY_ID(moduleId), {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error al actualizar el módulo");
        }

        return await response.json();
    },

    deleteModule: async (moduleId: string): Promise<void> => {
        const response = await fetch(API_ENDPOINTS.MODULE_BY_ID(moduleId), {
            method: "DELETE",
            headers: getHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error al eliminar el módulo");
        }
    },

    updateModuleStatus: async (moduleId: string, isActive: boolean): Promise<Module> => {
        return moduleService.updateModule(moduleId, { is_active: isActive });
    }
};