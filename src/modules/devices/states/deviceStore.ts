import { create } from 'zustand';
import { deviceService } from "../services/deviceService";
import type { Device, CreateDeviceDTO, UpdateDeviceDTO } from "../lib/types";

interface DeviceState {
    devices: Device[];
    isLoading: boolean;
    error: string | null;
    creating: boolean;
    updating: boolean;
    deleting: boolean;
    regenerating: boolean;
    createError: Error | null;
    updateError: Error | null;
    deleteError: Error | null;
    regenerateError: Error | null;
    lastCreatedLinkingCode: string | null;

    fetchDevices: () => Promise<void>;
    createDevice: (data: CreateDeviceDTO) => Promise<void>;
    updateDevice: (deviceId: string, data: UpdateDeviceDTO) => Promise<void>;
    deleteDevice: (deviceId: string) => Promise<void>;
    regenerateKey: (deviceId: string) => Promise<void>;
    clearLastCreatedCode: () => void;
}

export const useDeviceStore = create<DeviceState>((set, get) => ({
    devices: [],
    isLoading: false,
    error: null,
    creating: false,
    updating: false,
    deleting: false,
    regenerating: false,
    createError: null,
    updateError: null,
    deleteError: null,
    regenerateError: null,
    lastCreatedLinkingCode: null,

    fetchDevices: async () => {
        set({ isLoading: true, error: null });
        try {
            const devices = await deviceService.getAllDevices();
            set({ devices, isLoading: false });
        } catch (error) {
            set({
                isLoading: false,
                error: error instanceof Error ? error.message : "Error al obtener los dispositivos"
            });
        }
    },

    createDevice: async (data: CreateDeviceDTO) => {
        set({ creating: true, createError: null });
        try {
            const response = await deviceService.createDevice(data);
            console.log("Dispositivo creado exitosamente:", response);

            set({ lastCreatedLinkingCode: response.linking_code });

            await get().fetchDevices();

            set({ creating: false });
        } catch (error) {
            set({
                creating: false,
                createError: error instanceof Error ? error : new Error("Error al crear el dispositivo")
            });
            throw error;
        }
    },

    updateDevice: async (deviceId: string, data: UpdateDeviceDTO) => {
        set({ updating: true, updateError: null });
        try {
            const updatedDevice = await deviceService.updateDevice(deviceId, data);
            set(state => ({
                devices: state.devices.map(device =>
                    device.id === deviceId ? updatedDevice : device
                ),
                updating: false
            }));
        } catch (error) {
            set({
                updating: false,
                updateError: error instanceof Error ? error : new Error("Error al actualizar el dispositivo")
            });
            throw error;
        }
    },

    deleteDevice: async (deviceId: string) => {
        set({ deleting: true, deleteError: null });
        try {
            await deviceService.deleteDevice(deviceId);
            set(state => ({
                devices: state.devices.filter(device => device.id !== deviceId),
                deleting: false
            }));
        } catch (error) {
            set({
                deleting: false,
                deleteError: error instanceof Error ? error : new Error("Error al eliminar el dispositivo")
            });
            throw error;
        }
    },

    regenerateKey: async (deviceId: string) => {
        set({ regenerating: true, regenerateError: null });
        try {
            const response = await deviceService.regenerateKey(deviceId);
            console.log("Clave regenerada exitosamente:", response);

            set({ lastCreatedLinkingCode: response.linking_code });

            await get().fetchDevices();

            set({ regenerating: false });
        } catch (error) {
            set({
                regenerating: false,
                regenerateError: error instanceof Error ? error : new Error("Error al regenerar la clave")
            });
            throw error;
        }
    },

    clearLastCreatedCode: () => {
        set({ lastCreatedLinkingCode: null });
    }
}));