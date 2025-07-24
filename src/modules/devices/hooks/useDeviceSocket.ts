// useDeviceSocket.ts
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { DeviceReading } from "../lib/types";

interface UseDeviceSocketResult {
    reading: DeviceReading | null;
    socketError: string | null;
    isConnecting: boolean;
}

export function useDeviceSocket(deviceId: string | undefined, jwt: string | null): UseDeviceSocketResult {
    const [reading, setReading] = useState<DeviceReading | null>(null);
    const [socketError, setSocketError] = useState<string | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (!deviceId || !jwt) {
            if (socketRef.current) {
                socketRef.current.removeAllListeners();
                socketRef.current.disconnect();
                socketRef.current = null;
            }
            setReading(null);
            setSocketError(null);
            setIsConnecting(false);
            return;
        }

        let isMounted = true;
        const socketUrl = "wss://artistic-victory-env2.up.railway.app/device-readings";

        const connectSocket = () => {
            if (!isMounted) return;

            setIsConnecting(true);
            setSocketError(null);
            setReading(null);

            if (socketRef.current) {
                socketRef.current.removeAllListeners();
                socketRef.current.disconnect();
            }

            console.log(jwt);
            const newSocket = io(socketUrl, {
                auth: {
                    token: jwt
                },
                transports: ['websocket'],
                reconnection: false,
                timeout: 20000,
                reconnectionAttempts: 3,
            });

            socketRef.current = newSocket;

            newSocket.on('connect', () => {
                if (!isMounted) return;
                setIsConnecting(false);
                setSocketError(null);
                newSocket.emit('subscribe_device', { deviceId });
            });

            newSocket.on('device_data', (data: DeviceReading) => {
                if (!isMounted) return;
                setReading(data);
            });

            newSocket.on('subscription_success', () => {});

            newSocket.on('error', (err: any) => {
                if (!isMounted) return;
                const errorMessage = `Error del servidor: ${err?.message || JSON.stringify(err)}`;
                setSocketError(errorMessage);
                setReading(null);
            });

            newSocket.on('connect_error', (err: any) => {
                if (!isMounted) return;
                setIsConnecting(false);
                if (err.message && (err.message.includes('Unauthorized') || err.message.includes('401') || err.message.includes('token') || err.message.includes('auth'))) {
                    setSocketError("Autenticación fallida. Token inválido, expirado o no proporcionado correctamente.");
                } else {
                    setSocketError(`Error de conexión: ${err.message || 'Desconocido'}`);
                }
            });

            newSocket.on('disconnect', (reason) => {
                if (!isMounted) return;
                setIsConnecting(false);
                if (reason !== 'io client disconnect' && reason !== 'io server disconnect') {
                    setSocketError(`Desconectado: ${reason}`);
                }
            });
        };

        connectSocket();

        return () => {
            isMounted = false;
            if (socketRef.current) {
                if (deviceId) {
                    socketRef.current.emit('unsubscribe_device', { deviceId });
                }
                socketRef.current.removeAllListeners();
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [deviceId, jwt]);

    return { reading, socketError, isConnecting };
}
