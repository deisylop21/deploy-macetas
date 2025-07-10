"use client";

import { useState } from "react";
import Sidebar from "../../core/components/layout/sidebar/pages/Sidebar.tsx";
import { DataTable } from "../../core/components/ui/data-table";
import { createRoleColumns } from "../components/RoleColumns";
import { Button } from "../../core/components/ui/button";
import { RoleCreateModal } from "../components/RoleCreateModal";
import { useRoles } from "../hooks/useRoles";
import { CreateRoleDTO, Role } from "../lib/types";
import { useThemeStore } from "../../core/states/themeStore";
import { RolesFilters } from "../components/RolesFilters";
import { Pagination } from "../components/Pagination";
import { RoleDetailsModal } from "../components/RoleDetailsModal";
import { RoleUpdateModal } from "../components/RoleUpdateModal";
{/*Hola, aqui para el control z*/}
const scrollbarHideClass = "scrollbar-none";

export default function RolePage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);

    const {
        roles,
        modules,
        isLoading,
        error,
        createRole,
        updateRole,
        creating,
        updating,
        filters,
        totalPages,
        handleSearch,
        handleSortChange,
        handlePageChange,
        getRoleById
    } = useRoles();
    const { mode } = useThemeStore();
    const isDark = mode === 'dark';

    const columns = createRoleColumns(
        handleShowDetails,
        isDark
    );

    async function handleShowDetails(role: Role) {
        setSelectedRole(role);
        setDetailsModalOpen(true);

        try {
            const details = await getRoleById(role.id);
            setSelectedRole(details);
        } catch (e) {
            // no-op
        }
    }

    const handleEdit = (role: Role) => {
        setSelectedRole(role);
        setUpdateModalOpen(true);
        setDetailsModalOpen(false);
    };

    const handleRoleCreated = async (roleData: CreateRoleDTO) => {
        try {
            await createRole(roleData);
            setModalOpen(false);
        } catch (error) {
            console.error("Error en la interfaz al crear rol:", error);
        }
    };

    const handleRoleUpdated = async (patch: Partial<Role>) => {
        try {
            if (selectedRole) {
                await updateRole(selectedRole.id, patch);
                setUpdateModalOpen(false);
                setSelectedRole(null);
            }
        } catch (error) {
            console.error("Error en la interfaz al actualizar rol:", error);
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
                            Gestión de Roles
                        </h1>
                    </div>
                    <div className="px-8 flex-shrink-0">
                        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                            <RolesFilters
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
                                {creating ? "Creando..." : "Crear Rol"}
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
                                    data={roles}
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

                    <RoleCreateModal
                        open={modalOpen}
                        onClose={() => setModalOpen(false)}
                        onSubmitSuccess={handleRoleCreated}
                        modules={modules}
                        isDark={isDark}
                    />

                    <RoleDetailsModal
                        open={detailsModalOpen}
                        modules={modules}
                        role={selectedRole || undefined}
                        onClose={() => setDetailsModalOpen(false)}
                        onEdit={handleEdit}
                        isDark={isDark}
                    />

                    <RoleUpdateModal
                        open={updateModalOpen}
                        onClose={() => {
                            setUpdateModalOpen(false);
                            setSelectedRole(null);
                        }}
                        onSubmitSuccess={handleRoleUpdated}
                        role={selectedRole || undefined}
                        modules={modules}
                        isDark={isDark}
                    />
                </main>
            </div>
        </>
    );
}