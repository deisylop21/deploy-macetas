import { Role, CreateRoleDTO } from "../lib/types";
import { Module } from "../../module/lib/types";
import { API_ENDPOINTS } from "../../core/lib/enpoints";
import { getHeaders } from "../../core/utils/UtilsFuntions";
import { RoleFilters, RoleResponse } from "../lib/types";

export const roleService = {
    getAllRoles: async (filters: RoleFilters): Promise<RoleResponse> => {
        const { page, limit, search, sortBy, sortOrder } = filters;
        const params = [
            `page=${page}`,
            `limit=${limit}`,
            search ? `search=${encodeURIComponent(search)}` : "",
            sortBy ? `sortBy=${sortBy}` : "",
            sortOrder ? `sortOrder=${sortOrder}` : ""
        ].filter(Boolean).join("&");
        const url = `${API_ENDPOINTS.ROLES}?${params}`;
        const response = await fetch(url, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error("Error al obtener los roles");
        return await response.json();
    },

    getRoleById: async (roleId: string): Promise<Role> => {
        const response = await fetch(API_ENDPOINTS.ROLES + "/" + roleId, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error("Error al obtener el rol");
        return await response.json();
    },

    createRole: async (roleData: CreateRoleDTO): Promise<Role> => {
        const response = await fetch(API_ENDPOINTS.ROLES, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(roleData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error al crear el rol");
        }
        return await response.json();
    },

    updateRole: async (roleId: string, patch: Partial<Role>): Promise<Role> => {
        const response = await fetch(API_ENDPOINTS.ROLES + "/" + roleId, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(patch)
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error al actualizar el rol");
        }
        return await response.json();
    },

    getAllModules: async (): Promise<Module[]> => {
        const response = await fetch(API_ENDPOINTS.MODULE, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error("Error al obtener los módulos");
        const json = await response.json();

        if (Array.isArray(json)) {
            return json;
        } else if (Array.isArray(json.data)) {
            return json.data;
        } else {
            return [];
        }
    },
};