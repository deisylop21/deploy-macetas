import { Device, CreateDeviceDTO, CreateDeviceResponse, UpdateDeviceDTO, GetDevicesResponse,UpdateDeviceResponse, GetDeviceResponse, RegenerateKeyResponse } from "../lib/types";
import { API_ENDPOINTS } from "../../core/lib/enpoints";
import { getHeaders } from "../../core/utils/UtilsFuntions";
import { DeviceFilters, DeviceResponse } from "../lib/types";
{/*Adios*/}
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
        try {
            const response = await fetch(API_ENDPOINTS.ADMIN_DEVICE_BY_ID(deviceId), {
                headers: getHeaders()
            });

            if (!response.ok) {
                throw new Error("Error al obtener el dispositivo");
            }

            const json: GetDeviceResponse = await response.json();
            return json.device;
        } catch (error) {
            console.error("Error en getDeviceById:", error);
            throw error;
        }
    },

    createDevice: async (deviceData: CreateDeviceDTO): Promise<CreateDeviceResponse> => {
        try {
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
        } catch (error) {
            console.error("Error en createDevice:", error);
            throw error;
        }
    },

    updateDevice: async (deviceId: string, deviceData: UpdateDeviceDTO): Promise<UpdateDeviceResponse> => {
        try {
            const response = await fetch(API_ENDPOINTS.ADMIN_DEVICE_BY_ID(deviceId), {
                method: "PUT",
                headers: getHeaders(),
                body: JSON.stringify(deviceData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al actualizar el dispositivo");
            }
            const json: UpdateDeviceResponse = await response.json();
            return json;
        } catch (error) {
            console.error("Error en updateDevice:", error);
            throw error;
        }
    },

    regenerateKey: async (deviceId: string): Promise<RegenerateKeyResponse> => {
        try {
            const response = await fetch(API_ENDPOINTS.ADMIN_DEVICE_REGENERATE_KEY(deviceId), {
                method: "PUT",
                headers: getHeaders(),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al regenerar la clave");
            }

            return await response.json();
        } catch (error) {
            console.error("Error en regenerateKey:", error);
            throw error;
        }
    },
};