"use client";

import { ColumnDef } from "@tanstack/react-table";
import { User } from "../lib/types";

export const createUserColumns = (isDark: boolean = false): ColumnDef<User>[] => [
    {
        accessorKey: "name",
        header: "Nombre",
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
        accessorKey: "lastname",
        header: "Apellido",
        cell: ({ getValue }) => {
            const value = getValue() as string;
            return (
                <span className={`${isDark ? 'text-white' : ''}`}>
                    {value}
                </span>
            );
        }
    },
    {
        accessorKey: "email",
        header: "Correo",
        cell: ({ getValue }) => {
            const value = getValue() as string;
            return (
                <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {value}
                </span>
            );
        }
    },
    {
        accessorKey: "role",
        header: "Rol",
        cell: ({ getValue }) => {
            const value = getValue() as string;
            return (
                <span className={`${isDark ? 'text-green-400' : 'text-green-700'} font-medium`}>
                    {value}
                </span>
            );
        }
    },
    {
        accessorKey: "status",
        header: "Estado",
        cell: ({ row }) => {
            const status = row.original.status;
            const isActive = status === "Active";
            return (
                <div className={`px-2 py-1 rounded-full text-xs inline-flex items-center ${
                    isDark
                        ? isActive
                            ? "bg-green-900/50 text-green-400"
                            : "bg-red-900/50 text-red-400"
                        : isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                }`}>
                    <span className={`w-2 h-2 rounded-full mr-1 ${
                        isActive ? "bg-green-500" : "bg-red-500"
                    }`}></span>
                    {isActive ? "Activo" : "Inactivo"}
                </div>
            );
        },
    },
];