import { ReactComponent as MenuIcon } from "../../../../../../assets/icons/MenuIcon.svg";
import { useThemeStore } from "../../../../states/themeStore";

interface SidebarToggleProps {
    onClick: () => void;
    isOpen: boolean; // ← Necesitamos saber si está abierto o cerrado
}

const SidebarToggle = ({ onClick, isOpen }: SidebarToggleProps) => {
    const { mode } = useThemeStore();
    const isDark = mode === 'dark';

    return (
        <div className={`p-3 border-b ${isDark ? 'border-green-700/60' : 'border-green-500/40'}`}>
            <button
                onClick={onClick}
                className={`
                    flex items-center rounded-lg transition-colors w-full
                    ${isOpen
                    ? "pl-5 pr-3 py-3 gap-4 justify-start" // ← Abierto: alineado izquierda
                    : "justify-center p-0 h-14"            // ← Cerrado: centrado como los demás
                }
                    ${isDark ? "hover:bg-green-700/50 text-gray-200" : "hover:bg-green-500/70 text-white"}
                `}
                aria-label="Toggle sidebar"
            >
                <span className="flex items-center justify-center w-6 h-6">
                    <MenuIcon className="w-6 h-6" />
                </span>
            </button>
        </div>
    );
};

export default SidebarToggle;