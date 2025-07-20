import React from 'react';
import { useThemeStore } from '../../core/states/themeStore';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    type?: 'danger' | 'warning' | 'info';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
                                                              isOpen,
                                                              title,
                                                              message,
                                                              confirmText = 'Aceptar',
                                                              cancelText = 'Cancelar',
                                                              onConfirm,
                                                              onCancel,
                                                              type = 'warning'
                                                          }) => {
    const { mode } = useThemeStore();

    if (!isOpen) return null;

    const isDark = mode === 'dark';

    // Estilos según el tipo
    const getTypeConfig = () => {
        switch (type) {
            case 'danger':
                return {
                    icon: '⚠️',
                    iconBg: isDark ? 'bg-red-900/30' : 'bg-red-100',
                    confirmBg: 'bg-red-500 hover:bg-red-600',
                    borderColor: 'border-red-500'
                };
            case 'warning':
                return {
                    icon: '⚠️',
                    iconBg: isDark ? 'bg-yellow-900/30' : 'bg-yellow-100',
                    confirmBg: 'bg-yellow-500 hover:bg-yellow-600',
                    borderColor: 'border-yellow-500'
                };
            case 'info':
                return {
                    icon: 'ℹ️',
                    iconBg: isDark ? 'bg-blue-900/30' : 'bg-blue-100',
                    confirmBg: 'bg-blue-500 hover:bg-blue-600',
                    borderColor: 'border-blue-500'
                };
            default:
                return {
                    icon: '⚠️',
                    iconBg: isDark ? 'bg-yellow-900/30' : 'bg-yellow-100',
                    confirmBg: 'bg-yellow-500 hover:bg-yellow-600',
                    borderColor: 'border-yellow-500'
                };
        }
    };

    const config = getTypeConfig();

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className={`w-full max-w-md rounded-lg shadow-xl ${isDark ? 'bg-gray-800' : 'bg-white'} border-t-4 ${config.borderColor}`}>

                {/* Header con icono y título */}
                <div className="p-6 pb-4">
                    <div className="flex items-center gap-4">
                        {/* Icono */}
                        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${config.iconBg}`}>
                            <span className="text-2xl">{config.icon}</span>
                        </div>

                        {/* Título */}
                        <div className="flex-1">
                            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {title}
                            </h3>
                        </div>
                    </div>
                </div>

                {/* Mensaje */}
                <div className="px-6 pb-6">
                    <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {message}
                    </p>
                </div>

                {/* Botones */}
                <div className={`flex gap-3 px-6 py-4 border-t ${isDark ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'} rounded-b-lg`}>
                    {/* Botón Cancelar */}
                    <button
                        onClick={onCancel}
                        className={`flex-1 px-4 py-2 rounded font-medium transition-colors ${
                            isDark
                                ? 'bg-gray-600 text-white hover:bg-gray-700'
                                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                        }`}
                    >
                        {cancelText}
                    </button>

                    {/* Botón Confirmar */}
                    <button
                        onClick={onConfirm}
                        className={`flex-1 px-4 py-2 text-white rounded font-medium transition-colors ${config.confirmBg}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};