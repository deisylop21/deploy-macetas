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
        clearLastCreatedCode,
        totalItems,
        totalPages,
        filters,
        setFilters
    } = useDeviceStore();

    useEffect(() => {
        fetchDevices();
        // eslint-disable-next-line
    }, []);

    const handleSearch = (search: string) => {
        setFilters({ search, page: 1 });
    };

    const handlePageChange = (page: number) => {
        setFilters({ page });
    };

    const handleSortChange = (sortBy: string, sortOrder: "asc" | "desc") => {
        setFilters({ sortBy, sortOrder });
    };

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
        clearLastCreatedCode,
        totalItems,
        totalPages,
        filters,
        handleSearch,
        handlePageChange,
        handleSortChange,
        setFilters
    };
}