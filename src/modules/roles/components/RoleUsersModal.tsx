"use client";

import { useEffect, useState } from "react";
import { Button } from "../../core/components/ui/button";
import { getHeaders } from "../../core/utils/UtilsFuntions";

interface User {
    id: string;
    email: string;
    name: string;
}

interface RoleUsersModalProps {
    open: boolean;
    onClose: () => void;
    roleId: string;
    isDark?: boolean;
}

export function RoleUsersModal({ open, onClose, roleId, isDark = false }: RoleUsersModalProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!open) return;

        const fetchUsers = async () => {
            setLoading(true);
            setError(null);
            try {
                const baseUrl = "https://artistic-victory-env2.up.railway.app";
                const url = `${baseUrl}/admin-management/users?roleId=${roleId}`;
                const resp = await fetch(url, {
                    headers: getHeaders()
                });
                if (!resp.ok) {
                    throw new Error("Error al obtener los usuarios");
                }
                const data = await resp.json();
                setUsers(Array.isArray(data) ? data : data.data ?? []);
            } catch (err: any) {
                setError(err.message || "Error desconocido");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [open, roleId]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
            <div className={`rounded-2xl shadow-2xl w-full max-w-lg p-6 relative ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Usuarios asignados a este rol</h2>
                    <button
                        className={`${isDark ? 'text-gray-300 hover:text-red-400' : 'text-gray-400 hover:text-red-500'} text-xl transition-colors`}
                        onClick={onClose}
                        aria-label="Cerrar"
                        type="button"
                    >
                        ×
                    </button>
                </div>
                {loading ? (
                    <div className="text-center py-8">Cargando usuarios...</div>
                ) : error ? (
                    <div className={`${isDark ? "text-red-400" : "text-red-500"} text-center py-8`}>
                        {error}
                    </div>
                ) : users.length === 0 ? (
                    <div className="text-center text-gray-400 py-8">No hay usuarios asignados a este rol</div>
                ) : (
                    <ul className="max-h-72 overflow-y-auto divide-y divide-gray-300">
                        {users.map(user => (
                            <li key={user.id} className="py-2 flex flex-col">
                                <span className="font-medium">{user.name || user.email}</span>
                                <span className="text-xs text-gray-500">{user.email}</span>
                            </li>
                        ))}
                    </ul>
                )}
                <div className="flex justify-end mt-6">
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