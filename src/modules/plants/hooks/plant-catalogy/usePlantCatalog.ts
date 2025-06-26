import { useEffect } from "react";
import { usePlantCatalogStore } from "../../states/plant-catalogy/plantCatalogStore";
import type { CreatePlantCatalogDTO, UpdatePlantCatalogDTO, PlantCatalogFilters } from "../../lib/plant-catalogy/types";

export function usePlantCatalog() {
    const {
        plants,
        selectedPlant,
        isLoading,
        isLoadingDetail,
        error,
        creating,
        updating,
        deleting,
        uploading,
        totalItems,
        totalPages,
        filters,
        plantFamilies,
        plantGenera,
        plantSpecies,
        uploadedImageUrls,
        fetchPlants,
        fetchPlantById,
        createPlant,
        updatePlant,
        deletePlant,
        uploadImages,
        setFilters,
        loadFamilies,
        loadGenera,
        loadSpecies,
        resetUploadedImages
    } = usePlantCatalogStore();

    useEffect(() => {
        fetchPlants();
        loadFamilies();
        loadGenera();
        loadSpecies();
    }, []);

    const handleSearch = (search: string) => {
        setFilters({ search, page: 1 });
    };

    const handlePageChange = (page: number) => {
        setFilters({ page });
    };

    const handleTypeChange = (planttype: string) => {
        setFilters({ planttype, page: 1 });
    };
    const handleSortByChange = (sortBy: string) => {
        setFilters({ sortBy, page: 1 });
    };
    const handleSortOrderChange = (sortOrder: "asc" | "desc") => {
        setFilters({ sortOrder, page: 1 });
    };

    return {
        plants,
        selectedPlant,
        isLoading,
        isLoadingDetail,
        error,
        totalItems,
        totalPages,
        filters,
        creating,
        updating,
        deleting,
        uploading,
        plantFamilies,
        plantGenera,
        plantSpecies,
        uploadedImageUrls,
        fetchPlants,
        fetchPlantById,
        createPlant,
        updatePlant,
        deletePlant,
        uploadImages,
        handleSearch,
        handlePageChange,
        handleTypeChange,
        handleSortByChange,
        handleSortOrderChange,
        resetUploadedImages,
    };
}