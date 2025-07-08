"use client";

import { useForm } from "react-hook-form";
import { Module } from "../lib/types";
import { Button } from "../../core/components/ui/button";
import React from "react";

type EditModuleDTO = {
    name: string;
    description: string;
    is_active: boolean;
};

interface ModuleEditModalProps {
    open: boolean;
    module?: Module;
    onClose: () => void;
    onSubmitSuccess: (data: EditModuleDTO) => void;
    isDark?: boolean;
    loading?: boolean;
}

export function ModuleEditModal({
                                    open,
                                    module,
                                    onClose,
                                    onSubmitSuccess,
                                    isDark = false,
                                    loading = false,
                                }: ModuleEditModalProps) {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<EditModuleDTO>({
        defaultValues: {
            name: module?.name || "",
            description: module?.description || "",
            is_active: module?.is_active ?? true,
        }
    });

    React.useEffect(() => {
        if (module) {
            reset({
                name: module.name,
                description: module.description,
                is_active: module.is_active,
            });
        }
    }, [module, reset]);

    const onSubmit = async (data: EditModuleDTO) => {
        await onSubmitSuccess(data);
        reset();
        onClose();
    };

    if (!open || !module) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
            <div className={`rounded-2xl shadow-2xl w-full max-w-md p-6 relative ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
                <h2 className="text-xl font-bold mb-4">Editar Módulo</h2>
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
                            {...register("description", { required: "La descripción es obligatoria" })}
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
                    <div className="flex items-center gap-2">
                        <label className="font-semibold text-base">Estado:</label>
                        <input
                            type="checkbox"
                            {...register("is_active")}
                            className="w-5 h-5"
                            defaultChecked={module?.is_active ?? true}
                        />
                        <span>{module?.is_active ? "Activo" : "Inactivo"}</span>
                    </div>
                    <div className="flex justify-end gap-2 mt-3">
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
                            disabled={isSubmitting || loading}
                            variant="default"
                        >
                            {isSubmitting || loading ? "Guardando..." : "Guardar"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}