import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../../../ui/avatar";
import { useThemeStore } from "../../../../states/themeStore";
import { useAuthStore } from "../../../../states/authStore";
import LogoutConfirmModal from "./LogoutConfirmModal";
import { ROUTES } from "../../../../router/path";
import { ReactComponent as LogoutIcon } from "../../../../../../assets/icons/LogoutIcon.svg";

interface ProfileDropdownProps {
    user: {
        name: string;
        avatarUrl: string;
    };
    isOpen: boolean;
}

const ProfileDropdown = ({ user, isOpen }: ProfileDropdownProps) => {
    const navigate = useNavigate();
    const { mode, toggleTheme } = useThemeStore();
    const { clearAuth } = useAuthStore();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const isDark = mode === 'dark';

    const handleGoToProfile = () => {
        navigate(ROUTES.PROFILE);
    };

    const handleToggleTheme = () => {
        toggleTheme();
    };

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const handleConfirmLogout = () => {
        clearAuth();
        navigate(ROUTES.LOGIN);
        setShowLogoutModal(false);
    };

    const handleCancelLogout = () => {
        setShowLogoutModal(false);
    };

    const initials = user.name
        ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
        : "US";

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        className={`
                            flex items-center rounded-lg transition-colors w-full
                            ${isOpen ? "pl-5 pr-3 py-3 gap-4" : "justify-center p-0 h-14"}
                            ${isDark ? "hover:bg-green-700/50 text-gray-200" : "hover:bg-green-500/70 text-white"}
                        `}
                    >
                        <span className="flex items-center justify-center w-8 h-8">
                            <Avatar className="w-8 h-8">
                                <AvatarImage src={user.avatarUrl} alt={user.name} />
                                <AvatarFallback>
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                        </span>
                        {isOpen && (
                            <span className={`${isDark ? 'text-gray-200' : 'text-white'} font-semibold text-base text-left flex-1 truncate`}>
                                {user.name}
                            </span>
                        )}
                    </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    className={`w-56 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
                    side="right"
                    align="end"
                >
                    <DropdownMenuItem
                        onClick={handleGoToProfile}
                        className={`${isDark ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-100'}`}
                    >
                        <Avatar className="w-4 h-4 mr-2">
                            <AvatarImage src={user.avatarUrl} alt={user.name} />
                            <AvatarFallback className="text-xs">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        Ir a perfil
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className={isDark ? 'bg-gray-700' : 'bg-gray-200'} />

                    <DropdownMenuItem
                        onClick={handleToggleTheme}
                        className={`${isDark ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-100'}`}
                    >
                        <span className="w-4 h-4 mr-2 flex items-center justify-center">
                            {!isDark ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                                </svg>
                            )}
                        </span>
                        {isDark ? 'Modo claro' : 'Modo oscuro'}
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className={isDark ? 'bg-gray-700' : 'bg-gray-200'} />

                    <DropdownMenuItem
                        onClick={handleLogoutClick}
                        className={`${isDark ? 'hover:bg-red-900/20 text-red-400' : 'hover:bg-red-50 text-red-600'}`}
                    >
                        <LogoutIcon className="w-4 h-4 mr-2" />
                        Cerrar sesión
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <LogoutConfirmModal
                isOpen={showLogoutModal}
                onClose={handleCancelLogout}
                onConfirm={handleConfirmLogout}
            />
        </>
    );
};

export default ProfileDropdown;