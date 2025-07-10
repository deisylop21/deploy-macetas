"use client";

import { useForm } from "react-hook-form";
import { User, EditUserDTO, Role } from "../lib/types";
import { Button } from "../../core/components/ui/button";
import React from "react";

interface UserEditModalProps {
    open: boolean;
    user?: User;
    onClose: () => void;
    onSubmitSuccess: (data: EditUserDTO) => void;
    isDark?: boolean;
    loading?: boolean;
    roles?: Role[];
}

export function UserEditModal({
                                  open,
                                  user,
                                  onClose,
                                  onSubmitSuccess,
                                  isDark = false,
                                  loading = false,
                                  roles = [],
                              }: UserEditModalProps) {
    const currentRoleId = user?.roles?.[0]?.id || user?.role || "";

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<EditUserDTO>({
        defaultValues: {
            name: user?.name || "",
            lastname: user?.lastname || "",
            email: user?.email || "",
            birthdate: user?.profile?.birthdate || "",
            phone: user?.profile?.phone?.trim() || "",
            status_account: user?.status_account || user?.status || "Active",
            role_id: currentRoleId,
        }
    });

    React.useEffect(() => {
        if (user) {
            reset({
                name: user.name,
                lastname: user.lastname,
                email: user.email,
                birthdate: user.profile?.birthdate || "",
                phone: user.profile?.phone?.trim() || "",
                status_account: user.status_account || user.status || "Active",
                role_id: user.roles?.[0]?.id || user.role || "",
            });
        }
    }, [user, reset]);

    const onSubmit = async (data: EditUserDTO) => {
        await onSubmitSuccess(data);
        reset();
        onClose();
    };

    if (!open || !user) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
            <div className={`rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-700 flex-shrink-0">
                    <h2 className="text-xl font-bold">Editar Usuario</h2>
                </div>
                {/* Formulario scrolleable */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4"
                >
                    {/* ...campos como antes... */}
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
                        <label className="block mb-1 font-semibold text-base">Apellido</label>
                        <input
                            type="text"
                            {...register("lastname", { required: "El apellido es obligatorio" })}
                            className={`w-full border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                errors.lastname
                                    ? "border-red-400"
                                    : isDark
                                        ? "border-gray-600 bg-gray-700 text-white"
                                        : "border-gray-300"
                            }`}
                            autoComplete="off"
                        />
                        {errors.lastname && (
                            <span className={`${isDark ? 'text-red-400' : 'text-red-500'} text-xs`}>
                                {errors.lastname.message}
                            </span>
                        )}
                    </div>
                    <div>
                        <label className="block mb-1 font-semibold text-base">Email</label>
                        <input
                            type="email"
                            {...register("email", { required: "El email es obligatorio" })}
                            className={`w-full border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                errors.email
                                    ? "border-red-400"
                                    : isDark
                                        ? "border-gray-600 bg-gray-700 text-white"
                                        : "border-gray-300"
                            }`}
                            autoComplete="off"
                        />
                        {errors.email && (
                            <span className={`${isDark ? 'text-red-400' : 'text-red-500'} text-xs`}>
                                {errors.email.message}
                            </span>
                        )}
                    </div>
                    <div>
                        <label className="block mb-1 font-semibold text-base">Fecha de nacimiento</label>
                        <input
                            type="date"
                            {...register("birthdate", { required: "La fecha de nacimiento es obligatoria" })}
                            className={`w-full border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                errors.birthdate
                                    ? "border-red-400"
                                    : isDark
                                        ? "border-gray-600 bg-gray-700 text-white"
                                        : "border-gray-300"
                            }`}
                        />
                        {errors.birthdate && (
                            <span className={`${isDark ? 'text-red-400' : 'text-red-500'} text-xs`}>
                                {errors.birthdate.message}
                            </span>
                        )}
                    </div>
                    <div>
                        <label className="block mb-1 font-semibold text-base">Teléfono</label>
                        <input
                            type="tel"
                            {...register("phone", {
                                required: "El teléfono es obligatorio",
                                pattern: {
                                    value: /^\d{10}$/,
                                    message: "Debe ser un número de 10 dígitos"
                                }
                            })}
                            placeholder="9981234567"
                            className={`w-full border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                errors.phone
                                    ? "border-red-400"
                                    : isDark
                                        ? "border-gray-600 bg-gray-700 text-white"
                                        : "border-gray-300"
                            }`}
                            autoComplete="off"
                        />
                        {errors.phone && (
                            <span className={`${isDark ? 'text-red-400' : 'text-red-500'} text-xs`}>
                                {errors.phone.message}
                            </span>
                        )}
                    </div>
                    <div>
                        <label className="block mb-1 font-semibold text-base">Rol</label>
                        <select
                            {...register("role_id", { required: "Debe seleccionar un rol" })}
                            className={`w-full border rounded-lg px-3 py-1.5 ${
                                isDark
                                    ? "bg-gray-700 border-gray-600 text-white"
                                    : "bg-white border-gray-300"
                            } focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                errors.role_id ? "border-red-400" : ""
                            }`}
                            defaultValue={currentRoleId}
                        >
                            <option value="" disabled>
                                Seleccionar rol
                            </option>
                            {roles.map(role => (
                                <option key={role.id} value={role.id} className={isDark ? "bg-gray-700" : ""}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                        {errors.role_id && (
                            <span className={`${isDark ? 'text-red-400' : 'text-red-500'} text-xs`}>
                                {errors.role_id.message}
                            </span>
                        )}
                    </div>
                    <div>
                        <label className="block mb-1 font-semibold text-base">Estado</label>
                        <select
                            {...register("status_account", { required: "Debe seleccionar un estado" })}
                            className={`w-full border rounded-lg px-3 py-1.5 ${
                                isDark
                                    ? "bg-gray-700 border-gray-600 text-white"
                                    : "bg-white border-gray-300"
                            } focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                errors.status_account ? "border-red-400" : ""
                            }`}
                        >
                            <option value="Active">Activo</option>
                            <option value="Inactive">Inactivo</option>
                        </select>
                        {errors.status_account && (
                            <span className={`${isDark ? 'text-red-400' : 'text-red-500'} text-xs`}>
                                {errors.status_account.message}
                            </span>
                        )}
                    </div>
                </form>
                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-700 flex justify-end gap-2 flex-shrink-0">
                    <Button
                        type="button"
                        onClick={() => {
                            reset();
                            onClose();
                        }}
                        variant="ghost"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        form="edit-user-form"
                        disabled={isSubmitting || loading}
                        variant="default"
                        onClick={handleSubmit(onSubmit)}
                    >
                        {isSubmitting || loading ? "Guardando..." : "Guardar"}
                    </Button>
                </div>
            </div>
        </div>
    );
}