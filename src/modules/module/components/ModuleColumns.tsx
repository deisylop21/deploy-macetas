"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../../core/components/ui/button";
import { Switch } from "../../core/components/ui/switch";
import { Module } from "../lib/types.ts";
import * as React from "react";

interface StatusCellProps {
    moduleId: string;
    isActive: boolean;
    onToggle: (moduleId: string, newStatus: boolean) => Promise<void>;
    isDark?: boolean;
}

const StatusCell = ({ moduleId, isActive, onToggle, isDark }: StatusCellProps) => {
    const [isPending, setIsPending] = React.useState(false);

    const handleToggle = async () => {
        setIsPending(true);
        try {
            await onToggle(moduleId, !isActive);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="flex items-center">
            <Switch
                checked={isActive}
                onCheckedChange={handleToggle}
                disabled={isPending}
                className={isDark ? 'bg-gray-600 data-[state=checked]:bg-green-500' : ''}
            />
            <span className={`ml-2 ${isDark ? (isActive ? 'text-green-400' : 'text-gray-400') : ''}`}>
                {isActive ? "Activo" : "Inactivo"}
            </span>
        </div>
    );
};

export const createModuleColumns = (
    onToggleStatus: (moduleId: string, newStatus: boolean) => Promise<void>,
    isDark: boolean = false
): ColumnDef<Module>[] => [
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
            const { id, is_active } = row.original;
            return (
                <StatusCell
                    moduleId={id}
                    isActive={is_active}
                    onToggle={onToggleStatus}
                    isDark={isDark}
                />
            );
        },
    },
];