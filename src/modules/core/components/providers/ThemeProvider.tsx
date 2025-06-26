import { ReactNode, useEffect } from 'react';
import { useThemeStore } from '../../states/themeStore';

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const { mode } = useThemeStore();

    useEffect(() => {
        if (mode === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [mode]);

    return <>{children}</>;
};