"use client";

import { useState } from "react";
import Sidebar from "../../core/components/layout/sidebar/pages/Sidebar.tsx";
import { DataTable } from "../../core/components/ui/data-table";
import { createUserColumns } from "../components/UserColumns";
import { Button } from "../../core/components/ui/button";
import { UserCreateModal } from "../components/UserCreateModal";
import { useUsers } from "../hooks/useUsers";
import { CreateUserDTO } from "../lib/types";
import { useThemeStore } from "../../core/states/themeStore";

const scrollbarHideClass = "scrollbar-none";

export default function UserPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const { users, roles, isLoading, error, createUser, creating } = useUsers();
    const { mode } = useThemeStore();
    const isDark = mode === 'dark';

    const columns = createUserColumns(isDark);

    const activeRoles = roles.filter(role => role.is_active === true);

    const handleUserCreated = async (userData: CreateUserDTO) => {
        try {
            await createUser(userData);
            setModalOpen(false);
        } catch (error) {
            console.error("Error al crear usuario:", error);
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
                            Gestión de Usuarios
                        </h1>
                    </div>
                    <div className="flex justify-end px-8 mb-6 flex-shrink-0">
                        <Button
                            variant={isDark ? "outline" : "default"}
                            onClick={() => setModalOpen(true)}
                            disabled={creating}
                            className={isDark ? "bg-green-600 hover:bg-green-700 text-white" : ""}
                        >
                            {creating ? "Creando..." : "Crear Usuario"}
                        </Button>
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
                                    data={users}
                                    className={isDark ? 'text-white bg-gray-800 border-gray-700' : ''}
                                />
                            </div>
                        )}
                    </div>

                    <UserCreateModal
                        open={modalOpen}
                        onClose={() => setModalOpen(false)}
                        onSubmitSuccess={handleUserCreated}
                        roles={activeRoles}
                        isDark={isDark}
                    />
                </main>
            </div>
        </>
    );
}