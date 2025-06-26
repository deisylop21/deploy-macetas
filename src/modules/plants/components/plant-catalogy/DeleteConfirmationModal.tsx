"use client";

import { Button } from "../../../core/components/ui/button";

interface DeleteConfirmationModalProps {
    open: boolean;
    title: string;
    message: string;
    onCancel: () => void;
    onConfirm: () => void;
    isDeleting: boolean;
    isDark?: boolean;
}

export function DeleteConfirmationModal({
                                            open,
                                            title,
                                            message,
                                            onCancel,
                                            onConfirm,
                                            isDeleting,
                                            isDark = false
                                        }: DeleteConfirmationModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4">
            <div className={`max-w-md w-full rounded-lg p-6 ${
                isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'
            }`}>
                <h3 className="text-lg font-semibold mb-4">{title}</h3>
                <p className="text-sm mb-6">{message}</p>
                <div className="flex justify-end gap-3">
                    <Button
                        variant="outline"
                        onClick={onCancel}
                        disabled={isDeleting}
                    >
                        No
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Eliminando..." : "Sí, eliminar"}
                    </Button>
                </div>
            </div>
        </div>
    );
}