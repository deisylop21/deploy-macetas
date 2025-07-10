"use client";

import { Module } from "../lib/types";
import { Button } from "../../core/components/ui/button";
import React from "react";

interface ModuleDetailsModalProps {
    open: boolean;
    module?: Module;
    onClose: () => void;
    onEdit: (module: Module) => void;
    onDelete: (module: Module) => void;
    isDark?: boolean;
}

export function ModuleDetailsModal({
                                       open,
                                       module,
                                       onClose,
                                       onEdit,
                                       onDelete,
                                       isDark = false,
                                   }: ModuleDetailsModalProps) {
    if (!open || !module) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
            <div className={`rounded-2xl shadow-2xl w-full max-w-md p-6 relative ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
                <h2 className="text-xl font-bold mb-4">Detalles del Módulo</h2>
                <div className="mb-4 space-y-2">
                    {/*<div><strong>ID:</strong> {module.id}</div>*/}
                    <div><strong>Nombre:</strong> {module.name}</div>
                    <div><strong>Descripción:</strong> {module.description}</div>
                    <div>
                        <strong>Estado:</strong>
                        <span className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold min-w-[90px] text-center ${
                            module.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
              {module.is_active ? "Activo" : "Inactivo"}
            </span>
                    </div>
                    <div><strong>Fecha de creación:</strong> {module.created_date}</div>
                </div>
                <div className="flex gap-2 justify-end mt-6">
                    <Button
                        onClick={() => onEdit(module)}
                        variant="outline"
                        size="sm"
                        className={isDark ? "bg-gray-700 text-white border-gray-600 hover:bg-gray-600" : ""}
                    >Editar</Button>
                    <Button
                        onClick={() => onDelete(module)}
                        variant="destructive"
                        size="sm"
                        className="border-red-600 text-red-600 hover:bg-red-50"
                    >Eliminar</Button>
                    <Button
                        onClick={onClose}
                        variant="ghost"
                        size="sm"
                    >Cerrar</Button>
                </div>
            </div>
        </div>
    );
}