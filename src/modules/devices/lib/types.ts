export interface Device {
    id: string;
    status: "AVAILABLE" | "DISABLED" | "LINKED";
    identifier: string;
    linking_key?: string;
    registered_at?: string;
    linked_at?: string | null;
}

export interface CreateDeviceDTO {
    identifier: string;
}

export interface CreateDeviceResponse {
    id: string;
    linking_code?: string;
}

export interface UpdateDeviceDTO {
    identifier?: string;
    status?: "AVAILABLE" | "DISABLED" | "LINKED";
}

export interface GetDevicesResponse {
    data: Device[];
    meta: {
        page: number;
        limit: number;
        totalItems: number;
        totalPages: number;
    };
}

export interface GetDeviceResponse extends Device {}

export interface UpdateDeviceResponse {
    id: string;
}

export interface RegenerateKeyResponse {
    linking_code: string;
}

export interface DeviceFilters {
    page: number;
    limit: number;
    search: string;
    sortBy: string;
    sortOrder: "asc" | "desc";
}

export interface DeviceResponse {
    data: Device[];
    meta: {
        page: number;
        limit: number;
        totalItems: number;
        totalPages: number;
    };
}

export interface DeviceReading {
    deviceId: string;
    temperature?: number;
    humidity?: number;
    light_on?: boolean;
    watering_on?: boolean;
    created_at?: string;
}