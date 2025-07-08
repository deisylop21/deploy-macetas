"use client";

import { Module } from "../lib/types";
import { Button } from "../../core/components/ui/button";

interface ModuleDeleteModalProps {
    open: boolean;
    module?: Module;
    onClose: () => void;
    onConfirm: (module: Module) => void;
    isDark?: boolean;
    loading?: boolean;
}

export function ModuleDeleteModal({
                                      open,
                                      module,
                                      onClose,
                                      onConfirm,
                                      isDark = false,
                                      loading = false,
                                  }: ModuleDeleteModalProps) {
    if (!open || !module) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
            <div className={`rounded-2xl shadow-2xl w-full max-w-md p-6 relative ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
                <h2 className="text-xl font-bold mb-4 text-red-600">¿Eliminar módulo?</h2>
                <p className="mb-4">
                    ¿Estás seguro que deseas eliminar el módulo <strong>{module.name}</strong>? Esta acción no se puede deshacer.
                </p>
                <div className="flex justify-end gap-2">
                    <Button
                        onClick={onClose}
                        variant="ghost"
                        size="sm"
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={() => onConfirm(module)}
                        variant="destructive"
                        size="sm"
                        disabled={loading}
                    >
                        {loading ? "Eliminando..." : "Eliminar"}
                    </Button>
                </div>
            </div>
        </div>
    );
}