"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../../core/components/ui/button";
import { Device } from "../lib/types";

export const createDeviceColumns = (
    onShowDetails: (device: Device) => void,
    onRegenerateKey: (device: Device) => void,
    isDark: boolean = false
): ColumnDef<Device>[] => [
    {
        accessorKey: "identifier",
        header: "Identificador",
        cell: ({ getValue }) => {
            const value = getValue() as string;
            return (
                <span className={`font-medium ${isDark ? 'text-white' : ''}`}>
                    {value}
                </span>
            );
        }
    },
    {
        accessorKey: "status",
        header: "Estado",
        cell: ({ getValue }) => {
            const value = getValue() as string;
            let estado = "Desconocido";
            let clase = "bg-gray-200 text-gray-700";
            if (value === "AVAILABLE") {
                estado = "Disponible";
                clase = "bg-green-100 text-green-800";
            } else if (value === "DISABLED") {
                estado = "Deshabilitado";
                clase = "bg-red-100 text-red-800";
            } else if (value === "LINKED") {
                estado = "Vinculado";
                clase = "bg-blue-100 text-blue-800";
            }
            return (
                <div className="flex justify-left">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold min-w-[100px] text-center ${clase}`}>
                        {estado}
                    </span>
                </div>
            );
        }
    },
    {
        accessorKey: "linking_key",
        header: "Clave de Enlace",
        cell: ({ getValue }) => {
            const value = getValue() as string;
            return (
                <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'} font-mono font-semibold`}>
                    {value || "-"}
                </span>
            );
        }
    },
    {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => {
            const device = row.original;
            return (
                <div className="flex gap-1 flex-wrap">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onShowDetails(device)}
                        className={`text-xs ${isDark ? "border-gray-600 text-white hover:bg-gray-700" : ""}`}
                    >
                        Detalles
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRegenerateKey(device)}
                        className={`text-xs ${isDark ? "border-blue-600 text-blue-400 hover:bg-blue-900" : "border-blue-600 text-blue-600 hover:bg-blue-50"}`}
                    >
                        Regenerar
                    </Button>
                </div>
            );
        },
    },
];