import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

interface DeviceReading {
    deviceId: string;
    temperature: number;
    humidity: number;
    light_on: boolean;
    watering_on: boolean;
}

export function useDeviceSocket(deviceId: string | undefined, jwt: string | null) {
    const [reading, setReading] = useState<DeviceReading | null>(null);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (!deviceId || !jwt) return;

        const socket = io("ws://artistic-victory-env2.up.railway.app/device-readings", {
            transports: ["websocket"],
            auth: { token: jwt },
        });

        socketRef.current = socket;

        socket.emit("subscribe_device", { deviceId });

        socket.on("device_data", (data: DeviceReading) => {
            setReading(data);
        });

        socket.onAny((event, ...args) => {
            console.log("Socket event:", event, args);
        });

        return () => {
            socket.emit("unsubscribe_device", { deviceId });
            socket.disconnect();
        };
    }, [deviceId, jwt]);

    return { reading };
}