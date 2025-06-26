"use client";

import { useState } from "react";
import Sidebar from "../../../core/components/layout/sidebar/pages/Sidebar";
import { DataTable } from "../../../core/components/ui/data-table";
import { createPlantGenusColumns } from "../../components/plant-genus/PlantGenusColumns";
import { Button } from "../../../core/components/ui/button";
import { PlantGenusCreateModal } from "../../components/plant-genus/PlantGenusCreateModal";
import { PlantGenusEditModal } from "../../components/plant-genus/PlantGenusEditModal";
import { DeleteConfirmationModal } from "../../components/plant-genus/DeleteConfirmationModal";
import { PlantGenusFilters } from "../../components/plant-genus/PlantGenusFilters";
import { Pagination } from "../../components/plant-genus/Pagination";
import { PlantGenus, CreatePlantGenusDTO, UpdatePlantGenusDTO } from "../../lib/plant-genus/types";
import { usePlantGenera } from "../../hooks/plant-genus/usePlantGenera";
import { useThemeStore } from "../../../core/states/themeStore";

const scrollbarHideClass = "scrollbar-none";

export default function PlantGenusPage() {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedGenus, setSelectedGenus] = useState<PlantGenus | null>(null);

    const { mode } = useThemeStore();
    const isDark = mode === 'dark';

    const {
        genera,
        isLoading,
        error,
        totalPages,
        filters,
        creating,
        updating,
        deleting,
        createGenus,
        updateGenus,
        deleteGenus,
        handleSearch,
        handlePageChange,
        handleSortChange
    } = usePlantGenera();

    const handleEdit = (genusId: string) => {
        const genus = genera.find(g => g.id === genusId);
        if (genus) {
            setSelectedGenus(genus);
            setEditModalOpen(true);
        }
    };

    const handleDelete = (genusId: string) => {
        const genus = genera.find(g => g.id === genusId);
        if (genus) {
            setSelectedGenus(genus);
            setDeleteModalOpen(true);
        }
    };

    const handleConfirmDelete = async () => {
        if (selectedGenus) {
            try {
                await deleteGenus(selectedGenus.id);
                setDeleteModalOpen(false);
                setSelectedGenus(null);
            } catch (error) {
                console.error("Error al eliminar género:", error);
            }
        }
    };

    const handleGenusCreated = async (genusData: CreatePlantGenusDTO) => {
        try {
            await createGenus(genusData);
            setCreateModalOpen(false);
        } catch (error) {
            console.error("Error al crear género:", error);
        }
    };

    const handleGenusUpdated = async (id: string, genusData: UpdatePlantGenusDTO) => {
        try {
            await updateGenus(id, genusData);
            setEditModalOpen(false);
            setSelectedGenus(null);
        } catch (error) {
            console.error("Error al actualizar género:", error);
        }
    };

    const columns = createPlantGenusColumns(handleEdit, handleDelete, isDark);

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
                            Géneros de Plantas
                        </h1>
                    </div>

                    <div className="px-8 flex-shrink-0">
                        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                            <PlantGenusFilters
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
                                {creating ? "Creando..." : "Crear Género"}
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
                                    data={genera}
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

                    <PlantGenusCreateModal
                        open={createModalOpen}
                        onClose={() => setCreateModalOpen(false)}
                        onSubmitSuccess={handleGenusCreated}
                        isDark={isDark}
                    />

                    <PlantGenusEditModal
                        open={editModalOpen}
                        onClose={() => {
                            setEditModalOpen(false);
                            setSelectedGenus(null);
                        }}
                        onSubmitSuccess={handleGenusUpdated}
                        genus={selectedGenus}
                        isDark={isDark}
                    />

                    <DeleteConfirmationModal
                        open={deleteModalOpen}
                        title="Eliminar Género"
                        message={`¿Estás seguro que deseas eliminar el género "${selectedGenus?.name}"? Esta acción no se puede deshacer.`}
                        onCancel={() => {
                            setDeleteModalOpen(false);
                            setSelectedGenus(null);
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