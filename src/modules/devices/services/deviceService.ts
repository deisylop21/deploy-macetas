import { Device, CreateDeviceDTO, CreateDeviceResponse, UpdateDeviceDTO, GetDevicesResponse, GetDeviceResponse, RegenerateKeyResponse } from "../lib/types";
import { API_ENDPOINTS } from "../../core/lib/enpoints";
import { getHeaders } from "../../core/utils/UtilsFuntions";

export const deviceService = {
    getAllDevices: async (): Promise<Device[]> => {
        try {
            const response = await fetch(API_ENDPOINTS.ADMIN_DEVICES, {
                headers: getHeaders()
            });

            if (!response.ok) {
                throw new Error("Error al obtener los dispositivos");
            }

            const json: GetDevicesResponse = await response.json();
            return json.data || [];
        } catch (error) {
            console.error("Error en getAllDevices:", error);
            throw error;
        }
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

    updateDevice: async (deviceId: string, deviceData: UpdateDeviceDTO): Promise<Device> => {
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

            const json: GetDeviceResponse = await response.json();
            return json.device;
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