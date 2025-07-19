"use client";

import { useEffect, useState } from "react";
import { Device } from "../lib/types";
import { Button } from "../../core/components/ui/button";
import { useAuthStore } from "../../core/states/authStore";
import { io, Socket } from "socket.io-client";

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

interface DeviceReading {
    deviceId: string;
    temperature?: number;
    humidity?: number;
    light_on?: boolean;
    watering_on?: boolean;
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
    const [socket, setSocket] = useState<Socket | null>(null);
    const [reading, setReading] = useState<DeviceReading | null>(null);
    const [socketError, setSocketError] = useState<string | null>(null);

    useEffect(() => {
        if (!open || !device?.id || !token) return;

        if (socket) {
            socket.disconnect();
            setSocket(null);
        }

        const s = io("wss://artistic-victory-env2.up.railway.app/device-readings", {
            transports: ["websocket"],
            auth: { token }
        });

        setSocket(s);

        s.emit("subscribe_device", { deviceId: device.id });

        s.on("device_data", (data: DeviceReading) => {
            setReading(data);
            setSocketError(null);
        });

        s.on("error", (err: any) => {
            setSocketError("Error en WebSocket: " + (err?.message || JSON.stringify(err)));
            setReading(null);
        });

        s.on("connect_error", (err: any) => {
            setSocketError("No se pudo conectar al WebSocket.");
            setReading(null);
        });

        s.onAny((event, ...args) => {
            console.log("Socket event:", event, args);
        });

        return () => {
            s.emit("unsubscribe_device", { deviceId: device.id });
            s.disconnect();
            setSocket(null);
            setReading(null);
            setSocketError(null);
        };
        // eslint-disable-next-line
    }, [open, device?.id, token]);

    if (!open || !device) return null;

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
                <div className={`mb-4 p-3 rounded-lg border ${isDark ? 'bg-blue-900 border-blue-600' : 'bg-blue-50 border-blue-200'}`}>
                    <div className="font-semibold mb-2 text-blue-600">Lectura en tiempo real:</div>
                    <div>
                        {socketError ? (
                            <span className="text-red-500">{socketError}</span>
                        ) : reading ? (
                            <>
                                <div><strong>Temperatura:</strong> {reading.temperature ?? "-"}°C</div>
                                <div><strong>Humedad:</strong> {reading.humidity ?? "-"}%</div>
                                <div><strong>Luz encendida:</strong> {reading.light_on !== undefined ? (reading.light_on ? "Sí" : "No") : "-"}</div>
                                <div><strong>Riego activado:</strong> {reading.watering_on !== undefined ? (reading.watering_on ? "Sí" : "No") : "-"}</div>
                            </>
                        ) : (
                            "No hay datos en tiempo real"
                        )}
                    </div>
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