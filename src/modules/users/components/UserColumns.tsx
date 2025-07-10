"use client";

import { ColumnDef } from "@tanstack/react-table";
import { User } from "../lib/types";
import { Button } from "../../core/components/ui/button";

export const createUserColumns = (
    onShowDetails: (user: User) => void,
    isDark: boolean = false
): ColumnDef<User>[] => [
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
                <div className="flex justify-left" >
                <span
                    className={
                        "px-3 py-1 rounded-full font-semibold text-xs min-w-[100px] text-center " +
                        (isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800")
                    }
                >
                    {isActive ? "Activo" : "Inactivo"}
                </span>
                </div>
            );
        },
    },
    {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => {
            const user = row.original;
            return (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onShowDetails(user)}
                    className={`text-xs ${isDark ? "border-gray-600 text-white hover:bg-gray-700" : ""}`}
                >
                    Detalles
                </Button>
            );
        },
    },
];
{/*HOLA aqui pausa con el contorl z*/}