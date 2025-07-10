import { User, CreateUserDTO, EditUserDTO, Role, GetRolesResponse } from "../lib/types";
import { getHeaders } from "../../core/utils/UtilsFuntions";
import { API_ENDPOINTS } from "../../core/lib/enpoints";
import { UserFilters, UserResponse } from "../lib/types";
{/*pausaaa*/}
export const userService = {
    getAllUsers: async (filters: UserFilters): Promise<UserResponse> => {
        const { page, limit, search, sortBy, sortOrder, roleId } = filters;
        const params = [
            `page=${page}`,
            `limit=${limit}`,
            search ? `search=${encodeURIComponent(search)}` : "",
            sortBy ? `sortBy=${sortBy}` : "",
            sortOrder ? `sortOrder=${sortOrder}` : "",
            roleId ? `roleId=${roleId}` : ""
        ].filter(Boolean).join("&");
        const url = `${API_ENDPOINTS.ADMIN_USERS}?${params}`;

        const response = await fetch(url, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error("Error al obtener los usuarios");
        return await response.json();
    },

    getUserById: async (id: string): Promise<User> => {
        const url = `${API_ENDPOINTS.ADMIN_USERS}/${id}`;
        const response = await fetch(url, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error("Error al obtener el usuario");
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

    updateUser: async (id: string, data: EditUserDTO): Promise<{ id: string }> => {
        const response = await fetch(`${API_ENDPOINTS.ADMIN_USERS}/${id}`, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error al actualizar el usuario");
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
{/*HOLA aqui pausa con el contorl z*/}