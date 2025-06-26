"use client";

import { useState, useEffect } from "react";
import Sidebar from "../../../core/components/layout/sidebar/pages/Sidebar";
import { Button } from "../../../core/components/ui/button";
import { PlantCatalogFilters } from "../../components/plant-catalogy/PlantCatalogFilters";
import { PlantFormModal } from "../../components/plant-catalogy/PlantCatalogFormModal";
import { PlantCard } from "../../components/plant-catalogy/PlantCard";
import { PlantDetailModal } from "../../components/plant-catalogy/PlantDetailModal";
import { DeleteConfirmationModal } from "../../components/plant-catalogy/DeleteConfirmationModal";
import { Pagination } from "../../components/plant-catalogy/Pagination";
import { usePlantCatalog } from "../../hooks/plant-catalogy/usePlantCatalog";
import { useThemeStore } from "../../../core/states/themeStore";

export default function PlantCatalogPage() {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const { mode } = useThemeStore();
    const isDark = mode === 'dark';

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
        handleSearch,
        handlePageChange,
        handleTypeChange,
        handleSortByChange,
        handleSortOrderChange,
        resetUploadedImages
    } = usePlantCatalog();

    const plantTypes = [
        "Todas las categorías",
        "Ornamental",
        "Hortalizas y leguminosas",
        "Árboles frutales",
        "Hierbas aromáticas",
        "Suculentas",
        "Acuáticas",
        "Trepadoras"
    ];

    const handleAddPlant = () => {
        resetUploadedImages();
        setCreateModalOpen(true);
    };

    const handleViewDetail = (plantId: string) => {
        fetchPlantById(plantId);
        setDetailModalOpen(true);
    };

    const handleEdit = (plantId: string) => {
        fetchPlantById(plantId);
        setEditModalOpen(true);
    };

    const handleDelete = (plantId: string) => {
        fetchPlantById(plantId);
        setDeleteModalOpen(true);
    };

    const handleCreateSubmit = async (data: any) => {
        await createPlant(data);
        setCreateModalOpen(false);
    };

    const handleUpdateSubmit = async (data: any) => {
        if (selectedPlant) {
            await updatePlant(selectedPlant.id, data);
            setEditModalOpen(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (selectedPlant) {
            await deletePlant(selectedPlant.id);
            setDeleteModalOpen(false);
        }
    };

    return (
        <div className={`flex h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
            <Sidebar />
            <main className={`flex-1 flex flex-col ${isDark ? 'bg-gray-800' : 'bg-green-50'}`}>
                <div className="flex justify-center items-center py-8">
                    <h1 className={`text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-900'}`}>
                        Catálogo de Plantas
                    </h1>
                </div>

                <div className="flex items-center justify-between gap-4 px-8 mb-6">
                    <PlantCatalogFilters
                        onSearch={handleSearch}
                        onTypeChange={handleTypeChange}
                        onSortByChange={handleSortByChange}
                        onSortOrderChange={handleSortOrderChange}
                        selectedType={filters.planttype || "Todas las categorías"}
                        plantTypes={plantTypes}sortBy={filters.sortBy || "name"}           //aqui
                        sortOrder={filters.sortOrder || "asc"}
                        isDark={isDark}
                    />

                    <Button
                        onClick={handleAddPlant}
                        variant="default"
                        className="font-semibold px-6 flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Añadir planta
                    </Button>
                </div>

                <div className="px-8 flex-1 overflow-y-auto scrollbar-none">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Cargando plantas...
                            </p>
                        </div>
                    ) : error ? (
                        <div className="flex justify-center items-center h-64">
                            <p className="text-red-500 text-lg">{error}</p>
                        </div>
                    ) : plants.length === 0 ? (
                        <div className="flex justify-center items-center h-64">
                            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                No se encontraron plantas
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
                                {plants.map((plant) => (
                                    <PlantCard
                                        key={plant.id}
                                        plant={plant}
                                        onViewDetail={handleViewDetail}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        isDark={isDark}
                                    />
                                ))}
                            </div>

                            <Pagination
                                currentPage={filters.page}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                                isDark={isDark}
                            />
                        </>
                    )}
                </div>
                <style jsx>{`
                    .scrollbar-none::-webkit-scrollbar {
                        display: none;
                    }
                    .scrollbar-none {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                `}</style>

                <PlantFormModal
                    open={createModalOpen}
                    onClose={() => setCreateModalOpen(false)}
                    onSubmit={handleCreateSubmit}
                    isSubmitting={creating}
                    uploadImages={uploadImages}
                    isUploading={uploading}
                    uploadedUrls={uploadedImageUrls}
                    resetUploadedImages={resetUploadedImages}
                    families={plantFamilies}
                    genera={plantGenera}
                    species={plantSpecies}
                    isDark={isDark}
                />

                <PlantFormModal
                    open={editModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    onSubmit={handleUpdateSubmit}
                    isSubmitting={updating}
                    uploadImages={uploadImages}
                    isUploading={uploading}
                    uploadedUrls={uploadedImageUrls}
                    resetUploadedImages={resetUploadedImages}
                    plant={selectedPlant}
                    families={plantFamilies}
                    genera={plantGenera}
                    species={plantSpecies}
                    isEdit={true}
                    isDark={isDark}
                />

                <PlantDetailModal
                    plant={selectedPlant}
                    open={detailModalOpen}
                    onClose={() => setDetailModalOpen(false)}
                    families={plantFamilies}
                    genera={plantGenera}
                    species={plantSpecies}
                    isDark={isDark}
                />

                <DeleteConfirmationModal
                    open={deleteModalOpen}
                    title="Eliminar Planta"
                    message={`¿Estás seguro de que deseas eliminar la planta "${selectedPlant?.name}"? Esta acción no se puede deshacer.`}
                    onCancel={() => setDeleteModalOpen(false)}
                    onConfirm={handleConfirmDelete}
                    isDeleting={deleting}
                    isDark={isDark}
                />
            </main>
        </div>
    );
}