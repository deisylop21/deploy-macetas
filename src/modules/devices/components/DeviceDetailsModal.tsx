"use client";

import { Device } from "../lib/types";
import { Button } from "../../core/components/ui/button";
import { useAuthStore } from "../../core/states/authStore";
import { useDeviceSocket } from "../hooks/useDeviceSocket";

function formatDate(dateStr?: string | null) {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleString("es-MX", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
}

interface DeviceDetailsModalProps {
    open: boolean;
    device?: Device;
    onClose: () => void;
    onEdit: (device: Device) => void;
    onRegenerateKey: (device: Device) => void;
    isDark?: boolean;
}

export function DeviceDetailsModal({
                                       open,
                                       device,
                                       onClose,
                                       onEdit,
                                       onRegenerateKey,
                                       isDark = false,
                                   }: DeviceDetailsModalProps) {
    const token = useAuthStore(state => state.token);

    const { reading, socketError, isConnecting, isConnected } = useDeviceSocket(
        open && (device?.status === "AVAILABLE" || device?.status === "LINKED") ? device?.id : undefined,
        open ? token : null
    );

    if (!open || !device) return null;

    // Determinar el estado de conexión para mostrar
    const connectionStatus = () => {
        if (isConnecting) return "Conectando...";
        if (socketError) return "Error de conexión";
        if (!isConnected) return "No conectado";
        return "Conectado";
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
            <div className={`rounded-2xl shadow-2xl w-full max-w-md p-6 relative ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
                <h2 className="text-xl font-bold mb-4">Detalles del Dispositivo</h2>
                <div className="mb-4 space-y-2">
                    <div><strong>Identificador:</strong> {device.identifier}</div>
                    <div><strong>Estado:</strong> {device.status === "AVAILABLE" ? "Disponible" : device.status === "DISABLED" ? "Deshabilitado" : "Vinculado"}</div>
                    <div><strong>Clave de Enlace:</strong> {device.linking_key || "-"}</div>
                    <div><strong>Fecha de registro:</strong> {formatDate(device.registered_at)}</div>
                    <div><strong>Fecha de enlace:</strong> {formatDate(device.linked_at)}</div>
                </div>

                {(device.status === "AVAILABLE" || device.status === "LINKED") && (
                    <div className={`mb-4 p-3 rounded-lg border ${isDark ? 'bg-blue-900 border-blue-600' : 'bg-blue-50 border-blue-200'}`}>
                        <div className="flex justify-between items-center mb-2">
                            <div className="font-semibold text-blue-600">Lectura en tiempo real</div>
                            <div className={`text-xs px-2 py-1 rounded-full ${
                                isConnected ? 'bg-green-100 text-green-800' :
                                    isConnecting ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                            }`}>
                                {connectionStatus()}
                            </div>
                        </div>

                        <div>
                            {isConnecting ? (
                                <span className={isDark ? "text-blue-300" : "text-blue-700"}>Conectando a WebSocket...</span>
                            ) : socketError ? (
                                <div className="space-y-1">
                                    <span className="text-red-500">{socketError}</span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => window.location.reload()}
                                        className="mt-2"
                                    >
                                        Reintentar conexión
                                    </Button>
                                </div>
                            ) : reading ? (
                                <>
                                    <div><strong>Temperatura:</strong> {reading.temperature ?? "-"}°C</div>
                                    <div><strong>Humedad:</strong> {reading.humidity ?? "-"}%</div>
                                    <div><strong>Luz encendida:</strong> {reading.light_on !== undefined ? (reading.light_on ? "Sí" : "No") : "-"}</div>
                                    <div><strong>Riego activado:</strong> {reading.watering_on !== undefined ? (reading.watering_on ? "Sí" : "No") : "-"}</div>
                                    <div><strong>Fecha de lectura:</strong> {formatDate(reading.created_at)}</div>
                                </>
                            ) : (
                                <div className="text-gray-500">
                                    {isConnected ? "Esperando datos del dispositivo..." : "Conecte para ver datos en tiempo real"}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex gap-2 justify-end mt-6">
                    <Button
                        onClick={() => onEdit(device)}
                        variant="outline"
                        size="sm"
                        className={isDark ? "bg-gray-700 text-white border-gray-600 hover:bg-gray-600" : ""}
                    >
                        Editar
                    </Button>
                    <Button
                        onClick={onClose}
                        variant="ghost"
                        size="sm"
                    >
                        Cerrar
                    </Button>
                </div>
            </div>
        </div>
    );
}