"use client";
{/*HOLA3*/}
import { Device } from "../lib/types";
import { Button } from "../../core/components/ui/button";

function formatDate(dateStr?: string | null) {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleString("es-MX", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
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
                                       isDark = false
                                   }: DeviceDetailsModalProps) {
    if (!open || !device) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
            <div className={`rounded-2xl shadow-2xl w-full max-w-md p-6 relative ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
                <h2 className="text-xl font-bold mb-4">Detalles del Dispositivo</h2>
                <div className="mb-4 space-y-2">
                    <div><strong>ID:</strong> {device.id}</div>
                    <div><strong>Identificador:</strong> {device.identifier}</div>
                    <div><strong>Estado:</strong> {device.status === "AVAILABLE" ? "Disponible" : device.status === "DISABLED" ? "Deshabilitado" : "Vinculado"}</div>
                    <div><strong>Clave de Enlace:</strong> {device.linking_key || "-"}</div>
                    <div><strong>Fecha de registro:</strong> {formatDate(device.registered_at)}</div>
                    <div><strong>Fecha de enlace:</strong> {formatDate(device.linked_at)}</div>
                </div>
                <div className="flex gap-2 justify-end mt-6">
                    <Button
                        onClick={() => onEdit(device)}
                        variant="outline"
                        size="sm"
                        className={isDark ? "bg-gray-700 text-white border-gray-600 hover:bg-gray-600" : ""}
                    >Editar</Button>
                    <Button
                        onClick={onClose}
                        variant="ghost"
                        size="sm"
                    >Cerrar</Button>
                </div>
            </div>
        </div>
    );
}