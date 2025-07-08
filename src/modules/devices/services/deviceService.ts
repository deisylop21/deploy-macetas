import { Device, CreateDeviceDTO, CreateDeviceResponse, UpdateDeviceDTO, DeviceFilters, DeviceResponse, UpdateDeviceResponse, RegenerateKeyResponse } from "../lib/types";
import { API_ENDPOINTS } from "../../core/lib/enpoints";
import { getHeaders } from "../../core/utils/UtilsFuntions";

export const deviceService = {
    getAllDevices: async (filters: DeviceFilters): Promise<DeviceResponse> => {
        const { page, search, sortBy, sortOrder } = filters;
        const params = [
            `page=${page}`,
            search ? `search=${encodeURIComponent(search)}` : "",
            sortBy ? `sortBy=${sortBy}` : "",
            sortOrder ? `sortOrder=${sortOrder}` : ""
        ].filter(Boolean).join("&");

        const url = `${API_ENDPOINTS.ADMIN_DEVICES}?${params}`;

        const response = await fetch(url, {
            headers: getHeaders()
        });

        if (!response.ok) {
            throw new Error("Error al obtener los dispositivos");
        }

        return await response.json();
    },

    getDeviceById: async (deviceId: string): Promise<Device> => {
        const response = await fetch(API_ENDPOINTS.ADMIN_DEVICE_BY_ID(deviceId), {
            headers: getHeaders()
        });

        if (!response.ok) {
            throw new Error("Error al obtener el dispositivo");
        }

        return await response.json();
    },

    createDevice: async (deviceData: CreateDeviceDTO): Promise<CreateDeviceResponse> => {
        const response = await fetch(API_ENDPOINTS.ADMIN_DEVICES, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(deviceData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error al crear el dispositivo");
        }

        return await response.json();
    },

    updateDevice: async (deviceId: string, deviceData: UpdateDeviceDTO): Promise<UpdateDeviceResponse> => {
        const response = await fetch(API_ENDPOINTS.ADMIN_DEVICE_BY_ID(deviceId), {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(deviceData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error al actualizar el dispositivo");
        }
        return await response.json();
    },

    regenerateKey: async (deviceId: string): Promise<RegenerateKeyResponse> => {
        const response = await fetch(API_ENDPOINTS.ADMIN_DEVICE_REGENERATE_KEY(deviceId), {
            method: "PUT",
            headers: getHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error al regenerar la clave");
        }

        return await response.json();
    },
};