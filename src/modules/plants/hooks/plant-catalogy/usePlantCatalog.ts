import { useEffect } from "react";
import { usePlantCatalogStore } from "../../states/plant-catalogy/plantCatalogStore";

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
        uploadedImageUrls,
        fetchPlants,
        fetchPlantById,
        createPlant,
        updatePlant,
        deletePlant,
        uploadImages,
        setFilters,
        resetUploadedImages,
    } = usePlantCatalogStore();

    useEffect(() => {
        fetchPlants();
    }, []);

    const handleSearch = (search: string) => setFilters({ search, page: 1 });
    const handlePageChange = (page: number) => setFilters({ page });
    const handleTypeChange = (planttype: string) => setFilters({ planttype, page: 1 });
    const handleSortByChange = (sortBy: string) => setFilters({ sortBy, page: 1 });
    const handleSortOrderChange = (sortOrder: "asc" | "desc") => setFilters({ sortOrder, page: 1 });

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