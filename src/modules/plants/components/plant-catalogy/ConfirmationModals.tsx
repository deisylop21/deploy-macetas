"use client";

import { Button } from "../../../core/components/ui/button";

interface ConfirmationModalsProps {
    showCancelConfirm: boolean;
    showSubmitConfirm: boolean;
    isEdit: boolean;
    isSubmitting: boolean;
    onCancelConfirm: () => void;
    onSubmitConfirm: () => void;
    onCloseCancelModal: () => void;
    onCloseSubmitModal: () => void;
    isDark?: boolean;
}

export function ConfirmationModals({
                                       showCancelConfirm,
                                       showSubmitConfirm,
                                       isEdit,
                                       isSubmitting,
                                       onCancelConfirm,
                                       onSubmitConfirm,
                                       onCloseCancelModal,
                                       onCloseSubmitModal,
                                       isDark = false
                                   }: ConfirmationModalsProps) {
    return (
        <>
            {showCancelConfirm && (
                <div className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4">
                    <div className={`max-w-md w-full rounded-lg p-6 ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
                        <h3 className="text-lg font-semibold mb-4">¿Seguro que desea cancelar?</h3>
                        <p className="text-sm mb-6">¿Seguro que desea cancelar? Los cambios no guardados se perderán.</p>
                        <div className="flex justify-end gap-3">
                            <Button variant="outline" onClick={onCloseCancelModal}>No</Button>
                            <Button variant="destructive" onClick={onCancelConfirm}>Sí, cancelar</Button>
                        </div>
                    </div>
                </div>
            )}

            {showSubmitConfirm && (
                <div className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4">
                    <div className={`max-w-md w-full rounded-lg p-6 ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
                        <h3 className="text-lg font-semibold mb-4">¿Confirmar?</h3>
                        <p className="text-sm mb-6">
                            ¿Desea {isEdit ? "actualizar" : "añadir"} los datos de la planta a la base de datos para que sea visible para los usuarios de la aplicación móvil?
                        </p>
                        <div className="flex justify-end gap-3">
                            <Button variant="outline" onClick={onCloseSubmitModal} disabled={isSubmitting}>No</Button>
                            <Button onClick={onSubmitConfirm} disabled={isSubmitting}>
                                {isSubmitting ? "Guardando..." : `Sí, ${isEdit ? "actualizar" : "agregar"}`}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}