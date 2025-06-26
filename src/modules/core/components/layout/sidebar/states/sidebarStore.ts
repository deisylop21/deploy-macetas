import { create } from 'zustand';

interface SidebarState {
    open: boolean;
    submenuStates: Record<string, boolean>;

    toggleSidebar: () => void;
    toggleSubmenu: (menuId: string) => void;
    getSubmenuState: (menuId: string) => boolean;
}

export const useSidebarStore = create<SidebarState>((set, get) => ({
    open: true,
    submenuStates: {
        users: false,
        faq: false
    },

    toggleSidebar: () => set(state => ({ open: !state.open })),

    toggleSubmenu: (menuId: string) => set(state => ({
        submenuStates: {
            ...state.submenuStates,
            [menuId]: !state.submenuStates[menuId]
        }
    })),

    getSubmenuState: (menuId: string) => {
        return get().submenuStates[menuId] || false;
    }
}));