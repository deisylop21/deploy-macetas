"use client";

import { useState } from "react";
import { DataTable } from "../../core/components/ui/data-table";
import { createDeviceColumns } from "../components/DeviceColumns";
import { Button } from "../../core/components/ui/button";
import { DeviceCreateModal } from "../components/DeviceCreateModal";
import { DeviceUpdateModal } from "../components/DeviceUpdateModal";
import { DeviceDetailsModal } from "../components/DeviceDetailsModal";
import { useDevices } from "../hooks/useDevices";
import { Device, CreateDeviceDTO, UpdateDeviceDTO } from "../lib/types";
import { useThemeStore } from "../../core/states/themeStore";
import { DeviceFilters } from "../components/DeviceFilters";
import { Pagination } from "../components/Pagination";
import { deviceService } from "../services/deviceService";

const scrollbarHideClass = "scrollbar-none";

export default function DevicesPage() {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

    const {
        devices,
        isLoading,
        error,
        createDevice,
        updateDevice,
        regenerateKey,
        creating,
        updating,
        regenerating,
        lastCreatedLinkingCode,
        clearLastCreatedCode,
        filters,
        totalPages,
        handleSearch,
        handleSortChange,
        handlePageChange
    } = useDevices();

    const { mode } = useThemeStore();
    const isDark = mode === 'dark';

    const handleShowDetails = async (device: Device) => {
        setSelectedDevice(device);
        setDetailsModalOpen(true);

        try {
            const deviceDetails = await deviceService.getDeviceById(device.id);
            setSelectedDevice(deviceDetails);
        } catch (err) {
        }
    };

    const handleEdit = (device: Device) => {
        setSelectedDevice(device);
        setUpdateModalOpen(true);
        setDetailsModalOpen(false);
    };

    const handleRegenerateKey = async (device: Device) => {
        try {
            await regenerateKey(device.id);
        } catch (error) {
            console.error("Error al regenerar la clave:", error);
        }
    };

    const columns = createDeviceColumns(handleShowDetails, handleRegenerateKey, isDark);

    const handleDeviceCreated = async (deviceData: CreateDeviceDTO) => {
        try {
            await createDevice(deviceData);
        } catch (error) {
            console.error("Error al crear dispositivo:", error);
        }
    };

    const handleCreateModalClose = () => {
        setCreateModalOpen(false);
        clearLastCreatedCode();
    };

    const handleDeviceUpdated = async (deviceData: UpdateDeviceDTO) => {
        try {
            if (selectedDevice) {
                await updateDevice(selectedDevice.id, deviceData);
                setUpdateModalOpen(false);
                setSelectedDevice(null);
            }
        } catch (error) {
            console.error("Error al actualizar dispositivo:", error);
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
                <main className={`flex-1 flex flex-col ${isDark ? 'bg-gray-800' : 'bg-green-50'} overflow-hidden`}>
                    <div className="flex justify-center items-center py-8 flex-shrink-0">
                        <h1 className={`text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-900'}`}>
                            Dispositivos
                        </h1>
                    </div>
                    <div className="px-8 flex-shrink-0">
                        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                            <DeviceFilters
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
                                className={isDark ? "bg-green-600 hover:bg-green-700 text-white" : ""}
                            >
                                {creating ? "Creando..." : "Crear Dispositivo"}
                            </Button>
                        </div>
                    </div>
                    <div className="px-8 flex-1 overflow-hidden">
                        {isLoading ? (
                            <div className={`flex justify-center items-center h-full ${isDark ? 'text-gray-300' : ''}`}>
                                Cargando dispositivos...
                            </div>
                        ) : error ? (
                            <div className={`${isDark ? 'text-red-400' : 'text-red-500'} text-center flex items-center justify-center h-full`}>
                                {error}
                            </div>
                        ) : (
                            <div className={`h-full overflow-auto ${scrollbarHideClass}`}>
                                <DataTable
                                    columns={columns}
                                    data={devices}
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

                    <DeviceCreateModal
                        open={createModalOpen}
                        onClose={handleCreateModalClose}
                        onSubmitSuccess={handleDeviceCreated}
                        isDark={isDark}
                        linkingCode={lastCreatedLinkingCode}
                    />

                    <DeviceUpdateModal
                        open={updateModalOpen}
                        onClose={() => {
                            setUpdateModalOpen(false);
                            setSelectedDevice(null);
                        }}
                        onSubmitSuccess={handleDeviceUpdated}
                        device={selectedDevice || undefined}
                        isDark={isDark}
                    />

                    <DeviceDetailsModal
                        open={detailsModalOpen}
                        device={selectedDevice || undefined}
                        onClose={() => setDetailsModalOpen(false)}
                        onEdit={handleEdit}
                        onRegenerateKey={handleRegenerateKey}
                        isDark={isDark}
                    />
                </main>
            </div>
        </>
    );
}