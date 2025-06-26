import { useLocation, useNavigate } from "react-router-dom";
import { MenuItem } from "../lib/types.ts";
import { useThemeStore } from "../../../../states/themeStore";

interface SidebarItemProps {
    item: MenuItem;
    isOpen: boolean;
    isSubmenuOpen?: boolean;
    toggleSubmenu?: (id: string) => void;
    hasSubItems?: boolean;
    subActive?: boolean;
}

const SidebarItem = ({
                         item,
                         isOpen,
                         isSubmenuOpen,
                         toggleSubmenu,
                         hasSubItems = false,
                         subActive = false
                     }: SidebarItemProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const pathname = location.pathname;
    const isActive = pathname === item.route || subActive;

    const { mode } = useThemeStore();
    const isDark = mode === 'dark';

    const handleClick = () => {
        if (hasSubItems && toggleSubmenu) {
            toggleSubmenu(item.id);
        } else if (item.route) {
            navigate(item.route);
        } else if (item.onClick) {
            item.onClick();
        }
    };

    return (
        <button
            onClick={handleClick}
            className={`
                flex items-center rounded-lg transition-colors
                ${isOpen ? "pl-5 pr-3 py-3 gap-4 w-full" : "justify-center p-0 w-full h-14"}
                ${isActive
                ? isDark
                    ? "bg-green-800 text-white"
                    : "bg-green-700 text-white"
                : isDark
                    ? "hover:bg-green-700/50 text-gray-200"
                    : "hover:bg-green-500/70 text-white"
            }
            `}
        >
            <span className={`flex items-center justify-center ${isDark ? 'text-gray-200' : 'text-white'} w-8 h-8`}>
                {item.icon}
            </span>
            {isOpen && (
                <span className={`${isDark ? 'text-gray-200' : 'text-white'} font-semibold text-base text-left flex-1 truncate`}>
                    {item.label}
                </span>
            )}
            {isOpen && hasSubItems && (
                <svg
                    className={`w-4 h-4 ml-auto transition-transform ${isSubmenuOpen ? "rotate-90" : ""} ${isDark ? 'text-gray-300' : 'text-white'}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                >
                    <path d="M9 5l7 7-7 7" />
                </svg>
            )}
        </button>
    );
};

export default SidebarItem;