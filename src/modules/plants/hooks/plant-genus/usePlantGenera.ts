import { useEffect } from "react";
import { usePlantGenusStore } from "../../states/plant-genus/plantGenusStore";
import type { CreatePlantGenusDTO, UpdatePlantGenusDTO, PlantGenusFilters } from "../../lib/plant-genus/types";

export function usePlantGenera() {
    const {
        genera,
        isLoading,
        error,
        creating,
        updating,
        deleting,
        totalItems,
        totalPages,
        filters,
        fetchGenera,
        createGenus,
        updateGenus,
        deleteGenus,
        setFilters
    } = usePlantGenusStore();

    useEffect(() => {
        fetchGenera();
    }, []);

    const handleSearch = (search: string) => {
        setFilters({ search, page: 1 });
    };

    const handlePageChange = (page: number) => {
        setFilters({ page });
    };

    const handleLimitChange = (limit: number) => {
        setFilters({ limit, page: 1 });
    };

    const handleSortChange = (sortBy: string, sortOrder: 'asc' | 'desc') => {
        setFilters({ sortBy, sortOrder });
    };

    return {
        genera,
        isLoading,
        error,
        totalItems,
        totalPages,
        filters,
        creating,
        updating,
        deleting,
        fetchGenera,
        createGenus,
        updateGenus,
        deleteGenus,
        handleSearch,
        handlePageChange,
        handleLimitChange,
        handleSortChange,
        setFilters
    };
}