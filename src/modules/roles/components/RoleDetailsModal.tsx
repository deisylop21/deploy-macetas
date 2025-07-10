"use client";

import { Role, permissionLabels, PermissionType, Permission } from "../lib/types";
import { Button } from "../../core/components/ui/button";
import { Module } from "../../module/lib/types";

function formatDate(dateStr?: string | null) {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-MX", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    });
}

interface RoleDetailsModalProps {
    open: boolean;
    role?: Role;
    modules: Module[];
    onClose: () => void;
    onEdit: (role: Role) => void;
    isDark?: boolean;
}

export function RoleDetailsModal({
                                     open,
                                     role,
                                     modules,
                                     onClose,
                                     onEdit,
                                     isDark = false
                                 }: RoleDetailsModalProps) {
    if (!open || !role) return null;

    const moduleName = (module_id: string) =>
        modules.find((m) => m.id === module_id)?.name || module_id;

    const permissions: Permission[] = Array.isArray(role.permissions) ? role.permissions : [];

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
            <div className={`rounded-2xl shadow-2xl w-full max-w-lg p-6 relative ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
                <h2 className="text-xl font-bold mb-4">Detalles del Rol</h2>
                <div className="mb-4 space-y-2">
                    {/* <div><strong>ID:</strong> {role.id}</div>  <-- ID REMOVIDO */}
                    <div><strong>Nombre:</strong> {role.name}</div>
                    <div><strong>Descripción:</strong> {role.description}</div>
                    <div className="flex items-center gap-2">
                        <strong>Estado:</strong>
                        {role.is_active ? (
                            <span className="px-3 py-1 rounded-lg bg-green-100 text-green-800 text-sm font-semibold">
                                Activo
                            </span>
                        ) : (
                            <span className="px-3 py-1 rounded-lg bg-red-100 text-red-800 text-sm font-semibold">
                                Inactivo
                            </span>
                        )}
                    </div>
                    <div><strong>Usuarios asignados:</strong> {role.user_count ?? 0}</div>
                    <div><strong>Fecha de creación:</strong> {formatDate(role.created_date)}</div>
                    <div>
                        <strong>Permisos por módulo:</strong>
                        <div className="mt-2 space-y-2">
                            {permissions.length === 0 ? (
                                <div className="text-gray-400">Sin permisos asignados</div>
                            ) : (
                                permissions.map((perm: Permission, idx) => (
                                    <div key={perm.module_id + idx}>
                                        <div className="font-semibold">{moduleName(perm.module_id)}</div>
                                        <div className="flex gap-2 flex-wrap mt-1">
                                            {(perm.permissions as PermissionType[]).map((p) => (
                                                <span
                                                    key={p}
                                                    className={
                                                        "px-2 py-1 rounded bg-green-100 text-green-900 text-xs font-semibold"
                                                    }
                                                >
                                                    {permissionLabels[p]}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 justify-end mt-6">
                    <Button
                        onClick={() => onEdit(role)}
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