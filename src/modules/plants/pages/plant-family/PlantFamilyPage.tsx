"use client";

import { useState } from "react";
import Sidebar from "../../../core/components/layout/sidebar/pages/Sidebar";
import { DataTable } from "../../../core/components/ui/data-table";
import { createPlantFamilyColumns } from "../../components/plant-family/PlantFamilyColumns";
import { Button } from "../../../core/components/ui/button";
import { PlantFamilyCreateModal } from "../../components/plant-family/PlantFamilyCreateModal";
import { PlantFamilyEditModal } from "../../components/plant-family/PlantFamilyEditModal";
import { DeleteConfirmationModal } from "../../components/plant-family/DeleteConfirmationModal";
import { PlantFamilyFilters } from "../../components/plant-family/PlantFamilyFilters";
import { Pagination } from "../../components/plant-family/Pagination";
import { PlantFamily, CreatePlantFamilyDTO, UpdatePlantFamilyDTO } from "../../lib/plant-family/types";
import { usePlantFamilies } from "../../hooks/plant-family/usePlantFamilies";
import { useThemeStore } from "../../../core/states/themeStore";

const scrollbarHideClass = "scrollbar-none";

export default function PlantFamilyPage() {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedFamily, setSelectedFamily] = useState<PlantFamily | null>(null);

    const { mode } = useThemeStore();
    const isDark = mode === 'dark';

    const {
        families,
        isLoading,
        error,
        totalPages,
        filters,
        creating,
        updating,
        deleting,
        createFamily,
        updateFamily,
        deleteFamily,
        handleSearch,
        handlePageChange,
        handleSortChange
    } = usePlantFamilies();

    const handleEdit = (familyId: string) => {
        const family = families.find(f => f.id === familyId);
        if (family) {
            setSelectedFamily(family);
            setEditModalOpen(true);
        }
    };

    const handleDelete = (familyId: string) => {
        const family = families.find(f => f.id === familyId);
        if (family) {
            setSelectedFamily(family);
            setDeleteModalOpen(true);
        }
    };

    const handleConfirmDelete = async () => {
        if (selectedFamily) {
            try {
                await deleteFamily(selectedFamily.id);
                setDeleteModalOpen(false);
                setSelectedFamily(null);
            } catch (error) {
                console.error("Error al eliminar familia:", error);
            }
        }
    };

    const handleFamilyCreated = async (familyData: CreatePlantFamilyDTO) => {
        try {
            await createFamily(familyData);
            setCreateModalOpen(false);
        } catch (error) {
            console.error("Error al crear familia:", error);
        }
    };

    const handleFamilyUpdated = async (id: string, familyData: UpdatePlantFamilyDTO) => {
        try {
            await updateFamily(id, familyData);
            setEditModalOpen(false);
            setSelectedFamily(null);
        } catch (error) {
            console.error("Error al actualizar familia:", error);
        }
    };

    const columns = createPlantFamilyColumns(handleEdit, handleDelete, isDark);

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
                            Familias de Plantas
                        </h1>
                    </div>

                    <div className="px-8 flex-shrink-0">
                        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                            <PlantFamilyFilters
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
                                {creating ? "Creando..." : "Crear Familia"}
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
                                    data={families}
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

                    <PlantFamilyCreateModal
                        open={createModalOpen}
                        onClose={() => setCreateModalOpen(false)}
                        onSubmitSuccess={handleFamilyCreated}
                        isDark={isDark}
                    />

                    <PlantFamilyEditModal
                        open={editModalOpen}
                        onClose={() => {
                            setEditModalOpen(false);
                            setSelectedFamily(null);
                        }}
                        onSubmitSuccess={handleFamilyUpdated}
                        family={selectedFamily}
                        isDark={isDark}
                    />

                    <DeleteConfirmationModal
                        open={deleteModalOpen}
                        title="Eliminar Familia"
                        message={`¿Estás seguro que deseas eliminar la familia "${selectedFamily?.name}"? Esta acción no se puede deshacer.`}
                        onCancel={() => {
                            setDeleteModalOpen(false);
                            setSelectedFamily(null);
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