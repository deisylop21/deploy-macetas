"use client";

import { UserGeneral } from "../lib/types";
import { Button } from "../../core/components/ui/button";
import React from "react";

interface UserGeneralDetailsModalProps {
    open: boolean;
    user?: UserGeneral;
    onClose: () => void;
    onEdit: (user: UserGeneral) => void;
    isDark?: boolean;
    loading?: boolean;
}

export function UserGeneralDetailsModal({
                                            open,
                                            user,
                                            onClose,
                                            onEdit,
                                            isDark = false,
                                            loading = false,
                                        }: UserGeneralDetailsModalProps) {
    if (!open || !user) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
            <div className={`rounded-2xl shadow-2xl w-full max-w-md p-6 relative ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
                <h2 className="text-xl font-bold mb-4">Detalles del Usuario General</h2>
                <div className="mb-4 space-y-2">
                    <div><strong>Nombre:</strong> {user.name}</div>
                    <div><strong>Apellido:</strong> {user.lastname}</div>
                    <div><strong>Email:</strong> {user.email}</div>
                    <div><strong>Estado:</strong> {user.status_account}</div>
                    <div><strong>Fecha de registro:</strong> {user.created_at ? new Date(user.created_at).toLocaleString() : "-"}</div>
                </div>
                <div className="flex gap-2 justify-end mt-6">
                    <Button
                        onClick={() => onEdit(user)}
                        variant="outline"
                        size="sm"
                        className={isDark ? "bg-gray-700 text-white border-gray-600 hover:bg-gray-600" : ""}
                    >Editar Estado</Button>
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