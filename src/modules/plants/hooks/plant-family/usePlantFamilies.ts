import { useEffect } from "react";
import { usePlantFamilyStore } from "../../states/plant-family/plantFamilyStore";
import type { CreatePlantFamilyDTO, UpdatePlantFamilyDTO } from "../../lib/plant-family/types";

export function usePlantFamilies() {
    const {
        families,
        isLoading,
        error,
        totalItems,
        totalPages,
        filters,
        creating,
        updating,
        deleting,
        fetchFamilies,
        createFamily,
        updateFamily,
        deleteFamily,
        setFilters
    } = usePlantFamilyStore();

    useEffect(() => {
        fetchFamilies();
        // eslint-disable-next-line
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
        families,
        isLoading,
        error,
        totalItems,
        totalPages,
        filters,
        creating,
        updating,
        deleting,
        fetchFamilies,
        createFamily,
        updateFamily,
        deleteFamily,
        handleSearch,
        handlePageChange,
        handleLimitChange,
        handleSortChange,
        setFilters
    };
}