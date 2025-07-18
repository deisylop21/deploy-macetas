import { API_ENDPOINTS } from "../../core/lib/enpoints";
import { getHeaders } from "../../core/utils/UtilsFuntions";
import { UserGeneralFilters, UserGeneralResponse, UserGeneral, UpdateUserGeneralDTO } from "../lib/types";

// ENDPOINT: API_ENDPOINTS.USERS_GENERAL_MANAGEMENT = "https://artistic-victory-env2.up.railway.app/users-general-management"
export const userGeneralService = {
    getAll: async (filters: UserGeneralFilters): Promise<UserGeneralResponse> => {
        const { page, limit, search, sortBy, sortOrder } = filters;
        const params = [
            `page=${page}`,
            `limit=${limit}`,
            search ? `search=${encodeURIComponent(search)}` : "",
            sortBy ? `sortBy=${sortBy}` : "",
            sortOrder ? `sortOrder=${sortOrder}` : ""
        ].filter(Boolean).join("&");
        const url = `${API_ENDPOINTS.USERS_GENERAL_MANAGEMENT}?${params}`;

        const response = await fetch(url, {
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error("Error al obtener los usuarios generales");
        return await response.json();
    },

    getById: async (id: string): Promise<UserGeneral> => {
        const url = `${API_ENDPOINTS.USERS_GENERAL_MANAGEMENT}/${id}`;
        const response = await fetch(url, {
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error("Error al obtener el usuario general");
        return await response.json();
    },

    updateStatus: async (id: string, data: UpdateUserGeneralDTO): Promise<UserGeneral> => {
        const url = `${API_ENDPOINTS.USERS_GENERAL_MANAGEMENT}/${id}/status-account`;
        const response = await fetch(url, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error al actualizar el estado");
        }
        return await response.json();
    }
};