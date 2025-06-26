import { ReactNode } from 'react';

export interface User {
    name: string;
    avatarUrl?: string;
    picture?: string;
    email?: string;
    type?: string;
    sub?: string;
}

export interface SubMenuItem {
    id: string;
    label: string;
    icon: ReactNode;
    route?: string;
}

export interface MenuItem {
    id: string;
    icon: ReactNode;
    label: string;
    route?: string;
    subItems?: SubMenuItem[];
    onClick?: () => void;
}

export interface SidebarProps {
    user?: User;
}