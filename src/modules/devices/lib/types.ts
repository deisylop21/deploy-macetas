export interface Device {
    id: string;
    status: "AVAILABLE" | "DISABLED";
    identifier: string;
    linking_key?: string;
    registered_at?: string;
    linked_at?: string | null;
}
{/*Adios*/}
export interface CreateDeviceDTO {
    identifier: string;
}

export interface CreateDeviceResponse {
    id: string;
    linking_code?: string;
}

export interface UpdateDeviceDTO {
    identifier?: string;
    status?: "AVAILABLE" | "DISABLED";
}

export interface GetDevicesResponse {
    message: string;
    data: Device[];
}

export interface GetDeviceResponse {
    message: string;
    device: Device;
}

export interface UpdateDeviceResponse {
    id: string;
}

export interface RegenerateKeyResponse {
    message: string;
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
