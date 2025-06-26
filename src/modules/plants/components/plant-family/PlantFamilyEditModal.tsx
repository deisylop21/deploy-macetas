"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { UpdatePlantFamilyDTO, PlantFamily } from "../../lib/plant-family/types";

interface PlantFamilyEditModalProps {
    open: boolean;
    onClose: () => void;
    onSubmitSuccess?: (id: string, data: UpdatePlantFamilyDTO) => void;
    family: PlantFamily | null;
    isDark?: boolean;
}

export function PlantFamilyEditModal({
                                         open,
                                         onClose,
                                         onSubmitSuccess,
                                         family,
                                         isDark = false
                                     }: PlantFamilyEditModalProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<UpdatePlantFamilyDTO>();

    useEffect(() => {
        if (family) {
            reset({
                name: family.name,
                description: family.description
            });
        }
    }, [family, reset]);

    const onSubmit = async (data: UpdatePlantFamilyDTO) => {
        if (onSubmitSuccess && family) {
            await onSubmitSuccess(family.id, data);
            onClose();
        }
    };

    if (!open || !family) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
            <div className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'} rounded-2xl shadow-2xl w-full max-w-md p-4 relative`}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Editar familia</h2>
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
                        <label className="block mb-1 font-semibold text-base">Descripción</label>
                        <textarea
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
                            rows={3}
                        />
                        {errors.description && (
                            <span className={`${isDark ? 'text-red-400' : 'text-red-500'} text-xs`}>
                                {errors.description.message}
                            </span>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 mt-3">
                        <button
                            type="button"
                            onClick={() => {
                                reset();
                                onClose();
                            }}
                            className={`px-4 py-1.5 rounded-lg ${
                                isDark
                                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                            } font-semibold transition`}
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className={`px-4 py-1.5 rounded-lg ${
                                isDark
                                    ? "bg-green-600 hover:bg-green-700"
                                    : "bg-green-700 hover:bg-green-800"
                            } text-white font-semibold transition`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Guardando..." : "Guardar cambios"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}