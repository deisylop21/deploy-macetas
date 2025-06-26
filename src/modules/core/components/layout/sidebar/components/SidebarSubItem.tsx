import { useLocation, useNavigate } from "react-router-dom";
import { SubMenuItem } from "../lib/types.ts";
import { useThemeStore } from "../../../../states/themeStore";

interface SidebarSubItemProps {
    subItem: SubMenuItem;
}

const SidebarSubItem = ({ subItem }: SidebarSubItemProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const pathname = location.pathname;
    const isActive = pathname === subItem.route;

    const { mode } = useThemeStore();
    const isDark = mode === 'dark';

    const handleClick = () => {
        if (subItem.route) {
            navigate(subItem.route);
        }
    };

    return (
        <button
            onClick={handleClick}
            className={`
                flex items-center gap-2 w-full rounded-md px-2 py-2
                ${isActive
                ? isDark
                    ? "bg-green-800 text-white"
                    : "bg-green-700 text-white"
                : isDark
                    ? "hover:bg-green-700/50 text-gray-300"
                    : "hover:bg-green-500/70 text-white"
            }
            `}
        >
            <span className={isDark ? "text-gray-300" : "text-white"}>{subItem.icon}</span>
            <span className={`${isDark ? "text-gray-300" : "text-white"} text-sm`}>{subItem.label}</span>
        </button>
    );
};

export default SidebarSubItem;