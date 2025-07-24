// useDeviceSocket.ts
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export interface DeviceReading {
    deviceId: string;
    temperature?: number;
    humidity?: number;
    light_on?: boolean;
    watering_on?: boolean;
    created_at?: string;
}

interface UseDeviceSocketResult {
    reading: DeviceReading | null;
    socketError: string | null;
    isConnecting: boolean;
    isConnected: boolean;
}

export function useDeviceSocket(deviceId: string | undefined, jwt: string | null): UseDeviceSocketResult {
    const [reading, setReading] = useState<DeviceReading | null>(null);
    const [socketError, setSocketError] = useState<string | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef<Socket | null>(null);
    const retriesRef = useRef(0);

    useEffect(() => {
        if (!deviceId || !jwt) {
            // Limpiar estado si no hay deviceId o jwt
            setReading(null);
            setSocketError(null);
            setIsConnecting(false);
            setIsConnected(false);
            return;
        }

        let isMounted = true;
        let reconnectTimeout: NodeJS.Timeout | null = null;

        const connectAndSubscribe = () => {
            setIsConnecting(true);
            setSocketError(null);
            setReading(null);

            // Limpiar conexión anterior si existe
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }

            const socketOptions = {
                transports: ["websocket"],
                auth: { token: jwt },
                query: { token: jwt }, // Enviar también como query parameter
                reconnection: false,
            };

            const socket = io("wss://artistic-victory-env2.up.railway.app/device-readings", socketOptions);
            socketRef.current = socket;

            socket.on("connect", () => {
                if (!isMounted) return;
                console.log("WebSocket connected, subscribing to device:", deviceId);
                setIsConnecting(false);
                setIsConnected(true);
                setSocketError(null);
                retriesRef.current = 0;

                // Suscribirse al dispositivo
                socket.emit("subscribe_device", { deviceId });
            });

            socket.on("device_data", (data: DeviceReading) => {
                if (!isMounted) return;
                setReading(data);
            });

            socket.on("subscription_success", (data: any) => {
                if (!isMounted) return;
                console.log("Subscription success:", data);
            });

            socket.on("error", (err: any) => {
                if (!isMounted) return;
                console.error("WebSocket error:", err);
                setSocketError(`Error: ${err?.message || "Error desconocido"}`);
                setIsConnected(false);
            });

            socket.on("connect_error", (err: any) => {
                if (!isMounted) return;
                console.error("WebSocket connection error:", err);
                setSocketError(`Error de conexión: ${err?.message || "No se pudo conectar"}`);
                setIsConnecting(false);
                setIsConnected(false);

                // Reintentar con backoff exponencial (hasta 3 veces)
                if (retriesRef.current < 3) {
                    retriesRef.current += 1;
                    const delay = Math.min(1500 * retriesRef.current, 10000); // Máximo 10 segundos
                    console.log(`Reintentando conexión en ${delay}ms (intento ${retriesRef.current})`);
                    reconnectTimeout = setTimeout(connectAndSubscribe, delay);
                } else {
                    setSocketError("No se pudo establecer la conexión después de varios intentos");
                }
            });

            socket.on("disconnect", () => {
                if (!isMounted) return;
                console.log("WebSocket disconnected");
                setIsConnected(false);
                setIsConnecting(false);
            });
        };

        connectAndSubscribe();

        return () => {
            isMounted = false;
            if (socketRef.current) {
                if (deviceId) {
                    socketRef.current.emit("unsubscribe_device", { deviceId });
                }
                socketRef.current.disconnect();
                socketRef.current = null;
            }
            if (reconnectTimeout) clearTimeout(reconnectTimeout);
            setIsConnected(false);
            setIsConnecting(false);
        };
    }, [deviceId, jwt]);

    return { reading, socketError, isConnecting, isConnected };
}