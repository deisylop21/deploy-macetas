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
    const isAuthenticatedRef = useRef<boolean>(false);

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
            isAuthenticatedRef.current = false;
            return;
        }

        let isMounted = true;
        const socketUrl = "wss://artistic-victory-env2.up.railway.app/device-readings";

        const connectSocket = () => {
            if (!isMounted) return;

            setIsConnecting(true);
            setSocketError(null);
            setReading(null);
            isAuthenticatedRef.current = false;

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

            // Evento connect - NO suscribirse aún
            newSocket.on('connect', () => {
                if (!isMounted) return;
                console.log('Connected to server, waiting for authentication...');
                // No cambiar isConnecting aquí, esperar connection_success
            });

            // Evento connection_success - AQUÍ es cuando se debe suscribir
            newSocket.on('connection_success', (data) => {
                if (!isMounted) return;
                console.log('Authentication successful:', data);
                setIsConnecting(false);
                setSocketError(null);
                isAuthenticatedRef.current = true;

                // Ahora sí, suscribirse al dispositivo
                newSocket.emit('subscribe_device', { deviceId });
            });

            newSocket.on('device_data', (data: DeviceReading) => {
                if (!isMounted) return;
                setReading(data);
            });

            newSocket.on('subscription_success', (data) => {
                if (!isMounted) return;
                console.log('Subscription successful:', data);
            });

            newSocket.on('unsubscription_success', (data) => {
                if (!isMounted) return;
                console.log('Unsubscription successful:', data);
            });

            newSocket.on('error', (err: any) => {
                if (!isMounted) return;
                console.error('Socket error:', err);
                const errorMessage = `Error del servidor: ${err?.message || JSON.stringify(err)}`;
                setSocketError(errorMessage);
                setReading(null);
                setIsConnecting(false);
                isAuthenticatedRef.current = false;
            });

            newSocket.on('connect_error', (err: any) => {
                if (!isMounted) return;
                console.error('Connection error:', err);
                setIsConnecting(false);
                isAuthenticatedRef.current = false;

                if (err.message && (err.message.includes('Unauthorized') || err.message.includes('401') || err.message.includes('token') || err.message.includes('auth'))) {
                    setSocketError("Autenticación fallida. Token inválido, expirado o no proporcionado correctamente.");
                } else {
                    setSocketError(`Error de conexión: ${err.message || 'Desconocido'}`);
                }
            });

            newSocket.on('disconnect', (reason) => {
                if (!isMounted) return;
                console.log('Disconnected:', reason);
                setIsConnecting(false);
                isAuthenticatedRef.current = false;

                if (reason !== 'io client disconnect' && reason !== 'io server disconnect') {
                    setSocketError(`Desconectado: ${reason}`);
                }
            });
        };

        connectSocket();

        return () => {
            isMounted = false;
            if (socketRef.current) {
                // Solo desuscribirse si estaba autenticado y suscrito
                if (deviceId && isAuthenticatedRef.current) {
                    socketRef.current.emit('unsubscribe_device', { deviceId });
                }
                socketRef.current.removeAllListeners();
                socketRef.current.disconnect();
                socketRef.current = null;
            }
            isAuthenticatedRef.current = false;
        };
    }, [deviceId, jwt]);

    return { reading, socketError, isConnecting };
}