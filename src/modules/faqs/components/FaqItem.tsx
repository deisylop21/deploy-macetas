import React, { useState } from 'react';
import { useThemeStore } from '../../core/states/themeStore';
import { Faq, FaqType } from '../lib/types';
import { fetchFaqs } from '../services/faqService';
import { ConfirmModal } from './ConfirmModal';

interface FaqItemProps {
    faq: Faq;
    level?: number;
    onEdit: (faq: Faq) => void;
    onDelete: (faq: Faq) => void;
    onAddChild: (parent: Faq, type: FaqType) => void;
}

export const FaqItem: React.FC<FaqItemProps> = ({
                                                    faq,
                                                    level = 0,
                                                    onEdit,
                                                    onDelete,
                                                    onAddChild,
                                                }) => {
    const { mode } = useThemeStore();
    const [expanded, setExpanded] = useState(false);
    const [children, setChildren] = useState<Faq[]>([]);
    const [loadingChildren, setLoadingChildren] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleToggle = async () => {
        if (!faq.withchildren) return;

        setExpanded(!expanded);

        if (!expanded && children.length === 0) {
            setLoadingChildren(true);
            try {
                const childFaqs = await fetchFaqs(faq.id);
                setChildren(childFaqs);
            } catch (error) {
                console.error('Error loading children:', error);
            } finally {
                setLoadingChildren(false);
            }
        }
    };

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        setShowDeleteModal(false);
        onDelete(faq);
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
    };

    const marginLeft = level * 20;
    const isDark = mode === 'dark';

    const getBackgroundColor = () => {
        if (level === 0) return isDark ? 'bg-gray-800' : 'bg-green-50';
        if (level === 1) return isDark ? 'bg-gray-700' : 'bg-green-25';
        return isDark ? 'bg-gray-600' : 'bg-green-10';
    };

    const getBorderColor = () => {
        if (level === 0) return 'border-green-500';
        if (level === 1) return 'border-green-400';
        return 'border-green-300';
    };

    return (
        <>
            <div className="mb-2" style={{ marginLeft }}>
                <div className={`border-l-4 ${getBorderColor()} rounded p-3 ${getBackgroundColor()}`}>
                    <div className="flex items-start gap-3">
                        <span className="text-xl flex-shrink-0 mt-1">
              {faq.type === 'pregunta' ? '❓' : '✅'}
            </span>

                        <div className="flex-1 min-w-0">
                            <div
                                className={`text-sm font-medium cursor-pointer hover:opacity-80 ${isDark ? 'text-white' : 'text-gray-800'}`}
                                onClick={handleToggle}
                            >
                                {faq.content.text}
                            </div>

                            <div className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                {new Date(faq.createdAt).toLocaleDateString('es-ES', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </div>

                            {faq.content.image_url && faq.content.image_url.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {faq.content.image_url.map((url, idx) => (
                                        <div key={idx} className="relative group">
                                            <img
                                                src={url}
                                                alt={`FAQ image ${idx + 1}`}
                                                className="w-12 h-12 object-cover rounded border cursor-pointer hover:scale-105 transition-transform"
                                                onClick={() => window.open(url, '_blank')}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-1 flex-shrink-0">
                            <button
                                onClick={() => onEdit(faq)}
                                className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
                                title="Editar"
                            >
                                ✏️
                            </button>

                            <button
                                onClick={() => onAddChild(faq, faq.type === 'pregunta' ? 'respuesta' : 'pregunta')}
                                className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 transition-colors"
                                title={`Añadir ${faq.type === 'pregunta' ? 'respuesta' : 'pregunta'}`}
                            >
                                ➕
                            </button>

                            <button
                                onClick={handleDeleteClick}
                                className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors"
                                title="Eliminar"
                            >
                                🗑️
                            </button>

                            {faq.withchildren && (
                                <button
                                    onClick={handleToggle}
                                    className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 transition-colors"
                                    title={expanded ? 'Contraer' : 'Expandir'}
                                >
                                    {expanded ? '▼' : '▶'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {expanded && (
                    <div className="mt-2">
                        {loadingChildren ? (
                            <div className="flex items-center justify-center py-4">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
                                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                  Cargando hijos...
                </span>
                            </div>
                        ) : children.length > 0 ? (
                            <div className="space-y-1">
                                {children.map((child) => (
                                    <FaqItem
                                        key={child.id}
                                        faq={child}
                                        level={level + 1}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                        onAddChild={onAddChild}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    No hay {faq.type === 'pregunta' ? 'respuestas' : 'preguntas'} aún
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <ConfirmModal
                isOpen={showDeleteModal}
                title={`¿Eliminar ${faq.type}?`}
                message={`Se eliminará permanentemente esta ${faq.type} y todos sus elementos relacionados. Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                cancelText="Cancelar"
                type="danger"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </>
    );
};