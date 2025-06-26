"use client";

import { useForm } from "react-hook-form";
import { CreateUserDTO, Role } from "../lib/types";
import { Button } from "../../core/components/ui/button";

interface UserCreateModalProps {
    open: boolean;
    onClose: () => void;
    onSubmitSuccess?: (data: CreateUserDTO) => void;
    roles: Role[];
    isDark?: boolean;
}

export function UserCreateModal({
                                    open,
                                    onClose,
                                    onSubmitSuccess,
                                    roles,
                                    isDark = false
                                }: UserCreateModalProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CreateUserDTO>();

    const onSubmit = async (data: CreateUserDTO) => {
        if (onSubmitSuccess) {
            try {
                await onSubmitSuccess(data);
                reset();
                onClose();
            } catch (error) {
                console.error("Error al crear usuario:", error);
            }
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
            <div className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'} rounded-2xl shadow-2xl w-full max-w-md p-4 relative`}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Crear nuevo usuario</h2>
                    <button
                        className={`${isDark ? 'text-gray-300 hover:text-red-400' : 'text-gray-400 hover:text-red-500'} text-xl transition-colors`}
                        onClick={() => {
                            reset();
                            onClose();
                        }}
                        aria-label="Cerrar"
                        type="button"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
                        <label className="block mb-1 font-semibold text-base">Correo</label>
                        <input
                            type="email"
                            {...register("email", {
                                required: "El correo es obligatorio",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Correo electrónico inválido"
                                }
                            })}
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
                            {...register("roleId", { required: "Debe seleccionar un rol" })}
                            className={`w-full border rounded-lg px-3 py-1.5 ${
                                isDark
                                    ? "bg-gray-700 border-gray-600 text-white"
                                    : "bg-white border-gray-300"
                            } focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                errors.roleId ? "border-red-400" : ""
                            }`}
                            defaultValue=""
                        >
                            <option value="" disabled className={isDark ? "bg-gray-700" : ""}>
                                Seleccionar rol
                            </option>
                            {roles.map(role => (
                                <option key={role.id} value={role.id} className={isDark ? "bg-gray-700" : ""}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                        {errors.roleId && (
                            <span className={`${isDark ? 'text-red-400' : 'text-red-500'} text-xs`}>
                                {errors.roleId.message}
                            </span>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 mt-3">
                        <Button
                            type="button"
                            variant={isDark ? "secondary" : "outline"}
                            onClick={() => {
                                reset();
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
                            {isSubmitting ? "Creando..." : "Crear"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}