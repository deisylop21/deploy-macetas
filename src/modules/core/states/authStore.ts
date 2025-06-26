import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { LoginResponse, User, AuthState } from '../../auth/lib/types.ts';
import { setAuthToken, removetoken } from '../utils/UtilsFuntions.ts';

interface AuthStoreState extends AuthState {
    setAuthState: (data: LoginResponse) => void;
    clearAuth: () => void;
    validateToken: () => void;
    initializeAuth: () => void;
}

const isTokenValid = (token: string): boolean => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        return payload.exp && payload.exp > currentTime;
    } catch (error) {
        console.warn('Token validation failed:', error);
        return false;
    }
};

export const useAuthStore = create<AuthStoreState>()(
    persist(
        (set, get) => ({
            isAuthenticated: false,
            token: null,
            userType: null,
            user: null,

            setAuthState: (data: LoginResponse) => {
                if (data.token && data.user) {
                    setAuthToken(data.token);

                    set({
                        isAuthenticated: true,
                        token: data.token,
                        userType: data.user.type,
                        user: data.user
                    });
                }
            },

            clearAuth: () => {
                removetoken();
                set({
                    isAuthenticated: false,
                    token: null,
                    userType: null,
                    user: null
                });
            },

            validateToken: () => {
                const currentToken = get().token;

                if (!currentToken) {
                    get().clearAuth();
                    return;
                }

                if (!isTokenValid(currentToken)) {
                    get().clearAuth();
                    return;
                }
            },

            initializeAuth: () => {
                const { token, user } = get();

                if (token && user && isTokenValid(token)) {
                    set({
                        isAuthenticated: true,
                        token,
                        userType: user.type,
                        user
                    });
                } else {
                    get().clearAuth();
                }
            }
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage)
        }
    )
);