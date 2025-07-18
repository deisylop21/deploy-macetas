"use client";

import { ColumnDef } from "@tanstack/react-table";
import { UserGeneral } from "../lib/types";
import { Button } from "../../core/components/ui/button";

export const createUserGeneralColumns = (
    onShowDetails: (user: UserGeneral) => void,
    isDark: boolean = false
): ColumnDef<UserGeneral>[] => [
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
        accessorKey: "status_account",
        header: "Estado",
        cell: ({ row }) => {
            const status = row.original.status_account;
            let color, text;
            if (status === "Active") {
                color = "bg-green-100 text-green-800";
                text = "Activo";
            } else if (status === "Inactive") {
                color = "bg-red-100 text-red-800";
                text = "Inactivo";
            } else {
                color = "bg-yellow-100 text-yellow-800";
                text = "Pendiente";
            }
            return (
                <div className="flex justify-left">
                  <span className={`px-3 py-1 rounded-full font-semibold text-xs min-w-[100px] text-center ${color}`}>
                    {text}
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