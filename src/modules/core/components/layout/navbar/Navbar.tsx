import { useSidebarState } from "../sidebar/hooks/useSidebarState";
import { useThemeStore } from "../../../states/themeStore";
import { ReactComponent as MenuIcon } from "../../../../../assets/icons/MenuIcon.svg";
import { ReactComponent as MarketPlaceIcon } from "../../../../../assets/icons/MarcketPlaceIcon.svg";
import MacetaLogo from "../../../../../assets/images/MacetasLogo.svg";
import ProfileDropdown from "../sidebar/components/ProfileDropdown";
import { useAuthStore } from "../../../states/authStore";

const Navbar = () => {
    const { toggleSidebar } = useSidebarState();
    const { mode } = useThemeStore();
    const isDark = mode === 'dark';
    const { user: authUser } = useAuthStore();

    const currentUser = {
        name: authUser?.name || "Usuario",
        avatarUrl: authUser?.picture || "https://static.vecteezy.com/system/resources/previews/005/129/844/non_2x/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg",
    };

    return (
        <header className={`fixed top-0 left-0 w-full h-16 flex items-center justify-between px-4 shadow z-50 ${isDark ? "bg-green-800" : "bg-green-600"}`}>
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className={`p-2 rounded-lg ${isDark ? "hover:bg-green-700/50 text-gray-200" : "hover:bg-green-500/70 text-white"}`}
                    aria-label="Abrir menú lateral"
                >
                    <MenuIcon className="w-7 h-7" />
                </button>
                <img src={MacetaLogo} alt="Logo Maceta" className="h-6 select-none" draggable={false} />
            </div>
            <div className="flex items-center gap-4">
                <MarketPlaceIcon className="w-7 h-7" />
                <ProfileDropdown user={currentUser} isOpen={true} />
            </div>
        </header>
    );
};

export default Navbar;