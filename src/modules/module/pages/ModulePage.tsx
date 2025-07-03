"use client";

import { useState } from "react";
import Sidebar from "../../core/components/layout/sidebar/pages/Sidebar.tsx";
import { DataTable } from "../../core/components/ui/data-table";
import { createModuleColumns } from "../components/ModuleColumns";
import { Button } from "../../core/components/ui/button";
import { ModuleCreateModal } from "../components/ModuleCreateModal";
import { useModules } from "../hooks/useModules";
import { CreateModuleDTO } from "../lib/types";
import { useThemeStore } from "../../core/states/themeStore";
import { ModuleFilters } from "../components/ModuleFilters";
import { Pagination } from "../components/Pagination";

const scrollbarHideClass = "scrollbar-none";
{/*Hola*/}
export default function ModulePage() {
    const [modalOpen, setModalOpen] = useState(false);
    const { modules, isLoading, error, createModule, toggleModuleStatus, creating, filters, handleSearch, handleSortChange, totalPages, handlePageChange, } = useModules();
    const { mode } = useThemeStore();
    const isDark = mode === 'dark';

    const columns = createModuleColumns(toggleModuleStatus, isDark);

    const handleModuleCreated = async (moduleData: CreateModuleDTO) => {
        try {
            await createModule(moduleData);
            setModalOpen(false);
        } catch (error) {
            console.error("Error al crear módulo:", error);
        }
    };

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
                            Gestión de Módulos
                        </h1>
                    </div>
                    <div className="px-8 flex-shrink-0">
                        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                        <ModuleFilters
                            onSearch={handleSearch}
                            onSortChange={handleSortChange}
                            sortBy={filters?.sortBy || "name"}
                            sortOrder={filters?.sortOrder || "asc"}
                            isDark={isDark}
                        />
                        <Button
                            variant={isDark ? "outline" : "default"}
                            onClick={() => setModalOpen(true)}
                            disabled={creating}
                            className={isDark ? "bg-green-600 hover:bg-green-700 text-white" : ""}
                        >
                            {creating ? "Creando..." : "Crear Módulo"}
                        </Button>
                        </div>
                    </div>
                    <div className="px-8 flex-1 overflow-hidden">
                        {isLoading ? (
                            <div className={`flex justify-center items-center h-full ${isDark ? 'text-gray-300' : ''}`}>
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
                                    data={modules}
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

                    <ModuleCreateModal
                        open={modalOpen}
                        onClose={() => setModalOpen(false)}
                        onSubmitSuccess={handleModuleCreated}
                        isDark={isDark}
                    />
                </main>
            </div>
        </>
    );
}