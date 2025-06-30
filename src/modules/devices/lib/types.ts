export interface Device {
    id: string;
    status: "AVAILABLE" | "DISABLED";
    identifier: string;
    linking_key: string;
    registered_at: string;
    linked_at: string | null;
}

export interface CreateDeviceDTO {
    identifier: string;
}

export interface CreateDeviceResponse {
    message: string;
    linking_code: string;
}

export interface UpdateDeviceDTO {
    identifier: string;
    status: "AVAILABLE" | "DISABLED";
}

export interface GetDevicesResponse {
    message: string;
    data: Device[];
}

export interface GetDeviceResponse {
    message: string;
    device: Device;
}

export interface RegenerateKeyResponse {
    message: string;
    linking_code: string;
}