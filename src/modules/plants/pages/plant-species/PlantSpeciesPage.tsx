"use client";

import { useState } from "react";
import Sidebar from "../../../core/components/layout/sidebar/pages/Sidebar";
import { DataTable } from "../../../core/components/ui/data-table";
import { createPlantSpeciesColumns } from "../../components/plant-species/PlantSpeciesColumns";
import { Button } from "../../../core/components/ui/button";
import { PlantSpeciesCreateModal } from "../../components/plant-species/PlantSpeciesCreateModal";
import { PlantSpeciesEditModal } from "../../components/plant-species/PlantSpeciesEditModal";
import { DeleteConfirmationModal } from "../../components/plant-species/DeleteConfirmationModal";
import { PlantSpeciesFilters } from "../../components/plant-species/PlantSpeciesFilters";
import { Pagination } from "../../components/plant-species/Pagination";
import { PlantSpecies, CreatePlantSpeciesDTO, UpdatePlantSpeciesDTO } from "../../lib/plant-species/types";
import { usePlantSpecies } from "../../hooks/plant-species/usePlantSpecies";
import { useThemeStore } from "../../../core/states/themeStore";

const scrollbarHideClass = "scrollbar-none";

export default function PlantSpeciesPage() {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedSpecies, setSelectedSpecies] = useState<PlantSpecies | null>(null);

    const { mode } = useThemeStore();
    const isDark = mode === 'dark';

    const {
        species,
        isLoading,
        error,
        totalPages,
        filters,
        creating,
        updating,
        deleting,
        createSpecies,
        updateSpecies,
        deleteSpecies,
        handleSearch,
        handlePageChange,
        handleSortChange
    } = usePlantSpecies();

    const handleEdit = (speciesId: string) => {
        const speciesItem = species.find(s => s.id === speciesId);
        if (speciesItem) {
            setSelectedSpecies(speciesItem);
            setEditModalOpen(true);
        }
    };

    const handleDelete = (speciesId: string) => {
        const speciesItem = species.find(s => s.id === speciesId);
        if (speciesItem) {
            setSelectedSpecies(speciesItem);
            setDeleteModalOpen(true);
        }
    };

    const handleConfirmDelete = async () => {
        if (selectedSpecies) {
            try {
                await deleteSpecies(selectedSpecies.id);
                setDeleteModalOpen(false);
                setSelectedSpecies(null);
            } catch (error) {
                console.error("Error al eliminar especie:", error);
            }
        }
    };

    const handleSpeciesCreated = async (speciesData: CreatePlantSpeciesDTO) => {
        try {
            await createSpecies(speciesData);
            setCreateModalOpen(false);
        } catch (error) {
            console.error("Error al crear especie:", error);
        }
    };

    const handleSpeciesUpdated = async (id: string, speciesData: UpdatePlantSpeciesDTO) => {
        try {
            await updateSpecies(id, speciesData);
            setEditModalOpen(false);
            setSelectedSpecies(null);
        } catch (error) {
            console.error("Error al actualizar especie:", error);
        }
    };

    const columns = createPlantSpeciesColumns(handleEdit, handleDelete, isDark);

    return (
        <>
            <style jsx>{`
                .scrollbar-none::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-none {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>

            <div className={`flex h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
                <Sidebar />
                <main className={`flex-1 flex flex-col ${isDark ? 'bg-gray-800' : 'bg-green-50'} overflow-hidden`}>
                    <div className="flex justify-center items-center py-8 flex-shrink-0">
                        <h1 className={`text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-900'}`}>
                            Especies de Plantas
                        </h1>
                    </div>

                    <div className="px-8 flex-shrink-0">
                        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                            <PlantSpeciesFilters
                                onSearch={handleSearch}
                                onSortChange={handleSortChange}
                                sortBy={filters.sortBy}
                                sortOrder={filters.sortOrder}
                                isDark={isDark}
                            />

                            <Button
                                variant={isDark ? "outline" : "default"}
                                onClick={() => setCreateModalOpen(true)}
                                disabled={creating}
                                className={isDark ? "bg-green-600 hover:bg-green-700 text-white border-green-600" : ""}
                            >
                                {creating ? "Creando..." : "Crear Especie"}
                            </Button>
                        </div>
                    </div>

                    <div className="px-8 flex-1 overflow-hidden">
                        {isLoading ? (
                            <div className={`flex justify-center items-center h-full ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                Cargando...
                            </div>
                        ) : error ? (
                            <div className={`${isDark ? 'text-red-400' : 'text-red-500'} text-center flex items-center justify-center h-full`}>
                                {error}
                            </div>
                        ) : (
                            <div className={`h-full overflow-auto ${scrollbarHideClass}`}>
                                <DataTable
                                    columns={columns}
                                    data={species}
                                    className={isDark ? 'text-white bg-gray-800 border-gray-700' : ''}
                                />

                                <Pagination
                                    currentPage={filters.page}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                    isDark={isDark}
                                />
                            </div>
                        )}
                    </div>

                    <PlantSpeciesCreateModal
                        open={createModalOpen}
                        onClose={() => setCreateModalOpen(false)}
                        onSubmitSuccess={handleSpeciesCreated}
                        isDark={isDark}
                    />

                    <PlantSpeciesEditModal
                        open={editModalOpen}
                        onClose={() => {
                            setEditModalOpen(false);
                            setSelectedSpecies(null);
                        }}
                        onSubmitSuccess={handleSpeciesUpdated}
                        species={selectedSpecies}
                        isDark={isDark}
                    />

                    <DeleteConfirmationModal
                        open={deleteModalOpen}
                        title="Eliminar Especie"
                        message={`¿Estás seguro que deseas eliminar la especie "${selectedSpecies?.name}"? Esta acción no se puede deshacer.`}
                        onCancel={() => {
                            setDeleteModalOpen(false);
                            setSelectedSpecies(null);
                        }}
                        onConfirm={handleConfirmDelete}
                        isDeleting={deleting}
                        isDark={isDark}
                    />
                </main>
            </div>
        </>
    );
}