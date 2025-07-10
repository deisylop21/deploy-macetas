"use client";

import { User } from "../lib/types";
import { Button } from "../../core/components/ui/button";
import React from "react";

interface UserDetailsModalProps {
    open: boolean;
    user?: User;
    onClose: () => void;
    onEdit: (user: User) => void;
    isDark?: boolean;
    loading?: boolean;
}

export function UserDetailsModal({
                                     open,
                                     user,
                                     onClose,
                                     onEdit,
                                     isDark = false,
                                     loading = false,
                                 }: UserDetailsModalProps) {
    if (!open || !user) return null;

    const roleName = user.role || user.roles?.[0]?.name || "-";

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
            <div className={`rounded-2xl shadow-2xl w-full max-w-md p-6 relative ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
                <h2 className="text-xl font-bold mb-4">Detalles del Usuario</h2>
                <div className="mb-4 space-y-2">
                    <div><strong>Nombre:</strong> {user.name}</div>
                    <div><strong>Apellido:</strong> {user.lastname}</div>
                    <div><strong>Email:</strong> {user.email}</div>
                    <div><strong>Rol:</strong> {roleName}</div>
                    <div><strong>Fecha de nacimiento:</strong> {user.profile?.birthdate || "-"}</div>
                    <div><strong>Teléfono:</strong> {user.profile?.phone?.trim() || "-"}</div>
                    <div>
                        <strong>Estado:</strong>
                        <span className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold min-w-[90px] text-center ${
                            user.status === "Active" ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                            {user.status === "Active" ? "Activo" : "Inactivo"}
                        </span>
                    </div>
                </div>
                <div className="flex gap-2 justify-end mt-6">
                    <Button
                        onClick={() => onEdit(user)}
                        variant="outline"
                        size="sm"
                        className={isDark ? "bg-gray-700 text-white border-gray-600 hover:bg-gray-600" : ""}
                    >Editar</Button>
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