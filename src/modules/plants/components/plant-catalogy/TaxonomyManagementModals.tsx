"use client";

import { useState } from "react";
import { Button } from "../../../core/components/ui/button";
import { TaxonomicNode } from "../../lib/taxonomy/types";
import { taxonomyService } from "../../services/taxonomy/taxonomyService";

interface TaxonomyEditModalProps {
    open: boolean;
    node: TaxonomicNode | null;
    onClose: () => void;
    onSuccess: () => void;
    isDark?: boolean;
}

interface TaxonomyDeleteModalProps {
    open: boolean;
    node: TaxonomicNode | null;
    onClose: () => void;
    onSuccess: () => void;
    isDark?: boolean;
}

export function TaxonomyEditModal({
                                      open,
                                      node,
                                      onClose,
                                      onSuccess,
                                      isDark = false
                                  }: TaxonomyEditModalProps) {
    const [newName, setNewName] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    useState(() => {
        if (open && node) {
            setNewName(node.name);
        }
    }, [open, node?.id]);

    if (!open || !node) return null;

    const handleUpdate = async () => {
        if (!newName.trim()) {
            alert("El nombre no puede estar vacío");
            return;
        }

        if (newName.trim() === node.name) {
            alert("No has realizado cambios en el nombre");
            return;
        }

        setIsUpdating(true);
        try {
            await taxonomyService.update(node.id, newName.trim());

            alert("Taxonomía actualizada correctamente");
            onSuccess();
            onClose();
        } catch (error) {
            console.error("❌ Error al actualizar taxonomía:", error);
            alert("Error al actualizar: " + (error instanceof Error ? error.message : 'Error desconocido'));
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4">
            <div className={`max-w-md w-full rounded-lg p-6 ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
                <h3 className="text-lg font-semibold mb-4">Editar Taxonomía</h3>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                        Nombre actual: <span className="font-normal italic">{node.name}</span>
                    </label>
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Nuevo nombre"
                        className={`w-full px-3 py-2 border rounded-md ${
                            isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                        }`}
                        disabled={isUpdating}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleUpdate();
                            }
                        }}
                    />
                </div>

                <div className="flex justify-end gap-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isUpdating}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleUpdate}
                        disabled={isUpdating || !newName.trim()}
                    >
                        {isUpdating ? "Actualizando..." : "Actualizar"}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export function TaxonomyDeleteModal({
                                        open,
                                        node,
                                        onClose,
                                        onSuccess,
                                        isDark = false
                                    }: TaxonomyDeleteModalProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    if (!open || !node) return null;

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await taxonomyService.delete(node.id);

            alert("Taxonomía eliminada correctamente");
            onSuccess();
            onClose();
        } catch (error) {
            console.error("❌ Error al eliminar taxonomía:", error);
            alert("Error al eliminar: " + (error instanceof Error ? error.message : 'Error desconocido'));
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4">
            <div className={`max-w-md w-full rounded-lg p-6 ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
                <h3 className="text-lg font-semibold mb-4 text-red-600">⚠️ Eliminar Taxonomía</h3>

                <div className="mb-6">
                    <p className="text-sm mb-3">
                        ¿Está seguro que desea eliminar la siguiente taxonomía?
                    </p>
                    <div className={`p-3 rounded-md ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <p className="font-medium">{node.name}</p>
                        <p className="text-sm opacity-70">ID: {node.id}</p>
                        <p className="text-sm opacity-70">Rango: {node.rank}</p>
                    </div>
                    <p className="text-sm mt-3 text-red-600">
                        <strong>⚠️ Advertencia:</strong> Esta acción no se puede deshacer y puede afectar otros registros.
                    </p>
                </div>

                <div className="flex justify-end gap-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isDeleting}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Eliminando..." : "Sí, eliminar"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
{/*ESTA ES UNA PAUSA PARA ELL CONTROL Z*/}