import { User, CreateUserDTO, Role, GetRolesResponse } from "../lib/types";
import { getHeaders } from "../../core/utils/UtilsFuntions";
import { API_ENDPOINTS } from "../../core/lib/enpoints";
import { UserFilters, UserResponse } from "../lib/types";
{/*HOLA*/}
export const userService = {
    getAllUsers: async (filters: UserFilters): Promise<UserResponse> => {
        const { page, search, sortBy, sortOrder } = filters;
        const params = [
            `page=${page}`,
            search ? `search=${encodeURIComponent(search)}` : "",
            sortBy ? `sortBy=${sortBy}` : "",
            sortOrder ? `sortOrder=${sortOrder}` : ""
        ].filter(Boolean).join("&");
        const url = `${API_ENDPOINTS.ADMIN_USERS}?${params}`;

        const response = await fetch(url, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error("Error al obtener los usuarios");
        return await response.json();
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
        const result: GetRolesResponse = await response.json();
        return result.data || [];
    },
};