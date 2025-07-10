"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Role } from "../lib/types";
import { Button } from "../../core/components/ui/button";
import * as React from "react";

export const createRoleColumns = (
    onShowDetails: (role: Role) => void,
    isDark: boolean = false
): ColumnDef<Role>[] => [
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
        accessorKey: "description",
        header: "Descripción",
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
        accessorKey: "is_active",
        header: "Estado",
        cell: ({ row }) => {
            const isActive = row.original.is_active;
            return (
                <div className="flex justify-left">
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
            const role = row.original;
            const isActive = role.is_active;
            return (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onShowDetails(role)}
                    className={`text-xs ${isActive ? "" : "opacity-60"} ${isDark ? "border-gray-600 text-white hover:bg-gray-700" : ""}`}
                >
                    Detalles
                </Button>
            );
        },
    },
];