"use client";

import { useState } from "react";
import Sidebar from "../../core/components/layout/sidebar/pages/Sidebar.tsx";
import { DataTable } from "../../core/components/ui/data-table";
import { createUserGeneralColumns } from "../components/UserGeneralColumns";
import { Button } from "../../core/components/ui/button";
import { UserGeneralDetailsModal } from "../components/UserGeneralDetailsModal";
import { UserGeneralEditModal } from "../components/UserGeneralEditModal";
import { useUsersGenerales } from "../hooks/useUsersGenerales";
import { useThemeStore } from "../../core/states/themeStore";
import { UserGeneralFilters } from "../components/UserGeneralFilters";
import { Pagination } from "../components/Pagination";
import { UpdateUserGeneralDTO, UserGeneral } from "../lib/types";

const scrollbarHideClass = "scrollbar-none";

export default function UserGeneralPage() {
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserGeneral | null>(null);

    const {
        users,
        isLoading,
        error,
        filters,
        totalPages,
        handleSearch,
        handleSortChange,
        handlePageChange,
        fetchUserDetails,
        userDetails,
        fetchingDetails,
        clearUserDetails,
        updateUserStatus,
        updating,
    } = useUsersGenerales();

    const { mode } = useThemeStore();
    const isDark = mode === 'dark';

    function handleShowDetails(user: UserGeneral) {
        setSelectedUser(user);
        fetchUserDetails(user.id);
        setDetailsModalOpen(true);
    }

    function handleEditClick(user: UserGeneral) {
        setSelectedUser(user);
        setEditModalOpen(true);
        setDetailsModalOpen(false);
    }

    async function handleUserUpdated(data: UpdateUserGeneralDTO) {
        if (selectedUser) {
            try {
                await updateUserStatus(selectedUser.id, data);
                setEditModalOpen(false);
                setSelectedUser(null);
                clearUserDetails();
            } catch (error) {
                console.error("Error al actualizar usuario general:", error);
            }
        }
    }

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
                            Gestión de Usuarios Generales
                        </h1>
                    </div>
                    <div className="px-8 flex-shrink-0">
                        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                            <UserGeneralFilters
                                onSearch={handleSearch}
                                onSortChange={handleSortChange}
                                sortBy={filters?.sortBy || "name"}
                                sortOrder={filters?.sortOrder || "asc"}
                                isDark={isDark}
                            />
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
                                    columns={createUserGeneralColumns(handleShowDetails, isDark)}
                                    data={users}
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

                    <UserGeneralDetailsModal
                        open={detailsModalOpen}
                        user={userDetails || selectedUser || undefined}
                        onClose={() => {
                            setDetailsModalOpen(false);
                            clearUserDetails();
                        }}
                        onEdit={handleEditClick}
                        isDark={isDark}
                        loading={fetchingDetails}
                    />

                    <UserGeneralEditModal
                        open={editModalOpen}
                        user={userDetails || selectedUser || undefined}
                        onClose={() => setEditModalOpen(false)}
                        onSubmitSuccess={handleUserUpdated}
                        isDark={isDark}
                        loading={updating}
                    />
                </main>
            </div>
        </>
    );
}