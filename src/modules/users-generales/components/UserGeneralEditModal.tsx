"use client";

import { useForm } from "react-hook-form";
import { UserGeneral, UpdateUserGeneralDTO } from "../lib/types";
import { Button } from "../../core/components/ui/button";
import React from "react";

interface UserGeneralEditModalProps {
    open: boolean;
    user?: UserGeneral;
    onClose: () => void;
    onSubmitSuccess: (data: UpdateUserGeneralDTO) => void;
    isDark?: boolean;
    loading?: boolean;
}

export function UserGeneralEditModal({
                                         open,
                                         user,
                                         onClose,
                                         onSubmitSuccess,
                                         isDark = false,
                                         loading = false,
                                     }: UserGeneralEditModalProps) {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<UpdateUserGeneralDTO>({
        defaultValues: {
            status_account: user?.status_account || "Pending",
        }
    });

    React.useEffect(() => {
        if (user) {
            reset({ status_account: user.status_account });
        }
    }, [user, reset]);

    const onSubmit = async (data: UpdateUserGeneralDTO) => {
        await onSubmitSuccess(data);
        reset();
        onClose();
    };

    if (!open || !user) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
            <div className={`rounded-2xl shadow-2xl w-full max-w-md p-6 relative ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
                <h2 className="text-xl font-bold mb-4">Actualizar Estado</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
                            <option value="Pending">Pendiente</option>
                        </select>
                        {errors.status_account && (
                            <span className={`${isDark ? 'text-red-400' : 'text-red-500'} text-xs`}>
                                {errors.status_account.message}
                            </span>
                        )}
                    </div>
                    <div className="flex justify-end gap-2 mt-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => {
                                reset();
                                onClose();
                            }}
                            disabled={isSubmitting || loading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || loading}
                            className={isDark ? 'bg-green-600 hover:bg-green-700' : ''}
                        >
                            {isSubmitting || loading ? "Guardando..." : "Guardar"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}