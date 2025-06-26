"use client";

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
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
            <div className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'} rounded-2xl shadow-2xl w-full max-w-md p-4 relative`}>
                <div className="flex flex-col gap-4">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>{message}</p>

                    <div className="flex justify-end gap-2 mt-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            className={`px-4 py-1.5 rounded-lg ${
                                isDark
                                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                            } font-semibold transition`}
                            disabled={isDeleting}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition"
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Eliminando..." : "Eliminar"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}