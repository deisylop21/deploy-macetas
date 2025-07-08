"use client";

import { useForm } from "react-hook-form";
import { CreateDeviceDTO } from "../lib/types";

interface DeviceCreateModalProps {
    open: boolean;
    onClose: () => void;
    onSubmitSuccess?: (data: CreateDeviceDTO) => void;
    isDark?: boolean;
    linkingCode?: string | null;
}

export function DeviceCreateModal({
                                      open,
                                      onClose,
                                      onSubmitSuccess,
                                      isDark = false,
                                      linkingCode
                                  }: DeviceCreateModalProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CreateDeviceDTO>();

    const onSubmit = async (data: CreateDeviceDTO) => {
        if (onSubmitSuccess) {
            await onSubmitSuccess(data);
            reset();
        }
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
            <div className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'} rounded-2xl shadow-2xl w-full max-w-md p-6 relative`}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Crear nuevo dispositivo</h2>
                    <button
                        className={`${isDark ? 'text-gray-300 hover:text-red-400' : 'text-gray-400 hover:text-red-500'} text-xl transition-colors`}
                        onClick={handleClose}
                        aria-label="Cerrar"
                        type="button"
                    >
                        ×
                    </button>
                </div>

                {linkingCode && (
                    <div className={`mb-4 p-3 rounded-lg ${isDark ? 'bg-green-900 border-green-600' : 'bg-green-50 border-green-200'} border`}>
                        <p className={`text-sm font-medium ${isDark ? 'text-green-300' : 'text-green-800'}`}>
                            ¡Dispositivo creado exitosamente!
                        </p>
                        <p className={`text-lg font-mono font-bold ${isDark ? 'text-green-200' : 'text-green-900'}`}>
                            Código de enlace: {linkingCode}
                        </p>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <div>
                        <label className="block mb-1 font-semibold text-base">
                            Identificador del dispositivo
                        </label>
                        <input
                            type="text"
                            {...register("identifier", {
                                required: "El identificador es obligatorio",
                                minLength: {
                                    value: 3,
                                    message: "El identificador debe tener al menos 3 caracteres"
                                }
                            })}
                            className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                errors.identifier
                                    ? "border-red-400"
                                    : isDark
                                        ? "border-gray-600 bg-gray-700 text-white"
                                        : "border-gray-300"
                            }`}
                            placeholder="Ej: iot, sensor-001, device-main"
                            autoComplete="off"
                        />
                        {errors.identifier && (
                            <span className={`${isDark ? 'text-red-400' : 'text-red-500'} text-xs mt-1 block`}>
                                {errors.identifier.message}
                            </span>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className={`px-4 py-2 rounded-lg ${
                                isDark
                                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                            } font-semibold transition`}
                            disabled={isSubmitting}
                        >
                            {linkingCode ? "Cerrar" : "Cancelar"}
                        </button>
                        {!linkingCode && (
                            <button
                                type="submit"
                                className={`px-4 py-2 rounded-lg ${
                                    isDark
                                        ? "bg-green-600 hover:bg-green-700"
                                        : "bg-green-700 hover:bg-green-800"
                                } text-white font-semibold transition`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Creando..." : "Crear Dispositivo"}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}