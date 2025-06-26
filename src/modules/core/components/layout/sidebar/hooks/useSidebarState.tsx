import { useSidebarStore } from "../states/sidebarStore";

export const useSidebarState = () => {
    const {
        open,
        toggleSidebar,
        toggleSubmenu,
        getSubmenuState
    } = useSidebarStore();

    const faqOpen = getSubmenuState('faq');
    const usersOpen = getSubmenuState('users');

    return {
        open,
        faqOpen,
        usersOpen,
        toggleSidebar,
        toggleSubmenu,
        getSubmenuState
    };
};