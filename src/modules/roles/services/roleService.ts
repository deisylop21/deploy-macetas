import { Role, CreateRoleDTO } from "../lib/types";
import { Module } from "../../module/lib/types";
import { API_ENDPOINTS } from "../../core/lib/enpoints";
import { getHeaders } from "../../core/utils/UtilsFuntions";

export const roleService = {
    getAllRoles: async (): Promise<Role[]> => {
        const response = await fetch(API_ENDPOINTS.ROLES, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error("Error al obtener los roles");
        const json = await response.json();

        if (Array.isArray(json)) {
            return json;
        } else if (Array.isArray(json.data.data)) {
            return json.data.data;
        } else {
            return [];
        }
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