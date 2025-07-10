"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Role, PermissionType, permissionLabels, Permission } from "../lib/types";
import { Module } from "../../module/lib/types";
import { Button } from "../../core/components/ui/button";
import { Checkbox } from "../../core/components/ui/checkbox";
{/*Hola, aqui para el control z*/}
interface RoleUpdateModalProps {
    open: boolean;
    onClose: () => void;
    onSubmitSuccess?: (data: Partial<Role>) => void;
    role?: Role;
    modules: Module[];
    isDark?: boolean;
}

type ModulePermissionsState = Record<string, PermissionType[]>;

function extractPermissions(permissions: Permission[]): ModulePermissionsState {
    const state: ModulePermissionsState = {};
    permissions.forEach(p => {
        state[p.module_id] = p.permissions;
    });
    return state;
}

export function RoleUpdateModal({
                                    open,
                                    onClose,
                                    onSubmitSuccess,
                                    role,
                                    modules,
                                    isDark = false
                                }: RoleUpdateModalProps) {
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<Partial<Role>>();

    const [modulePermissions, setModulePermissions] = useState<ModulePermissionsState>({});

    useEffect(() => {
        if (role && open) {
            setValue("name", role.name);
            setValue("description", role.description);
            setValue("is_active", role.is_active);
            setModulePermissions(extractPermissions(role.permissions));
        }
    }, [role, open, setValue]);

    const activeModules = Array.isArray(modules) ? modules.filter(module => module.is_active === true) : [];

    const updateModulePermissions = (moduleId: string, permission: PermissionType, checked: boolean) => {
        setModulePermissions(prevState => {
            const currentPermissions = [...(prevState[moduleId] || [])];

            if (checked) {
                if (permission !== "READ" && !currentPermissions.includes("READ")) {
                    return {
                        ...prevState,
                        [moduleId]: [...currentPermissions, permission, "READ"]
                    };
                }
                return {
                    ...prevState,
                    [moduleId]: [...new Set([...currentPermissions, permission])]
                };
            } else {
                // Si se está quitando READ pero hay otros permisos, no permitir (READ es obligatorio si hay otros)
                if (permission === "READ" && currentPermissions.some(p => p !== "READ")) {
                    return prevState;
                }
                return {
                    ...prevState,
                    [moduleId]: currentPermissions.filter(p => p !== permission)
                };
            }
        });
    };

    const prepareFormData = (data: any): Partial<Role> => {
        const permissions = Object.entries(modulePermissions)
            .filter(([_, perms]) => perms.length > 0)
            .map(([module_id, permissions]) => ({
                module_id,
                permissions
            }));

        const patch: Partial<Role> = {};
        if (data.name !== role?.name) patch.name = data.name;
        if (data.description !== role?.description) patch.description = data.description;
        if (data.is_active !== role?.is_active) patch.is_active = data.is_active;
        if (JSON.stringify(permissions) !== JSON.stringify(role?.permissions)) patch.permissions = permissions;
        return patch;
    };

    const onSubmit = async (data: any) => {
        const formData = prepareFormData(data);


        if (Object.keys(formData).length === 0) {
            onClose();
            return;
        }

        if (formData.permissions && formData.permissions.length === 0) {
            alert("Debe seleccionar al menos un permiso para un módulo");
            return;
        }

        if (onSubmitSuccess) {
            try {
                await onSubmitSuccess(formData);
                reset();
                setModulePermissions({});
                onClose();
            } catch (error) {
                console.error("Error al actualizar rol:", error);
            }
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
            <div className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'} rounded-2xl shadow-2xl w-full max-w-3xl p-4 relative max-h-[90vh] overflow-y-auto`}>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Actualizar rol</h2>
                    <button
                        className={`${isDark ? 'text-gray-300 hover:text-red-400' : 'text-gray-400 hover:text-red-500'} text-xl transition-colors`}
                        onClick={() => {
                            reset();
                            setModulePermissions({});
                            onClose();
                        }}
                        aria-label="Cerrar"
                        type="button"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 font-semibold text-base">Nombre</label>
                            <input
                                type="text"
                                {...register("name", { required: "El nombre es obligatorio" })}
                                className={`w-full border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                    errors.name
                                        ? "border-red-400"
                                        : isDark
                                            ? "border-gray-600 bg-gray-700 text-white"
                                            : "border-gray-300"
                                }`}
                                autoComplete="off"
                            />
                            {errors.name && (
                                <span className={`${isDark ? 'text-red-400' : 'text-red-500'} text-xs`}>
                                    {errors.name.message}
                                </span>
                            )}
                        </div>

                        <div>
                            <label className="block mb-1 font-semibold text-base">Descripción</label>
                            <input
                                type="text"
                                {...register("description", {
                                    required: "La descripción es obligatoria",
                                })}
                                className={`w-full border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                    errors.description
                                        ? "border-red-400"
                                        : isDark
                                            ? "border-gray-600 bg-gray-700 text-white"
                                            : "border-gray-300"
                                }`}
                            />
                            {errors.description && (
                                <span className={`${isDark ? 'text-red-400' : 'text-red-500'} text-xs`}>
                                    {errors.description.message}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <input
                                type="checkbox"
                                {...register("is_active")}
                                id="is_active"
                                className="mr-2"
                                defaultChecked={role?.is_active}
                            />
                            <label htmlFor="is_active" className="font-semibold text-base">
                                Activo
                            </label>
                        </div>
                    </div>

                    <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">Permisos por módulo</h3>

                        <div className={`border rounded-lg p-4 ${
                            isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                        }`}>
                            {activeModules.length === 0 ? (
                                <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    No hay módulos activos disponibles
                                </p>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {activeModules.map(module => (
                                        <div key={module.id} className={`border-b pb-3 last:border-b-0 ${
                                            isDark ? 'border-gray-600' : 'border-gray-200'
                                        }`}>
                                            <h4 className={`font-medium mb-2 ${isDark ? 'text-green-400' : ''}`}>
                                                {module.name}
                                            </h4>
                                            <div className="flex flex-wrap gap-4">
                                                {(["READ", "CREATE", "UPDATE", "DELETE"] as PermissionType[]).map(permission => {
                                                    const isChecked = modulePermissions[module.id]?.includes(permission) || false;
                                                    const isReadOnlyDisabled =
                                                        permission === "READ" &&
                                                        modulePermissions[module.id]?.some(p => p !== "READ");

                                                    return (
                                                        <label key={`${module.id}-${permission}`} className="flex items-center space-x-2">
                                                            <Checkbox
                                                                checked={isChecked}
                                                                disabled={isReadOnlyDisabled}
                                                                className={isDark ? 'border-gray-500 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500' : ''}
                                                                onCheckedChange={(checked) => {
                                                                    updateModulePermissions(module.id, permission, checked === true);
                                                                }}
                                                            />
                                                            <span className={isDark ? 'text-gray-300' : ''}>
                                                                {permissionLabels[permission]}
                                                            </span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <Button
                            type="button"
                            variant={isDark ? "secondary" : "outline"}
                            onClick={() => {
                                reset();
                                setModulePermissions({});
                                onClose();
                            }}
                            disabled={isSubmitting}
                            className={isDark ? 'bg-gray-700 hover:bg-gray-600' : ''}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className={isDark ? 'bg-green-600 hover:bg-green-700' : ''}
                        >
                            {isSubmitting ? "Actualizando..." : "Actualizar Rol"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}