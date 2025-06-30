import { useEffect } from "react";
import { useDeviceStore } from "../states/deviceStore";
import type { CreateDeviceDTO, UpdateDeviceDTO } from "../lib/types";

export function useDevices() {
    const {
        devices,
        isLoading,
        error,
        creating,
        updating,
        deleting,
        regenerating,
        createError,
        updateError,
        deleteError,
        regenerateError,
        lastCreatedLinkingCode,
        fetchDevices,
        createDevice,
        updateDevice,
        deleteDevice,
        regenerateKey,
        clearLastCreatedCode
    } = useDeviceStore();

    useEffect(() => {
        fetchDevices();
    }, [fetchDevices]);

    return {
        devices,
        isLoading,
        error,
        refetch: fetchDevices,
        createDevice,
        updateDevice,
        deleteDevice,
        regenerateKey,
        creating,
        updating,
        deleting,
        regenerating,
        createError,
        updateError,
        deleteError,
        regenerateError,
        lastCreatedLinkingCode,
        clearLastCreatedCode
    };
}