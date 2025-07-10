"use client";

import { useState } from "react";
import Sidebar from "../../core/components/layout/sidebar/pages/Sidebar.tsx";
import { DataTable } from "../../core/components/ui/data-table";
import { createUserColumns } from "../components/UserColumns";
import { Button } from "../../core/components/ui/button";
import { UserCreateModal } from "../components/UserCreateModal";
import { UserDetailsModal } from "../components/UserDetailsModal";
import { UserEditModal } from "../components/UserEditModal";
import { useUsers } from "../hooks/useUsers";
import { CreateUserDTO, EditUserDTO, User } from "../lib/types";
import { useThemeStore } from "../../core/states/themeStore";
import { UserFilters } from "../components/UserFilters";
import { Pagination } from "../components/Pagination";
{/*hasta aqui, pasusa*/}
const scrollbarHideClass = "scrollbar-none";

export default function UserPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [selectedRoleId, setSelectedRoleId] = useState("");

    const {
        users,
        roles,
        isLoading,
        error,
        createUser,
        updateUser,
        creating,
        updating,
        filters,
        totalPages,
        handleSearch,
        handleSortChange,
        handlePageChange,
        fetchUserDetails,
        userDetails,
        fetchingDetails,
        clearUserDetails,
        setFilters,
    } = useUsers();
    const { mode } = useThemeStore();
    const isDark = mode === 'dark';

    const handleRoleChange = (roleId: string) => {
        setSelectedRoleId(roleId);
        setFilters({
            ...filters,
            roleId,
            page: 1 // reinicia la paginación al cambiar filtro
        });
    };
    function handleShowDetails(user: User) {
        setSelectedUser(user);
        fetchUserDetails(user.id);
        setDetailsModalOpen(true);
    }

    function handleEditClick(user: User) {
        setSelectedUser(user);
        setEditModalOpen(true);
        setDetailsModalOpen(false);
    }

    async function handleUserCreated(userData: CreateUserDTO) {
        try {
            await createUser(userData);
            setModalOpen(false);
        } catch (error) {
            console.error("Error al crear usuario:", error);
        }
    }

    async function handleUserUpdated(data: EditUserDTO) {
        if (selectedUser) {
            try {
                await updateUser(selectedUser.id, data);
                setEditModalOpen(false);
                setSelectedUser(null);
                clearUserDetails();
            } catch (error) {
                console.error("Error al actualizar usuario:", error);
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
                            Gestión de Usuarios
                        </h1>
                    </div>
                    <div className="px-8 flex-shrink-0">
                        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                            <UserFilters
                                onSearch={handleSearch}
                                onSortChange={handleSortChange}
                                onRoleChange={handleRoleChange}
                                sortBy={filters?.sortBy || "name"}
                                sortOrder={filters?.sortOrder || "asc"}
                                selectedRoleId={selectedRoleId}
                                roles={roles.filter(role => role.is_active)}
                                isDark={isDark}
                            />
                            <Button
                                variant={isDark ? "outline" : "default"}
                                onClick={() => setModalOpen(true)}
                                disabled={creating}
                                className={isDark ? "bg-green-600 hover:bg-green-700 text-white" : ""}
                            >
                                {creating ? "Creando..." : "Crear Usuario"}
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
                                    columns={createUserColumns(handleShowDetails, isDark)}
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

                    <UserCreateModal
                        open={modalOpen}
                        onClose={() => setModalOpen(false)}
                        onSubmitSuccess={handleUserCreated}
                        roles={roles.filter(role => role.is_active)}
                        isDark={isDark}
                    />

                    <UserDetailsModal
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

                    <UserEditModal
                        open={editModalOpen}
                        user={userDetails || selectedUser || undefined}
                        onClose={() => setEditModalOpen(false)}
                        onSubmitSuccess={handleUserUpdated}
                        isDark={isDark}
                        loading={updating}
                        roles={roles.filter(role => role.is_active)}
                    />
                </main>
            </div>
        </>
    );
}