import { User, CreateUserDTO, Role } from "../lib/types";
import { getHeaders } from "../../core/utils/UtilsFuntions";
import { API_ENDPOINTS } from "../../core/lib/enpoints";

export const userService = {
    getAllUsers: async (): Promise<User[]> => {
        const response = await fetch(API_ENDPOINTS.ADMIN_USERS, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error("Error al obtener los usuarios");
        const json = await response.json();

        if (Array.isArray(json)) {
            return json;
        } else if (Array.isArray(json.data)) {
            return json.data;
        } else {
            return [];
        }
    },

    createUser: async (userData: CreateUserDTO): Promise<User> => {
        const response = await fetch(API_ENDPOINTS.ADMIN_USERS, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(userData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error al crear el usuario");
        }
        return await response.json();
    },

    getAllRoles: async (): Promise<Role[]> => {
        const response = await fetch(API_ENDPOINTS.ROLES, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error("Error al obtener los roles");
        const result = await response.json();
        return result.data.roles || [];
    },
};