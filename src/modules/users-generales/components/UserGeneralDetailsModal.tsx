"use client";

import React, { useState } from "react";
import { UserGeneral, Pot } from "../lib/types";
import { Button } from "../../core/components/ui/button";

// Importa los servicios
import { plantCatalogService } from "../../plants/services/plant-catalogy/plantCatalogService";
import { deviceService } from "../../devices/services/deviceService";

// Importa los modales
import { PlantDetailModal } from "../../plants/components/plant-catalogy/PlantDetailModal";
import { DeviceDetailsModal } from "../../devices/components/DeviceDetailsModal";

import { PlantCatalogDetail } from "../../plants/lib/plant-catalogy/types";
import { Device } from "../../devices/lib/types";

interface UserGeneralDetailsModalProps {
    open: boolean;
    user?: UserGeneral;
    onClose: () => void;
    onEdit: (user: UserGeneral) => void;
    isDark?: boolean;
    loading?: boolean;
}

export function UserGeneralDetailsModal({
                                            open,
                                            user,
                                            onClose,
                                            onEdit,
                                            isDark = false,
                                            loading = false,
                                        }: UserGeneralDetailsModalProps) {
    // Estados para planta
    const [plantModalOpen, setPlantModalOpen] = useState(false);
    const [selectedPlant, setSelectedPlant] = useState<PlantCatalogDetail | null>(null);
    const [loadingPlant, setLoadingPlant] = useState(false);

    // Estados para dispositivo
    const [deviceModalOpen, setDeviceModalOpen] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
    const [loadingDevice, setLoadingDevice] = useState(false);

    // Función para abrir modal de planta con fetch
    const handleOpenPlantModal = async (catalog_plant: Pot["catalog_plant"]) => {
        setLoadingPlant(true);
        setPlantModalOpen(true);
        try {
            const plant = await plantCatalogService.getPlantById(catalog_plant.id, true);
            setSelectedPlant(plant);
        } catch (err) {
            setSelectedPlant(null);
        } finally {
            setLoadingPlant(false);
        }
    };

    // Función para abrir modal de dispositivo con fetch
    const handleOpenDeviceModal = async (device: Pot["device"]) => {
        if (!device || !device.id) return;
        setLoadingDevice(true);
        setDeviceModalOpen(true);
        try {
            const deviceData = await deviceService.getDeviceById(device.id);
            setSelectedDevice(deviceData);
        } catch (err) {
            setSelectedDevice(null);
        } finally {
            setLoadingDevice(false);
        }
    };

    if (!open || !user) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
            <div
                className={`rounded-2xl shadow-2xl w-full max-w-md p-6 relative ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
                style={{ maxHeight: "90vh", display: "flex", flexDirection: "column" }}
            >
                <h2 className="text-xl font-bold mb-4 flex-shrink-0">Detalles del Usuario General</h2>
                <div className="mb-4 space-y-2 flex-shrink-0">
                    <div><strong>Nombre:</strong> {user.name}</div>
                    <div><strong>Apellido:</strong> {user.lastname}</div>
                    <div><strong>Email:</strong> {user.email}</div>
                    <div><strong>Estado:</strong> {user.status_account}</div>
                    <div><strong>Fecha de registro:</strong> {user.created_at ? new Date(user.created_at).toLocaleString() : "-"}</div>
                </div>
                <div className="mb-4 flex-1 overflow-y-auto pr-2">
                    <h3 className="font-semibold text-lg mb-2">Macetas vinculadas</h3>
                    {user.pots && user.pots.length > 0 ? (
                        <div className="space-y-3">
                            {user.pots.map((pot) => (
                                <div key={pot.id} className={`p-2 rounded ${isDark ? "bg-gray-700" : "bg-green-100"}`}>
                                    <div><strong>Nombre de maceta:</strong> {pot.name}</div>
                                    <div>
                                        <strong>Planta:</strong>{" "}
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="ml-1"
                                            onClick={() => handleOpenPlantModal(pot.catalog_plant)}
                                        >
                                            Ver planta
                                        </Button>
                                    </div>
                                    {pot.device ? (
                                        <div>
                                            <strong>Dispositivo:</strong>{" "}
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="ml-1"
                                                onClick={() => handleOpenDeviceModal(pot.device)}
                                            >
                                                Ver dispositivo
                                            </Button>
                                            {pot.device.linked_at && (
                                                <span className="block text-xs">
                                                    <strong>Vinculado el:</strong> {new Date(pot.device.linked_at).toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-sm text-gray-400">Sin dispositivo vinculado</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-sm text-gray-400">No hay macetas vinculadas.</div>
                    )}
                </div>
                <div className="flex gap-2 justify-end mt-6 flex-shrink-0">
                    <Button
                        onClick={() => onEdit(user)}
                        variant="outline"
                        size="sm"
                        className={isDark ? "bg-gray-700 text-white border-gray-600 hover:bg-gray-600" : ""}
                    >Editar Estado</Button>
                    <Button
                        onClick={onClose}
                        variant="ghost"
                        size="sm"
                    >Cerrar</Button>
                </div>

                {/* Modales secundarios */}
                <PlantDetailModal
                    plant={selectedPlant}
                    open={plantModalOpen}
                    onClose={() => {
                        setPlantModalOpen(false);
                        setSelectedPlant(null);
                    }}
                    isDark={isDark}
                />
                <DeviceDetailsModal
                    open={deviceModalOpen}
                    device={selectedDevice ?? undefined}
                    onClose={() => {
                        setDeviceModalOpen(false);
                        setSelectedDevice(null);
                    }}
                    onEdit={() => {}}
                    onRegenerateKey={() => {}}
                    isDark={isDark}
                />
                {/* Loading overlays */}
                {(loadingPlant || loadingDevice) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50">
                        <div className="text-white text-lg font-semibold">Cargando detalles...</div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserGeneralDetailsModal;