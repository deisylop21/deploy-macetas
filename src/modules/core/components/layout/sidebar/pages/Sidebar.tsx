import { useLocation } from "react-router-dom";

import { useSidebarState } from "../hooks/useSidebarState.tsx";
import { useThemeStore } from "../../../../states/themeStore";
import { useAuthStore } from "../../../../states/authStore";
import SidebarToggle from "../components/SidebarToggle.tsx";
import SidebarItem from "../components/SidebarItem.tsx";
import SidebarSubItem from "../components/SidebarSubItem.tsx";
import ProfileDropdown from "../components/ProfileDropdown.tsx";

import { MenuItem, SidebarProps } from "../lib/types.ts";

import { ReactComponent as StatsIcon } from "../../../../../../assets/icons/StatsIcon.svg";
import { ReactComponent as PlantIcon } from "../../../../../../assets/icons/PlantIcon.svg";
import { ReactComponent as FaqIcon } from "../../../../../../assets/icons/FaqIcon.svg";
import { ReactComponent as UserReportsIcon } from "../../../../../../assets/icons/UserReportsIcon.svg";
import { ReactComponent as PersonalReportsIcon } from "../../../../../../assets/icons/PersonalReportsIcon.svg";
import { ReactComponent as ReportsAttendedIcon } from "../../../../../../assets/icons/ReportsAttendedIcon.svg";
import { ReactComponent as FaqIcon2 } from "../../../../../../assets/icons/FaqIcon2.svg";
import { ReactComponent as UserIcon } from "../../../../../../assets/icons/UserIcon.svg";
import { ReactComponent as UserGeneralIcon } from "../../../../../../assets/icons/UserGeneralIcon.svg";
import { ReactComponent as UserAdminIcon } from "../../../../../../assets/icons/UserAdminIcon.svg";
import { ReactComponent as ManagmentModulesIcon } from "../../../../../../assets/icons/ManagmentModulesIcon.svg";
import { ReactComponent as ManagmentRolesIcon } from "../../../../../../assets/icons/ManagmentRolesIcon.svg";
import { ReactComponent as CatalogyPlantsIcon } from "../../../../../../assets/icons/CatalogyPlantsIcon.svg";
import { ReactComponent as FamilyPlantsIcon } from "../../../../../../assets/icons/FamilyPlantsIcon.svg";
import { ReactComponent as GenusPlantsIcon } from "../../../../../../assets/icons/GenusPlantsIcon.svg";
import { ReactComponent as SpeciesPlantsIcon } from "../../../../../../assets/icons/SpeciesPlantsIcon.svg";

const SIDEBAR_WIDTH_OPEN = "w-64";
const SIDEBAR_WIDTH_CLOSED = "w-16";

const scrollbarHideClass = "scrollbar-none";

const Sidebar = ({ user }: SidebarProps) => {
    const { open, getSubmenuState, toggleSidebar, toggleSubmenu } = useSidebarState();
    const location = useLocation();
    const pathname = location.pathname;

    const { mode } = useThemeStore();
    const isDark = mode === 'dark';

    const { user: authUser, userType } = useAuthStore();

    const currentUser = {
        name: user?.name || authUser?.name || "Usuario",
        avatarUrl: user?.avatarUrl || authUser?.picture || "https://static.vecteezy.com/system/resources/previews/005/129/844/non_2x/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg",
    };

    const userTypeFromStore = userType || "user";

    const menuItems: MenuItem[] = [
        {
            id: "plants",
            icon: <PlantIcon className="w-6 h-6" />,
            label: "Plantas",
            subItems: [
                {
                    id: "plant-catalog",
                    label: "Catálogo",
                    icon: <CatalogyPlantsIcon className="w-5 h-5" />,
                    route: "/plants/catalog"
                },
                {
                    id: "plant-family",
                    label: "Familias",
                    icon: <FamilyPlantsIcon className="w-5 h-5" />,
                    route: "/plants/family"
                },
                {
                    id: "plant-genus",
                    label: "Género",
                    icon: <GenusPlantsIcon className="w-5 h-5" />,
                    route: "/plants/genus"
                },
                {
                    id: "plant-species",
                    label: "Especies",
                    icon: <SpeciesPlantsIcon className="w-5 h-5" />,
                    route: "/plants/species"
                },
            ],
        },
        {
            id: "stats",
            icon: <StatsIcon className="w-6 h-6" />,
            label: "Estadísticas",
        },
        {
            id: "users",
            icon: <UserIcon className="w-6 h-6" />,
            label: "Gestión de usuarios",
            subItems: [
                { id: "user-general", label: "General", icon: <UserGeneralIcon className="w-5 h-5" /> },
                ...(userTypeFromStore === "superadmin"
                    ? [
                        {
                            id: "user-admin",
                            label: "Administrador",
                            icon: <UserAdminIcon className="w-5 h-5" />,
                            route: "/users/admin",
                        },
                    ]
                    : []),
            ],
        },
        ...(userTypeFromStore === "superadmin"
                ? [
                    {
                        id: "modules",
                        icon: <ManagmentModulesIcon className="w-6 h-6" />,
                        label: "Gestión de Módulos",
                        route: "/modules",
                    }
                ]
                : []
        ),
        ...(userTypeFromStore === "superadmin"
                ? [
                    {
                        id: "roles",
                        icon: <ManagmentRolesIcon className="w-6 h-6" />,
                        label: "Gestión de Roles",
                        route: "/roles",
                    }
                ]
                : []
        ),
        {
            id: "faq",
            icon: <FaqIcon className="w-6 h-6" />,
            label: "FAQ",
            subItems: [
                { id: "user-reports", label: "Reportes de usuario", icon: <UserReportsIcon className="w-5 h-5" /> },
                { id: "plant-reports", label: "Reportes de personal", icon: <PersonalReportsIcon className="w-5 h-5" /> },
                { id: "resolved-reports", label: "Reportes atendidos", icon: <ReportsAttendedIcon className="w-5 h-5" /> },
                { id: "faq-program", label: "Programación de FAQ", icon: <FaqIcon2 className="w-5 h-5" /> },
            ],
        },
    ];

    const isSubActive = (subItems: any[]) =>
        subItems?.some(sub => sub.route && pathname.startsWith(sub.route));

    return (
        <>
            <style jsx>{`
                .scrollbar-none::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-none {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>

            <nav
                className={`flex flex-col h-screen 
                    ${open ? SIDEBAR_WIDTH_OPEN : SIDEBAR_WIDTH_CLOSED}
                    ${isDark ? 'bg-green-800' : 'bg-green-600'} 
                    transition-all duration-300`
                }
            >
                <SidebarToggle onClick={toggleSidebar} isOpen={open} />

                <div className={`flex-1 overflow-y-auto ${scrollbarHideClass}`}>
                    <ul className="flex flex-col gap-2 mt-2 pb-4">
                        {menuItems.map((item) => {
                            if (item.subItems) {
                                if (!item.subItems.length) return null;
                                const isSubmenuOpen = getSubmenuState(item.id);
                                const subActive = isSubActive(item.subItems);

                                return (
                                    <li key={item.id}>
                                        <SidebarItem
                                            item={item}
                                            isOpen={open}
                                            isSubmenuOpen={isSubmenuOpen}
                                            toggleSubmenu={toggleSubmenu}
                                            hasSubItems={true}
                                            subActive={subActive}
                                        />
                                        {open && isSubmenuOpen && (
                                            <ul className={`ml-8 mt-1 flex flex-col gap-1 ${isDark ? 'bg-green-900/30' : 'bg-green-700/30'} rounded-md py-1`}>
                                                {item.subItems.map((subItem) => (
                                                    <li key={subItem.id}>
                                                        <SidebarSubItem subItem={subItem} />
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                );
                            }
                            return (
                                <li key={item.id}>
                                    <SidebarItem item={item} isOpen={open} />
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <div className={`flex flex-col p-3 border-t ${isDark ? 'border-green-700/60' : 'border-green-500/40'}`}>
                    <ProfileDropdown user={currentUser} isOpen={open} />
                </div>
            </nav>
        </>
    );
};

export default Sidebar;