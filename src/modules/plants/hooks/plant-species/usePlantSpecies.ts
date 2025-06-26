import { useEffect } from "react";
import { usePlantSpeciesStore } from "../../states/plant-species/plantSpeciesStore";
import type { CreatePlantSpeciesDTO, UpdatePlantSpeciesDTO } from "../../lib/plant-species/types";

export function usePlantSpecies() {
    const {
        species,
        isLoading,
        error,
        creating,
        updating,
        deleting,
        totalItems,
        totalPages,
        filters,
        fetchSpecies,
        createSpecies,
        updateSpecies,
        deleteSpecies,
        setFilters
    } = usePlantSpeciesStore();

    useEffect(() => {
        fetchSpecies();
    }, []);

    const handleSearch = (search: string) => {
        setFilters({ search, page: 1 });
    };

    const handlePageChange = (page: number) => {
        setFilters({ page });
    };

    const handleSortChange = (sortBy: string, sortOrder: 'asc' | 'desc') => {
        setFilters({ sortBy, sortOrder });
    };

    return {
        species,
        isLoading,
        error,
        totalItems,
        totalPages,
        filters,
        creating,
        updating,
        deleting,
        fetchSpecies,
        createSpecies,
        updateSpecies,
        deleteSpecies,
        handleSearch,
        handlePageChange,
        handleSortChange,
        setFilters
    };
}