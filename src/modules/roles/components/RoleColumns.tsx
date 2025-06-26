"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Switch } from "../../core/components/ui/switch";
import { Role } from "../lib/types";
import * as React from "react";

export const createRoleColumns = (isDark: boolean = false): ColumnDef<Role>[] => [
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
                <div className="flex items-center">
                    <Switch
                        checked={isActive}
                        disabled={true}
                        className={isDark ? 'bg-gray-600 data-[state=checked]:bg-green-500' : ''}
                    />
                    <span className={`ml-2 ${isDark ? (isActive ? 'text-green-400' : 'text-gray-400') : ''}`}>
                        {isActive ? "Activo" : "Inactivo"}
                    </span>
                </div>
            );
        },
    },
];