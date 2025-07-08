import { create } from 'zustand';
import { deviceService } from "../services/deviceService";
import type { Device, CreateDeviceDTO, UpdateDeviceDTO, DeviceFilters } from "../lib/types";

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
    totalItems: number;
    totalPages: number;
    filters: DeviceFilters;

    fetchDevices: () => Promise<void>;
    createDevice: (data: CreateDeviceDTO) => Promise<void>;
    updateDevice: (deviceId: string, data: UpdateDeviceDTO) => Promise<void>;
    regenerateKey: (deviceId: string) => Promise<void>;
    clearLastCreatedCode: () => void;
    setFilters: (filters: Partial<DeviceFilters>) => void;
}

const initialFilters: DeviceFilters = {
    page: 1,
    limit: 10,
    search: '',
    sortBy: 'identifier',
    sortOrder: 'asc'
};

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
    totalItems: 0,
    totalPages: 0,
    filters: initialFilters,

    fetchDevices: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await deviceService.getAllDevices(get().filters);
            set({
                devices: response.data,
                totalItems: response.meta.totalItems,
                totalPages: response.meta.totalPages,
                isLoading: false
            });
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
            set({ lastCreatedLinkingCode: response.linking_code || null });
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
            await deviceService.updateDevice(deviceId, data);
            await get().fetchDevices();
            set({ updating: false });
        } catch (error) {
            set({
                updating: false,
                updateError: error instanceof Error ? error : new Error("Error al actualizar el dispositivo")
            });
            throw error;
        }
    },

    regenerateKey: async (deviceId: string) => {
        set({ regenerating: true, regenerateError: null });
        try {
            const response = await deviceService.regenerateKey(deviceId);
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
    },

    setFilters: (filters: Partial<DeviceFilters>) => {
        set(state => ({
            filters: { ...state.filters, ...filters }
        }));
        get().fetchDevices();
    }
}));