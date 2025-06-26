import { Button } from "../../../ui/button";
import { useThemeStore } from "../../../../states/themeStore";

interface LogoutConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const LogoutConfirmModal = ({ isOpen, onClose, onConfirm }: LogoutConfirmModalProps) => {
    const { mode } = useThemeStore();
    const isDark = mode === 'dark';

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'} rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl`}>
                <h3 className="text-lg font-semibold mb-4">Confirmar cierre de sesión</h3>
                <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    ¿Estás seguro que quieres cerrar sesión?
                </p>
                <div className="flex gap-3 justify-end">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className={isDark ? 'border-gray-600 hover:bg-gray-700' : ''}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        Cerrar sesión
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default LogoutConfirmModal;