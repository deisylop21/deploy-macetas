"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../../core/components/ui/button";
import { Device } from "../lib/types";

export const createDeviceColumns = (
    onEdit: (device: Device) => void,
    onDelete: (device: Device) => void,
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
            const isAvailable = value === "AVAILABLE";
            return (
                <div className="flex justify-left">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold min-w-[100px] text-center ${
                        isAvailable
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                    }`}>
                        {isAvailable ? "Disponible" : "Deshabilitado"}
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
                    {value}
                </span>
            );
        }
    },
    {
        accessorKey: "registered_at",
        header: "Fecha de Registro",
        cell: ({ getValue }) => {
            const value = getValue() as string;
            const date = new Date(value);
            return (
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {date.toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    })}
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
                        onClick={() => onEdit(device)}
                        className={`text-xs ${isDark ? "border-gray-600 text-white hover:bg-gray-700" : ""}`}
                    >
                        Editar
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