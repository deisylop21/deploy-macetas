"use client";

interface DeviceDeleteModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    deviceName?: string;
    isDark?: boolean;
    isDeleting?: boolean;
}

export function DeviceDeleteModal({
                                      open,
                                      onClose,
                                      onConfirm,
                                      deviceName,
                                      isDark = false,
                                      isDeleting = false
                                  }: DeviceDeleteModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
            <div className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'} rounded-2xl shadow-2xl w-full max-w-md p-6 relative`}>
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                        <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                        ¿Eliminar dispositivo?
                    </h3>
                    <p className={`text-sm mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        ¿Estás seguro de que deseas eliminar el dispositivo <strong>"{deviceName}"</strong>? Esta acción no se puede deshacer.
                    </p>
                    <div className="flex justify-center gap-3">
                        <button
                            onClick={onClose}
                            className={`px-4 py-2 rounded-lg ${
                                isDark
                                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                            } font-semibold transition`}
                            disabled={isDeleting}
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition"
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